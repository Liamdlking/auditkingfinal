insert into public.profiles (id, email, role)
select id, email, 'full_admin'
from auth.users
where lower(email)=lower('admin@auditking.com')
on conflict (id) do update set role='full_admin', email=excluded.email;

insert into public.sites (id, name)
values (gen_random_uuid(), 'Main Plant'), (gen_random_uuid(), 'Warehouse A'), (gen_random_uuid(), 'Site Bravo')
on conflict do nothing;
