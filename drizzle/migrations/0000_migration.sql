create type public.app_role as enum ('admin','user');
create type public.verification_status as enum ('not_submitted','pending','verified','rejected','expired');
create type public.booking_status as enum ('pending','accepted','rejected','cancelled','onboard','completed');
create type public.ride_status as enum ('scheduled','in_progress','completed','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  email text,
  date_of_birth date,
  avatar_url text,
  language text not null default 'fr',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable by signed in" on public.profiles for select to authenticated using (true);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create policy "own roles readable" on public.user_roles for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));

create table public.driver_verification (
  user_id uuid primary key,
  status verification_status not null default 'not_submitted',
  rejection_reason text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.driver_verification to authenticated;
grant all on public.driver_verification to service_role;
alter table public.driver_verification enable row level security;
create policy "verification readable" on public.driver_verification for select to authenticated using (true);
create policy "own verification insert" on public.driver_verification for insert to authenticated with check (auth.uid() = user_id and status in ('not_submitted','pending'));
create policy "own verification submit" on public.driver_verification for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and status = 'pending');
create policy "admin verification update" on public.driver_verification for update to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.driver_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  doc_type text not null,
  file_path text not null,
  created_at timestamptz not null default now(),
  unique (user_id, doc_type)
);
grant select, insert, update, delete on public.driver_documents to authenticated;
grant all on public.driver_documents to service_role;
alter table public.driver_documents enable row level security;
create policy "own docs" on public.driver_documents for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "admin docs read" on public.driver_documents for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  brand text not null,
  model text not null,
  color text,
  plate text not null,
  seats int not null default 4,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.vehicles to authenticated;
grant all on public.vehicles to service_role;
alter table public.vehicles enable row level security;
create policy "vehicles readable" on public.vehicles for select to authenticated using (true);
create policy "own vehicles write" on public.vehicles for insert to authenticated with check (auth.uid() = user_id);
create policy "own vehicles update" on public.vehicles for update to authenticated using (auth.uid() = user_id);
create policy "own vehicles delete" on public.vehicles for delete to authenticated using (auth.uid() = user_id);

create table public.rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  from_city text not null,
  to_city text not null,
  pickup_point text,
  dropoff_point text,
  stops text[] not null default '{}',
  departure_at timestamptz not null,
  seats_total int not null check (seats_total between 1 and 8),
  price_da int not null check (price_da >= 0),
  preferences text[] not null default '{}',
  status ride_status not null default 'scheduled',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.rides to authenticated;
grant all on public.rides to service_role;
alter table public.rides enable row level security;
create policy "rides readable" on public.rides for select to authenticated using (true);
create policy "verified drivers publish" on public.rides for insert to authenticated
  with check (auth.uid() = driver_id and exists (select 1 from public.driver_verification v where v.user_id = auth.uid() and v.status = 'verified'));
create policy "own rides update" on public.rides for update to authenticated using (auth.uid() = driver_id);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  passenger_id uuid not null,
  seats int not null default 1 check (seats between 1 and 8),
  status booking_status not null default 'pending',
  message text,
  created_at timestamptz not null default now(),
  unique (ride_id, passenger_id)
);
grant select, insert, update on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "bookings visible to passenger or driver" on public.bookings for select to authenticated
  using (auth.uid() = passenger_id or exists (select 1 from public.rides r where r.id = ride_id and r.driver_id = auth.uid()));
create policy "passenger books" on public.bookings for insert to authenticated
  with check (auth.uid() = passenger_id and status = 'pending' and not exists (select 1 from public.rides r where r.id = ride_id and r.driver_id = auth.uid()));
create policy "passenger cancels" on public.bookings for update to authenticated using (auth.uid() = passenger_id) with check (status = 'cancelled');
create policy "driver manages" on public.bookings for update to authenticated
  using (exists (select 1 from public.rides r where r.id = ride_id and r.driver_id = auth.uid()));

create table public.recent_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  from_city text not null,
  to_city text not null,
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.recent_searches to authenticated;
grant all on public.recent_searches to service_role;
alter table public.recent_searches enable row level security;
create policy "own searches" on public.recent_searches for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, email, language)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.raw_user_meta_data->>'phone', new.email, coalesce(new.raw_user_meta_data->>'language','fr'));
  insert into public.driver_verification (user_id) values (new.id);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- seats left helper
create or replace function public.seats_booked(_ride uuid) returns int language sql stable security definer set search_path = public as $$
  select coalesce(sum(seats),0)::int from public.bookings where ride_id = _ride and status in ('accepted','onboard','completed')
$$;