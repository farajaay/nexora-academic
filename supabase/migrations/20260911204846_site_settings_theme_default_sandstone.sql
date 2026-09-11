-- Switch the default/current site theme to Golden Sandstone.
alter table public.site_settings alter column theme set default 'sandstone';
update public.site_settings set theme = 'sandstone' where id = 1;
