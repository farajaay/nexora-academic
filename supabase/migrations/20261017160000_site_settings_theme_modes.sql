-- Redesign: the seven named themes become one identity in two modes.
-- Map every stored value to 'light' first so the new check always holds.
alter table public.site_settings drop constraint if exists site_settings_theme_check;
update public.site_settings set theme = 'light';
alter table public.site_settings alter column theme set default 'light';
alter table public.site_settings add constraint site_settings_theme_check
  check (theme in ('light','dark'));
