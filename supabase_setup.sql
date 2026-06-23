-- ============================================================
-- Elite Stainless — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query → Run
-- ============================================================

-- 1. ROLES -----------------------------------------------------
create type if not exists public.app_role as enum ('admin', 'user');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create policy "users read own roles"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- 2. SITE CONTENT (key/value) ---------------------------------
create table if not exists public.site_content (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);
grant select on public.site_content to anon, authenticated;
grant all on public.site_content to authenticated, service_role;
alter table public.site_content enable row level security;

create policy "anyone reads site content" on public.site_content for select using (true);
create policy "admins write site content" on public.site_content
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 3. PRODUCTS --------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  image_url text,
  created_at timestamptz default now()
);
grant select on public.products to anon, authenticated;
grant all on public.products to authenticated, service_role;
alter table public.products enable row level security;

create policy "anyone reads products" on public.products for select using (true);
create policy "admins write products" on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 4. PROJECTS --------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  description text,
  image_url text,
  created_at timestamptz default now()
);
grant select on public.projects to anon, authenticated;
grant all on public.projects to authenticated, service_role;
alter table public.projects enable row level security;

create policy "anyone reads projects" on public.projects for select using (true);
create policy "admins write projects" on public.projects
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 5. CONTACT MESSAGES -----------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project_type text,
  message text not null,
  created_at timestamptz default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;

create policy "anyone submits messages" on public.contact_messages
  for insert with check (true);
create policy "admins read messages" on public.contact_messages
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admins delete messages" on public.contact_messages
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- AFTER SIGNING UP your first user in the app, promote them:
--   insert into public.user_roles (user_id, role)
--   values ('<paste-user-id-from-auth.users>', 'admin');
-- ============================================================

-- 6. SERVICES (home page "From concept to installation" cards) ---
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz default now()
);
grant select on public.services to anon, authenticated;
grant all on public.services to authenticated, service_role;
alter table public.services enable row level security;

create policy "anyone reads services" on public.services for select using (true);
create policy "admins write services" on public.services
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 7. STORAGE BUCKET: site-images -----------------------------
-- Used for services, projects, and other public site imagery.
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

-- Public read access (bucket is public, but explicit policy is required)
create policy "public read site-images"
on storage.objects for select
using (bucket_id = 'site-images');

-- Only admins can upload/update/delete
create policy "admins upload site-images"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));

create policy "admins update site-images"
on storage.objects for update to authenticated
using (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));

create policy "admins delete site-images"
on storage.objects for delete to authenticated
using (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 8. ECOMMERCE: products price/images, orders, order_items
-- ============================================================

alter table public.products
  add column if not exists price numeric(10,2) not null default 0,
  add column if not exists images text[] not null default '{}',
  add column if not exists stock int;

do $$ begin
  create type public.order_status as enum ('pending','paid','shipped','delivered','cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  full_name text not null,
  phone text,
  address1 text not null,
  address2 text,
  city text not null,
  country text not null,
  postal_code text,
  notes text,
  subtotal numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status public.order_status not null default 'pending',
  created_at timestamptz default now()
);
grant insert on public.orders to anon, authenticated;
grant select on public.orders to anon, authenticated;
grant update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;

create policy "anyone places order" on public.orders
  for insert with check (true);
create policy "owner reads own order" on public.orders
  for select using (
    user_id = auth.uid() or public.has_role(auth.uid(), 'admin')
  );
create policy "anon reads own order by id" on public.orders
  for select to anon using (true);
create policy "admins update orders" on public.orders
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "admins delete orders" on public.orders
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  image_url text,
  created_at timestamptz default now()
);
grant insert, select on public.order_items to anon, authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;

create policy "anyone inserts order items" on public.order_items
  for insert with check (true);
create policy "anyone reads order items" on public.order_items
  for select using (true);
create policy "admins manage order items" on public.order_items
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 7. ORDER TRACKING + EMAIL (append-only, safe to re-run)
-- ============================================================
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists tracking_url text;
alter table public.orders add column if not exists last_email_sent_at timestamptz;

-- ============================================================
-- 8. INVENTORY + M-PESA (append-only, safe to re-run)
-- ============================================================

-- Payment / M-Pesa fields on orders
alter table public.orders add column if not exists payment_method text;
alter table public.orders add column if not exists mpesa_phone text;
alter table public.orders add column if not exists mpesa_checkout_request_id text;
alter table public.orders add column if not exists mpesa_receipt text;
alter table public.orders add column if not exists paid_at timestamptz;
create index if not exists orders_mpesa_checkout_idx
  on public.orders (mpesa_checkout_request_id);

-- Block order_items when stock is insufficient (stock = NULL means unlimited)
create or replace function public.check_stock_before_order_item()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  available int;
  pname text;
begin
  if new.product_id is null then
    return new;
  end if;
  select stock, name into available, pname from public.products where id = new.product_id;
  if available is not null and available < new.quantity then
    raise exception 'Insufficient stock for %: only % left', coalesce(pname, 'product'), available
      using errcode = 'P0001';
  end if;
  return new;
end $$;

drop trigger if exists trg_check_stock on public.order_items;
create trigger trg_check_stock
  before insert on public.order_items
  for each row execute function public.check_stock_before_order_item();

-- Decrement stock when an order transitions into 'paid'
create or replace function public.decrement_stock_on_paid()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (old.status is distinct from 'paid') and new.status = 'paid' then
    update public.products p
       set stock = greatest(0, p.stock - oi.quantity)
      from public.order_items oi
     where oi.order_id = new.id
       and oi.product_id = p.id
       and p.stock is not null;
    if new.paid_at is null then
      new.paid_at := now();
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_decrement_stock on public.orders;
create trigger trg_decrement_stock
  before update on public.orders
  for each row execute function public.decrement_stock_on_paid();
