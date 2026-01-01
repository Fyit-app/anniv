-- Schema + RLS for Anniv
-- Run this in Supabase SQL Editor.

-- Extensions
create extension if not exists pgcrypto;

-- ═══════════════════════════════════════════════════════════════════════════
-- PROFILES (avec champs onboarding)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'invite')) default 'invite',
  prenom text,
  nom text,
  telephone text,
  -- Champs onboarding
  onboarding_completed boolean not null default false,
  arrival_date date,
  departure_date date,
  arrival_transport text check (arrival_transport in ('avion', 'train', 'voiture', 'autre')),
  arrival_airport text,
  residence_location text,
  updated_at timestamptz not null default now()
);

-- Helper: is_admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

-- Policies profiles
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin"
on public.profiles
for insert
with check (auth.uid() = id or public.is_admin());

-- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, role, prenom, onboarding_completed)
  values (
    new.id, 
    'invite',
    coalesce(new.raw_user_meta_data->>'prenom', split_part(new.email, '@', 1)),
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ═══════════════════════════════════════════════════════════════════════════
-- FAMILY_MEMBERS (membres de la famille pour chaque invité)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  first_name text not null,
  is_minor boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.family_members enable row level security;

drop policy if exists "family_members_select_own_or_admin" on public.family_members;
create policy "family_members_select_own_or_admin"
on public.family_members
for select
using (auth.uid() = profile_id or public.is_admin());

drop policy if exists "family_members_insert_own" on public.family_members;
create policy "family_members_insert_own"
on public.family_members
for insert
with check (auth.uid() = profile_id);

drop policy if exists "family_members_update_own_or_admin" on public.family_members;
create policy "family_members_update_own_or_admin"
on public.family_members
for update
using (auth.uid() = profile_id or public.is_admin())
with check (auth.uid() = profile_id or public.is_admin());

drop policy if exists "family_members_delete_own_or_admin" on public.family_members;
create policy "family_members_delete_own_or_admin"
on public.family_members
for delete
using (auth.uid() = profile_id or public.is_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- EVENTS (événements disponibles)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  location text,
  max_participants int,
  image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- Les invités voient uniquement les événements publiés, les admins voient tout
drop policy if exists "events_select_authenticated" on public.events;
create policy "events_select_authenticated"
on public.events
for select
to authenticated
using (published = true or public.is_admin());

-- Seuls les admins peuvent créer/modifier/supprimer des événements
drop policy if exists "events_insert_admin" on public.events;
create policy "events_insert_admin"
on public.events
for insert
with check (public.is_admin());

drop policy if exists "events_update_admin" on public.events;
create policy "events_update_admin"
on public.events
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "events_delete_admin" on public.events;
create policy "events_delete_admin"
on public.events
for delete
using (public.is_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- EVENT_REGISTRATIONS (inscriptions aux événements)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  num_participants int not null default 1,
  created_at timestamptz not null default now(),
  -- Empêcher les inscriptions en double
  unique(event_id, profile_id)
);

alter table public.event_registrations enable row level security;

-- Voir ses propres inscriptions ou admin voit tout
drop policy if exists "event_registrations_select_own_or_admin" on public.event_registrations;
create policy "event_registrations_select_own_or_admin"
on public.event_registrations
for select
using (auth.uid() = profile_id or public.is_admin());

-- S'inscrire soi-même
drop policy if exists "event_registrations_insert_own" on public.event_registrations;
create policy "event_registrations_insert_own"
on public.event_registrations
for insert
with check (auth.uid() = profile_id);

-- Modifier ses inscriptions
drop policy if exists "event_registrations_update_own" on public.event_registrations;
create policy "event_registrations_update_own"
on public.event_registrations
for update
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

-- Supprimer ses inscriptions
drop policy if exists "event_registrations_delete_own" on public.event_registrations;
create policy "event_registrations_delete_own"
on public.event_registrations
for delete
using (auth.uid() = profile_id);

-- Fonction pour compter les participants d'un événement (accessible à tous les authentifiés)
create or replace function public.get_event_participants_count(event_uuid uuid)
returns int
language sql
stable
security definer
as $$
  select coalesce(sum(num_participants), 0)::int
  from public.event_registrations
  where event_id = event_uuid;
$$;


-- ═══════════════════════════════════════════════════════════════════════════
-- SEJOURS (ancienne table, conservée pour compatibilité)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.sejours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date_arrivee date,
  date_depart date,
  nb_personnes int,
  logement text,
  commentaire text,
  updated_at timestamptz not null default now()
);

create unique index if not exists sejours_user_id_unique on public.sejours(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sejours_set_updated_at on public.sejours;
create trigger sejours_set_updated_at
  before update on public.sejours
  for each row execute procedure public.set_updated_at();

alter table public.sejours enable row level security;

drop policy if exists "sejours_select_own_or_admin" on public.sejours;
create policy "sejours_select_own_or_admin"
on public.sejours
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "sejours_insert_own_or_admin" on public.sejours;
create policy "sejours_insert_own_or_admin"
on public.sejours
for insert
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "sejours_update_own_or_admin" on public.sejours;
create policy "sejours_update_own_or_admin"
on public.sejours
for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "sejours_delete_admin" on public.sejours;
create policy "sejours_delete_admin"
on public.sejours
for delete
using (public.is_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- PHOTOS
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now(),
  validated boolean not null default false
);

alter table public.photos enable row level security;

drop policy if exists "photos_select_validated_or_own_or_admin" on public.photos;
create policy "photos_select_validated_or_own_or_admin"
on public.photos
for select
using (
  validated = true
  or auth.uid() = user_id
  or public.is_admin()
);

drop policy if exists "photos_insert_own" on public.photos;
create policy "photos_insert_own"
on public.photos
for insert
with check (auth.uid() = user_id);

drop policy if exists "photos_update_admin" on public.photos;
create policy "photos_update_admin"
on public.photos
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "photos_delete_admin" on public.photos;
create policy "photos_delete_admin"
on public.photos
for delete
using (public.is_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- MESSAGES
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  target text not null check (target in ('all', 'invite')),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "messages_select_authenticated" on public.messages;
create policy "messages_select_authenticated"
on public.messages
for select
to authenticated
using (true);

drop policy if exists "messages_write_admin" on public.messages;
create policy "messages_write_admin"
on public.messages
for insert
with check (public.is_admin());

drop policy if exists "messages_update_admin" on public.messages;
create policy "messages_update_admin"
on public.messages
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "messages_delete_admin" on public.messages;
create policy "messages_delete_admin"
on public.messages
for delete
using (public.is_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- STORAGE (photos bucket)
-- ═══════════════════════════════════════════════════════════════════════════
-- 1) Create a bucket named 'photos' in Supabase Storage (Dashboard)
-- 2) Then apply policies below. They restrict uploads to user-owned folders.
-- Path convention: photos/{user_id}/{filename}

-- Allow authenticated users to upload only into their own folder
drop policy if exists "storage_photos_insert_own_folder" on storage.objects;
create policy "storage_photos_insert_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own objects; admins can read everything; others read only validated photos via DB.
drop policy if exists "storage_photos_select_own_or_admin" on storage.objects;
create policy "storage_photos_select_own_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'photos'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

-- Allow users to delete their own objects; admins can delete everything
drop policy if exists "storage_photos_delete_own_or_admin" on storage.objects;
create policy "storage_photos_delete_own_or_admin"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'photos'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);
