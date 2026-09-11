-- Nexora Academic: public request insertion; admin-only reading and payment ledger.
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;
create policy own_admin_membership on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  phone text not null check (phone ~ '^(\+9665[0-9]{8}|9665[0-9]{8}|05[0-9]{8})$'),
  email text not null default '' check (char_length(email) <= 254 and (email = '' or email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  stage text not null check (stage in ('secondary','university','postgraduate')),
  major text not null check (char_length(trim(major)) between 2 and 100),
  service text not null check (service in ('homework','math','report','research','slides','visual','chapter','code','cad','translation','proofread','graduation')),
  description text not null check (char_length(trim(description)) between 20 and 4000),
  quantity integer not null check (quantity between 1 and 100000),
  pages integer not null check (pages between 1 and 10000),
  language text not null check (language in ('ar','en','specialized')),
  deadline text not null check (deadline in ('standard','day','halfday')),
  difficulty text not null check (difficulty in ('normal','medium','advanced')),
  extras text[] not null default '{}' check (extras <@ array['feedback','references']::text[] and cardinality(extras) <= 2),
  files_url text not null default '' check (char_length(files_url) <= 2048 and (files_url = '' or files_url ~ '^https://[^[:space:]]+$')),
  preferred_contact text not null check (preferred_contact in ('whatsapp','phone','email')),
  consent boolean not null check (consent = true),
  status text not null default 'new' check (status in ('new','reviewing','agreed','in_progress','completed','cancelled')),
  quoted_total numeric(12,2) check (quoted_total between 0 and 1000000),
  check (preferred_contact <> 'email' or email <> '')
);
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
-- Public clients cannot supply timestamps, status or an agreed price.
grant insert (id,name,phone,email,stage,major,service,description,quantity,pages,language,deadline,difficulty,extras,files_url,preferred_contact,consent) on public.orders to anon, authenticated;
grant select on public.orders to authenticated;
grant update (status,quoted_total) on public.orders to authenticated;
create policy submit_request on public.orders for insert to anon, authenticated
  with check (consent and status = 'new' and quoted_total is null);
create policy admin_read_orders on public.orders for select to authenticated
  using (exists(select 1 from public.admins where user_id = (select auth.uid())));
create policy admin_update_orders on public.orders for update to authenticated
  using (exists(select 1 from public.admins where user_id = (select auth.uid())))
  with check (exists(select 1 from public.admins where user_id = (select auth.uid())));

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0 and amount <= 1000000),
  reference text not null unique check (char_length(trim(reference)) between 1 and 200),
  paid_at timestamptz not null default now(),
  recorded_by uuid not null default auth.uid() references auth.users(id)
);
alter table public.payments enable row level security;
revoke all on public.payments from anon, authenticated;
grant select on public.payments to authenticated;
grant insert (order_id,amount,reference) on public.payments to authenticated;
create policy admin_read_payments on public.payments for select to authenticated
  using (exists(select 1 from public.admins where user_id = (select auth.uid())));
create policy admin_insert_payments on public.payments for insert to authenticated
  with check (recorded_by = (select auth.uid()) and exists(select 1 from public.admins where user_id = (select auth.uid())));
create index orders_created_at_idx on public.orders(created_at desc);
create index orders_status_idx on public.orders(status);
create index payments_order_id_idx on public.payments(order_id);
create index payments_recorded_by_idx on public.payments(recorded_by);
-- Admin membership must be provisioned by the operator through the SQL editor.
-- There are intentionally no client policies for adding admins or editing/deleting payments.
