-- Redesign: the seven named themes become one identity in two modes.
-- Map every stored value to 'dark' (the new default) so the check holds.
alter table public.site_settings drop constraint if exists site_settings_theme_check;
update public.site_settings set theme = 'dark';
alter table public.site_settings alter column theme set default 'dark';
alter table public.site_settings add constraint site_settings_theme_check
  check (theme in ('light','dark'));
