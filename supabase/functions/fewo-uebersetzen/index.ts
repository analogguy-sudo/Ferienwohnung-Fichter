// Übersetzt deutsche Texte aus dem Admin-Bereich mit DeepL ins Englische und Französische.
// POST { "texte": ["…", "…"] }  →  { "en": ["…"], "fr": ["…"] }
// Nur für angemeldete Admins (geprüft über public.is_fewo_admin). Der DeepL-Schlüssel liegt
// als Secret DEEPL_KEY bei Supabase (Edge Functions → Secrets), nie im Code.

const projectUrl = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const deeplKey = Deno.env.get('DEEPL_KEY') ?? '';
const deeplUrl = deeplKey.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
};
const antwort = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

async function istAdmin(request: Request) {
  const response = await fetch(`${projectUrl}/rest/v1/rpc/is_fewo_admin`, {
    method: 'POST',
    headers: {
      apikey: request.headers.get('apikey') ?? anonKey,
      Authorization: request.headers.get('Authorization') ?? '',
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
  return response.ok && (await response.json()) === true;
}

async function uebersetze(texte: string[], ziel: string) {
  const response = await fetch(deeplUrl, {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${deeplKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texte, source_lang: 'DE', target_lang: ziel }),
  });
  if (response.status === 456) throw new Error('DeepL: Monatskontingent aufgebraucht');
  if (!response.ok) throw new Error(`DeepL antwortet mit ${response.status}`);
  const data: { translations: { text: string }[] } = await response.json();
  return data.translations.map((t) => t.text);
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (request.method !== 'POST') return antwort({ fehler: 'Nur POST' }, 405);
  if (!deeplKey) return antwort({ fehler: 'DEEPL_KEY fehlt bei Supabase (Edge Functions → Secrets)' }, 500);
  if (!(await istAdmin(request)))return antwort({ fehler: 'Nicht erlaubt' }, 403);

  try {
    const { texte } = await request.json();
    if (!Array.isArray(texte) || !texte.length || texte.length > 10 || texte.some((t) => typeof t !== 'string' || t.length > 5000)) {
      return antwort({ fehler: 'Ungültige Texte' }, 400);
    }
    const [en, fr] = await Promise.all([uebersetze(texte, 'EN-GB'), uebersetze(texte, 'FR')]);
    return antwort({ en, fr });
  } catch (err) {
    return antwort({ fehler: String((err as Error).message ?? err) }, 502);
  }
});
