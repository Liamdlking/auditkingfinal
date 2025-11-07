create table if not exists public.profiles (
  id uuid primary key,
  email text unique,
  role text check (role in ('full_admin','admin','user')) default 'user'
);

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  site_id uuid references public.sites (id) on delete set null
);

create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  title text,
  site_id uuid references public.sites (id) on delete set null,
  template_id uuid references public.templates (id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  state text not null default 'in_progress'
);

create table if not exists public.inspection_items (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid references public.inspections(id) on delete cascade,
  question_title text,
  response jsonb,
  note text
);

create table if not exists public.inspection_images (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid references public.inspections(id) on delete cascade,
  url text not null
);

create table if not exists public.inspection_events (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid references public.inspections(id) on delete cascade,
  kind text not null,
  at timestamptz not null default now()
);
