-- Site-wide theme setting. A single row, publicly readable so the live site
-- can pick it up without authentication; only admins can change it.
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  theme text not null default 'emerald' check (theme in ('emerald','violet','lime'))
);
alter table public.site_settings enable row level security;
revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant update (theme) on public.site_settings to authenticated;
create policy public_read_theme on public.site_settings for select to anon, authenticated
  using (true);
create policy admin_update_theme on public.site_settings for update to authenticated
  using (exists(select 1 from public.admins where user_id = (select auth.uid())))
  with check (exists(select 1 from public.admins where user_id = (select auth.uid())));
-- Seeded once here; there are intentionally no client insert/delete policies,
-- so the row count can never drift from exactly one.
insert into public.site_settings (id) values (1);
