-- Ferienwohnung Fichter: Impressionen (Fotos der Gegend) und Gästestimmen.
-- Einmal im Supabase SQL Editor von „Homepage_Alex_2“ ausführen (nach ferienwohnungen.sql).
-- Die Fotos liegen im vorhandenen Foto-Ordner „fewo“ unter impressionen/.

create table public.fewo_impressionen (
  id uuid primary key default gen_random_uuid(),
  sort integer not null default 0,
  pfad text not null,
  text_de text, text_en text, text_fr text,
  created_at timestamptz not null default now()
);

-- Zitate aus FeWo-direkt-Bewertungen, wörtlich und mit Quelle. Nur Vorname oder Initial.
create table public.fewo_stimmen (
  id uuid primary key default gen_random_uuid(),
  sort integer not null default 0,
  text text not null,
  name text,
  monat text,
  created_at timestamptz not null default now()
);

alter table public.fewo_impressionen enable row level security;
alter table public.fewo_stimmen enable row level security;

create policy "FeWo: Impressionen lesen" on public.fewo_impressionen for select using (true);
create policy "FeWo: Impressionen pflegen" on public.fewo_impressionen for all to authenticated using (public.is_fewo_admin()) with check (public.is_fewo_admin());
create policy "FeWo: Stimmen lesen" on public.fewo_stimmen for select using (true);
create policy "FeWo: Stimmen pflegen" on public.fewo_stimmen for all to authenticated using (public.is_fewo_admin()) with check (public.is_fewo_admin());

grant select on public.fewo_impressionen, public.fewo_stimmen to anon, authenticated;
grant insert, update, delete on public.fewo_impressionen, public.fewo_stimmen to authenticated;

NOTIFY pgrst, 'reload schema';
