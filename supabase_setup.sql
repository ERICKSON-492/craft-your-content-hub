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
