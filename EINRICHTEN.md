# Einrichten (einmalig)

Alles im Supabase-Projekt **Homepage_Alex_2** (https://supabase.com/dashboard, Anmeldung mit fichter_alexander@icloud.com).

## 1. Datenbank

SQL Editor → New query → den ganzen Inhalt von `sql/ferienwohnungen.sql` einfügen → Run.
Legt die Tabellen für Wohnungen, Belegung und Abgleich an, den Foto-Ordner `fewo` und den stündlichen Abgleich.

## 2. Funktion für FeWo-direkt

Edge Functions → Deploy a new function → Via Editor:
- Name: `fewo-ical`
- Inhalt von `supabase/functions/fewo-ical/index.ts` einfügen → Deploy.
- Danach in der Funktion unter Details: **Verify JWT ausschalten** (Enforce JWT verification = aus) und speichern. Sonst kann FeWo-direkt den Kalender nicht abrufen.

Test: https://owbbsnujnkhyyqvagtai.supabase.co/functions/v1/fewo-ical?wohnung=wohnung-1 im Browser öffnen. Es muss ein Text mit `BEGIN:VCALENDAR` erscheinen.

## 2b. Automatisch übersetzen (DeepL)

1. Kostenloses Konto „DeepL API Free“ anlegen: https://www.deepl.com/pro-api (nicht das normale DeepL Pro). Unter „Konto → API-Schlüssel“ den Schlüssel kopieren (er endet auf `:fx`).
2. Supabase → Edge Functions → Secrets → Add new secret: Name `DEEPL_KEY`, Wert = der Schlüssel. Den Schlüssel nirgends sonst eintragen, auch nicht im Chat.
3. Edge Functions → Deploy a new function → Via Editor: Name `fewo-uebersetzen`, Inhalt von `supabase/functions/fewo-uebersetzen/index.ts` → Deploy. Hier **Verify JWT eingeschaltet lassen** (nur angemeldete Admins dürfen übersetzen).

Im Admin-Bereich ist das Häkchen „automatisch übersetzen“ dann standardmäßig an.

## 3. FeWo-direkt verbinden (pro Wohnung)

Im Vermieterkonto bei FeWo-direkt, Kalender der Wohnung:
1. **Exportieren**: den iCal-Link kopieren → im Admin-Bereich bei „Abgleich mit FeWo-direkt“ eintragen → „Link speichern“ → „Jetzt abgleichen“.
2. **Importieren**: den Link aus dem Admin-Bereich (Feld unten bei „Abgleich“) bei FeWo-direkt als externen Kalender eintragen.
3. Einstellung **Buchungsanfrage** statt Sofortbuchung wählen, damit Anfragen angenommen oder abgelehnt werden können.

## Gut zu wissen

- Unsere Seite holt FeWo-direkt jede Stunde (zur Minute 15). FeWo-direkt holt unseren Kalender in eigenen Abständen, meist alle paar Stunden.
- Gespeichert werden nur Anreise und Abreise, keine Gästenamen.
- Buchungen von FeWo-direkt kann man im Admin-Bereich nicht löschen, nur bei FeWo-direkt stornieren.
- Stündlichen Abgleich abschalten (SQL Editor): `select cron.unschedule('fewo-abgleich');`
