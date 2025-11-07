alter table public.profiles enable row level security;
alter table public.sites enable row level security;
alter table public.templates enable row level security;
alter table public.inspections enable row level security;
alter table public.inspection_items enable row level security;
alter table public.inspection_images enable row level security;
alter table public.inspection_events enable row level security;

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
on public.profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_admin_read_all" on public.profiles;
create policy "profiles_admin_read_all"
on public.profiles for select to authenticated
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role in ('full_admin','admin')));

drop policy if exists "sites_read" on public.sites;
create policy "sites_read" on public.sites for select to authenticated using (true);

drop policy if exists "sites_all_admins" on public.sites;
create policy "sites_all_admins"
on public.sites for all to authenticated
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role in ('full_admin','admin')))
with check (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role in ('full_admin','admin')));

drop policy if exists "templates_read" on public.templates;
create policy "templates_read" on public.templates for select to authenticated using (true);

drop policy if exists "templates_manage_admins" on public.templates;
create policy "templates_manage_admins"
on public.templates for all to authenticated
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role in ('full_admin','admin')))
with check (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role in ('full_admin','admin')));

drop policy if exists "inspections_read" on public.inspections;
create policy "inspections_read" on public.inspections for select to authenticated using (true);

drop policy if exists "inspections_insert_any" on public.inspections;
create policy "inspections_insert_any" on public.inspections for insert to authenticated with check (true);

drop policy if exists "inspections_update_any" on public.inspections;
create policy "inspections_update_any" on public.inspections for update to authenticated using (true) with check (true));

drop policy if exists "inspections_delete_admins" on public.inspections;
create policy "inspections_delete_admins"
on public.inspections for delete to authenticated
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role in ('full_admin','admin')));

drop policy if exists "inspection_items_read" on public.inspection_items;
create policy "inspection_items_read" on public.inspection_items for select to authenticated using (true);

drop policy if exists "inspection_items_ins" on public.inspection_items;
create policy "inspection_items_ins" on public.inspection_items for insert to authenticated with check (true);

drop policy if exists "inspection_items_upd" on public.inspection_items;
create policy "inspection_items_upd" on public.inspection_items for update to authenticated using (true) with check (true);

drop policy if exists "inspection_items_del_admins" on public.inspection_items;
create policy "inspection_items_del_admins"
on public.inspection_items for delete to authenticated
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role in ('full_admin','admin')));

drop policy if exists "inspection_images_read" on public.inspection_images;
create policy "inspection_images_read" on public.inspection_images for select to authenticated using (true);

drop policy if exists "inspection_images_ins" on public.inspection_images;
create policy "inspection_images_ins" on public.inspection_images for insert to authenticated with check (true);

drop policy if exists "inspection_events_read" on public.inspection_events;
create policy "inspection_events_read" on public.inspection_events for select to authenticated using (true);

drop policy if exists "inspection_events_ins" on public.inspection_events;
create policy "inspection_events_ins" on public.inspection_events for insert to authenticated with check (true);
