-- Dreamy Night theme: allow it and make it the site-wide default.
alter table public.site_settings drop constraint if exists site_settings_theme_check;
alter table public.site_settings add constraint site_settings_theme_check
  check (theme in ('emerald','violet','lime','sandstone','nebula','clay','dreamy'));
alter table public.site_settings alter column theme set default 'dreamy';
update public.site_settings set theme = 'dreamy' where id = 1;
