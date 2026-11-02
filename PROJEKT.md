# Ferienwohnungen (Seite für Alexanders Vater)

Stand: 2. November 2026 – erste Version gebaut, noch nicht online.

## Entscheidungen (Antworten von Alexander, 2. November 2026)

- 2 Wohnungen. Ort steht noch nicht fest.
- Inhalte: Fotos, Beschreibung, Ausstattung, Preis, Belegungskalender, Lage, Kontakt.
- Buchung über Links zu FeWo-direkt (pro Wohnung ein Link).
- Sprachen: Deutsch, Englisch, Französisch – mit Hinweis, dass der Vermieter nur Deutsch spricht.
- Admin-Bereich: ja, aber nur Alexander pflegt ihn (nicht der Vater).
- Kein vorhandenes Material. Name vorläufig „Ferienwohnung Fichter“.
- Altes Supabase-Projekt „Ferienwohnung Vater“: nichts sichern, kann weg.

## Aufbau

- `index.html`, `style.css`, `app.js`: öffentliche Seite. Lädt Wohnungen und belegte Tage direkt über die Supabase-REST-Schnittstelle. Ohne Datenbank zeigt sie Platzhalter aus `daten.js`.
- `daten.js`: Supabase-Zugang, Kontaktdaten, Liste der Ausstattung (DE/EN/FR), Platzhalter.
- `admin.html`: Preise, Texte, Ausstattung, Fotos und belegte Tage pflegen.
- `impressum.html`: Impressum und Datenschutz – Platzhalter in [eckigen Klammern] müssen vor dem Veröffentlichen ausgefüllt werden.
- `supabase/functions/fewo-uebersetzen/index.ts`: übersetzt Name und Beschreibung beim Speichern mit DeepL (Secret `DEEPL_KEY`).
- `supabase/functions/fewo-ical/index.ts`: Abgleich mit FeWo-direkt per iCal in beide Richtungen (stündlich per pg_cron). Nur Daten, keine Gästenamen.
- `sql/ferienwohnungen.sql`: einmal im SQL Editor von „Homepage_Alex_2“ ausführen (Tabellen `fewo_wohnungen`, `fewo_belegt`, Foto-Ordner `fewo`).

## Ziel

Eine neue Webseite für die Ferienwohnungen von Alexanders Vater. Sie ersetzt die alte Homepage „Homepage-Alex“, die vom Netz genommen wird. Es wird nichts vom alten Code übernommen.

## Rahmen (wie die anderen Projekte)

- Statisches HTML, CSS und JavaScript, ohne Framework und ohne Build.
- Veröffentlichung über GitHub Pages im Konto analogguy-sudo (eigenes öffentliches Repository, Name noch offen). Hochladen erst nach Alexanders OK.
- Falls Daten oder ein Admin-Bereich nötig sind: Supabase-Projekt „Homepage_Alex_2“ (ref owbbsnujnkhyyqvagtai) im iCloud-Konto, so wie bei Narvaez-arts. Kein neues Supabase-Projekt anlegen (kostenloses Limit: 2 Projekte).
- Geheime Schlüssel und Passwörter gibt Alexander nur selbst im Terminal ein, nie im Chat.
- Werkzeuge und Vorlagen: `~/Projekte/_werkzeuge`, Vorbild für Admin-Bereich: `~/Projekte/Narvaez-arts/admin.html`.

## Offen (Alexander daran erinnern)

- **Impressum ausfüllen** (Name und Adresse des Vaters, Telefon, E-Mail) – vor dem Veröffentlichen! Alexander hat am 2. November 2026 ausdrücklich um Erinnerung gebeten.
- Einrichten nach `EINRICHTEN.md` (SQL, Funktion fewo-ical, FeWo-direkt verbinden).
- Bei FeWo-direkt „Buchungsanfrage“ statt „Sofortbuchung“ einstellen, damit der Vater annehmen oder ablehnen kann.

## Noch zu klären (vor dem Bauen fragen, inzwischen beantwortet)

1. Wie viele Wohnungen, und wo liegen sie?
2. Inhalte: Fotos, Beschreibung, Ausstattung, Preise, Lage/Anfahrt, Belegungskalender, Anfrageformular, Bewertungen?
3. Buchung: nur Anfrage per E-Mail/Telefon oder Links zu Airbnb/Booking?
4. Sprachen: nur Deutsch oder auch Englisch/Spanisch?
5. Soll der Vater selbst Preise oder belegte Tage ändern können (Admin-Bereich)?
6. Vorhandenes Material: Fotos, Texte, Name der Seite, bestehende Anzeigen?
7. Im alten Supabase-Konto alex.t.fichter@gmail.com gibt es ein Projekt „Ferienwohnung Vater“. Gibt es dort Daten, die vor dem Löschen des Kontos gesichert werden sollen?
