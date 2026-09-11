-- Private request attachments. A random per-file path is an upload-only capability.
create schema if not exists nexora_private;
revoke all on schema nexora_private from public;
grant usage on schema nexora_private to anon, authenticated;

create function nexora_private.valid_attachments(items jsonb, order_id uuid)
returns boolean language plpgsql immutable set search_path = '' as $$
declare item jsonb;
begin
  if jsonb_typeof(items) <> 'array' or jsonb_array_length(items) > 5 then return false; end if;
  for item in select value from jsonb_array_elements(items) loop
    if jsonb_typeof(item) <> 'object'
      or not (item ?& array['path','name','size','type'])
      or jsonb_typeof(item->'name') <> 'string'
      or length(item->>'name') not between 1 and 200
      or jsonb_typeof(item->'size') <> 'number'
      or (item->>'size')::numeric not between 1 and 10485760
      or item->>'path' !~ ('^' || order_id::text || '/[0-9a-f-]{36}\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|csv|png|jpg|jpeg|zip|dwg|dxf)$')
      or jsonb_typeof(item->'path') <> 'string'
      or jsonb_typeof(item->'type') <> 'string'
      or length(item->>'type') > 150 then return false; end if;
  end loop;
  return (select count(*) = count(distinct value->>'path') from jsonb_array_elements(items));
exception when others then return false;
end $$;
revoke all on function nexora_private.valid_attachments(jsonb,uuid) from public;
grant execute on function nexora_private.valid_attachments(jsonb,uuid) to anon, authenticated;
alter table public.orders add column attachments jsonb not null default '[]'::jsonb
  check (nexora_private.valid_attachments(attachments,id));
grant insert (attachments) on public.orders to anon, authenticated;

-- An internal, non-API lookup is necessary because guests cannot read orders.
-- Authorization is the unguessable exact path, not user_metadata or a public order ID.
-- No data is returned. Upload window is 24 hours; no overwrites/deletes are granted.
create function nexora_private.can_upload_attachment(object_path text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.orders o
    where o.id::text = split_part(object_path,'/',1)
      and o.created_at > now() - interval '24 hours'
      and exists (select 1 from jsonb_array_elements(o.attachments) a where a->>'path' = object_path)
  );
$$;
revoke all on function nexora_private.can_upload_attachment(text) from public;
grant execute on function nexora_private.can_upload_attachment(text) to anon, authenticated;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('request-files','request-files',false,10485760,array[
'application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation',
'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
'text/plain','text/csv','image/png','image/jpeg','application/zip','application/octet-stream','image/vnd.dwg','image/vnd.dxf'
]);
create policy request_attachment_upload on storage.objects for insert to anon,authenticated
with check (bucket_id = 'request-files' and nexora_private.can_upload_attachment(name));
create policy admin_attachment_read on storage.objects for select to authenticated
using (bucket_id = 'request-files' and exists(select 1 from public.admins where user_id = (select auth.uid())));
