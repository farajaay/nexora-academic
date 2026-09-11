-- Three more themes: widen the allowed theme values. Alters the existing
-- table rather than repeating the site_settings migration.
alter table public.site_settings drop constraint if exists site_settings_theme_check;
alter table public.site_settings add constraint site_settings_theme_check
  check (theme in ('emerald','violet','lime','sandstone','nebula','clay'));
