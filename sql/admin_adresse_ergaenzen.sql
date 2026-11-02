-- Ergänzt fichter-alexander@outlook.de als Admin der Ferienwohnungen.
-- Einmal im SQL Editor von „Homepage_Alex_2“ ausführen.
create or replace function public.is_fewo_admin() returns boolean
  language sql stable set search_path = ''
  as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) in ('a_t_f@outlook.de', 'fichter_alexander@icloud.com', 'fichter-alexander@outlook.de') $$;
