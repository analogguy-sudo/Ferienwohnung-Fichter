// Abgleich mit FeWo-direkt über iCal.
// GET  ?wohnung=wohnung-1  → Kalender mit den Tagen aus dem Admin-Bereich (zum Import bei FeWo-direkt).
// POST ?abgleich=1         → holt die Buchungen von FeWo-direkt und ersetzt die Einträge mit quelle = 'fewo'.
// Es werden nur Anreise und Abreise gespeichert, keine Namen oder Texte aus FeWo-direkt.

const projectUrl = Deno.env.get('SUPABASE_URL')!;
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const restHeaders = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
};
const MIN_ABSTAND_MS = 2 * 60_000;

async function rest(path: string, init: RequestInit = {}) {
  const response = await fetch(`${projectUrl}/rest/v1/${path}`, { ...init, headers: { ...restHeaders, ...init.headers } });
  if (!response.ok) throw new Error(`Datenbank: ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : await response.json();
}

const heute = () => new Date().toISOString().slice(0, 10);
const stamp = (day: string) => day.replaceAll('-', '');

// ---------- Export ----------
async function exportiere(wohnung: string) {
  const rows: { id: number; von: string; bis: string }[] = await rest(
    `fewo_belegt?select=id,von,bis&wohnung=eq.${encodeURIComponent(wohnung)}&quelle=eq.admin&bis=gte.${heute()}&order=von`,
  );
  const jetzt = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ferienwohnung Fichter//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...rows.flatMap((r) => [
      'BEGIN:VEVENT',
      `UID:belegt-${r.id}@ferienwohnung-fichter`,
      `DTSTAMP:${jetzt}`,
      `DTSTART;VALUE=DATE:${stamp(r.von)}`,
      `DTEND;VALUE=DATE:${stamp(r.bis)}`,
      'SUMMARY:Belegt',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'max-age=300' },
  });
}

// ---------- Import ----------
function datum(wert: string) {
  const m = wert.match(/(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}
function naechsterTag(day: string) {
  const d = new Date(day + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function leseIcs(text: string) {
  if (!text.includes('BEGIN:VCALENDAR')) throw new Error('Antwort ist kein iCal-Kalender');
  const lines = text.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
  const zeitraeume: { von: string; bis: string }[] = [];
  let ev: Record<string, string> | null = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') ev = {};
    else if (line === 'END:VEVENT' && ev) {
      const von = datum(ev.DTSTART ?? '');
      let bis = datum(ev.DTEND ?? '');
      if (von && ev.STATUS?.toUpperCase() !== 'CANCELLED') {
        if (!bis || bis <= von) bis = naechsterTag(von);
        zeitraeume.push({ von, bis });
      }
      ev = null;
    } else if (ev) {
      const i = line.indexOf(':');
      if (i > 0) ev[line.slice(0, i).split(';')[0].toUpperCase()] = line.slice(i + 1).trim();
    }
  }
  return zeitraeume;
}

async function gleicheAb() {
  const eintraege: { wohnung: string; import_url: string | null; letzter_abgleich: string | null }[] =
    await rest('fewo_abgleich?select=wohnung,import_url,letzter_abgleich');
  const ergebnis: Record<string, string> = {};
  for (const e of eintraege) {
    if (!e.import_url) { ergebnis[e.wohnung] = 'kein Link'; continue; }
    if (e.letzter_abgleich && Date.now() - Date.parse(e.letzter_abgleich) < MIN_ABSTAND_MS) {
      ergebnis[e.wohnung] = 'gerade erst abgeglichen'; continue;
    }
    let fehler: string | null = null;
    try {
      const response = await fetch(e.import_url, { headers: { 'User-Agent': 'Ferienwohnung-Fichter-Kalender/1.0' } });
      if (!response.ok) throw new Error(`FeWo-direkt antwortet mit ${response.status}`);
      const zeitraeume = leseIcs(await response.text()).filter((z) => z.bis >= heute());
      const w = encodeURIComponent(e.wohnung);
      await rest(`fewo_belegt?wohnung=eq.${w}&quelle=eq.fewo`, { method: 'DELETE' });
      if (zeitraeume.length) {
        await rest('fewo_belegt', {
          method: 'POST',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify(zeitraeume.map((z) => ({ wohnung: e.wohnung, ...z, quelle: 'fewo' }))),
        });
      }
      ergebnis[e.wohnung] = `${zeitraeume.length} Zeiträume`;
    } catch (err) {
      fehler = String((err as Error).message ?? err).slice(0, 300);
      ergebnis[e.wohnung] = 'Fehler: ' + fehler;
    }
    await rest(`fewo_abgleich?wohnung=eq.${encodeURIComponent(e.wohnung)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ letzter_abgleich: new Date().toISOString(), fehler }),
    });
  }
  return ergebnis;
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
};

if (import.meta.main) Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
  const params = new URL(request.url).searchParams;
  try {
    if (params.has('abgleich')) {
      return new Response(JSON.stringify(await gleicheAb()), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    const wohnung = params.get('wohnung') ?? '';
    if (!/^[a-z0-9-]{1,40}$/.test(wohnung)) return new Response('Not found', { status: 404 });
    return await exportiere(wohnung);
  } catch (err) {
    console.error(err);
    return new Response('Fehler', { status: 500, headers: cors });
  }
});
