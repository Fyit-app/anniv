-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION COMPLÈTE À EXÉCUTER DANS SUPABASE SQL EDITOR
-- Copiez tout ce contenu et exécutez-le dans Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. COLONNES ONBOARDING DANS PROFILES
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS arrival_date date;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS departure_date date;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS arrival_transport text;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS arrival_airport text;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS residence_location text;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS group_name text;

-- Contrainte pour arrival_transport
DO $$
BEGIN
  ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_arrival_transport_check 
  CHECK (arrival_transport IN ('avion', 'train', 'voiture', 'autre'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. TABLE FAMILY_MEMBERS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  first_name text NOT NULL,
  is_minor boolean NOT NULL DEFAULT false,
  email text,
  invitation_sent_at timestamptz,
  linked_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Si la table existe déjà, ajouter les colonnes manquantes
ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS email text;

ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS invitation_sent_at timestamptz;

ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS linked_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index pour rechercher par email
CREATE INDEX IF NOT EXISTS family_members_email_idx ON public.family_members(email) WHERE email IS NOT NULL;

-- RLS family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "family_members_select_own_or_admin" ON public.family_members;
CREATE POLICY "family_members_select_own_or_admin"
ON public.family_members FOR SELECT
USING (auth.uid() = profile_id OR public.is_admin());

DROP POLICY IF EXISTS "family_members_insert_own" ON public.family_members;
CREATE POLICY "family_members_insert_own"
ON public.family_members FOR INSERT
WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "family_members_update_own_or_admin" ON public.family_members;
CREATE POLICY "family_members_update_own_or_admin"
ON public.family_members FOR UPDATE
USING (auth.uid() = profile_id OR public.is_admin())
WITH CHECK (auth.uid() = profile_id OR public.is_admin());

DROP POLICY IF EXISTS "family_members_delete_own_or_admin" ON public.family_members;
CREATE POLICY "family_members_delete_own_or_admin"
ON public.family_members FOR DELETE
USING (auth.uid() = profile_id OR public.is_admin());

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. TABLE EVENTS (si pas déjà créée)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  location text,
  max_participants int,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_authenticated" ON public.events;
CREATE POLICY "events_select_authenticated"
ON public.events FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "events_insert_admin" ON public.events;
CREATE POLICY "events_insert_admin"
ON public.events FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "events_update_admin" ON public.events;
CREATE POLICY "events_update_admin"
ON public.events FOR UPDATE
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "events_delete_admin" ON public.events;
CREATE POLICY "events_delete_admin"
ON public.events FOR DELETE USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. TABLE EVENT_REGISTRATIONS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  num_participants int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, profile_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "event_registrations_select_own_or_admin" ON public.event_registrations;
CREATE POLICY "event_registrations_select_own_or_admin"
ON public.event_registrations FOR SELECT
USING (auth.uid() = profile_id OR public.is_admin());

DROP POLICY IF EXISTS "event_registrations_insert_own" ON public.event_registrations;
CREATE POLICY "event_registrations_insert_own"
ON public.event_registrations FOR INSERT
WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "event_registrations_update_own" ON public.event_registrations;
CREATE POLICY "event_registrations_update_own"
ON public.event_registrations FOR UPDATE
USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "event_registrations_delete_own" ON public.event_registrations;
CREATE POLICY "event_registrations_delete_own"
ON public.event_registrations FOR DELETE
USING (auth.uid() = profile_id);

-- Fonction pour compter les participants
CREATE OR REPLACE FUNCTION public.get_event_participants_count(event_uuid uuid)
RETURNS int
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(num_participants), 0)::int
  FROM public.event_registrations
  WHERE event_id = event_uuid;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- TERMINÉ ! Rafraîchissez votre application
-- ═══════════════════════════════════════════════════════════════════════════

