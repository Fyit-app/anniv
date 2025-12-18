-- Migration: Ajout des fonctionnalités de gestion de groupe
-- - group_name dans profiles pour nommer le groupe (ex: "Famille Dupont")
-- - email dans family_members pour inviter les majeurs
-- 
-- ⚠️ IMPORTANT: Exécutez ce script dans Supabase SQL Editor (Dashboard > SQL Editor)

-- ═══════════════════════════════════════════════════════════════════════════
-- PROFILES: Ajout des colonnes manquantes
-- ═══════════════════════════════════════════════════════════════════════════

-- Ajout du nom de groupe dans profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS group_name text;

-- ═══════════════════════════════════════════════════════════════════════════
-- FAMILY_MEMBERS: Ajout des colonnes pour les invitations
-- ═══════════════════════════════════════════════════════════════════════════

-- Ajout de l'email dans family_members pour les invitations
ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS email text;

-- Ajout d'une colonne pour tracker si une invitation a été envoyée
ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS invitation_sent_at timestamptz;

-- Ajout d'une colonne pour lier le membre à un compte utilisateur s'il s'inscrit
ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS linked_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index pour rechercher par email
CREATE INDEX IF NOT EXISTS family_members_email_idx ON public.family_members(email) WHERE email IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════════════════
-- COMMENTAIRES
-- ═══════════════════════════════════════════════════════════════════════════

COMMENT ON COLUMN public.profiles.group_name IS 'Nom du groupe/famille (ex: Famille Dupont)';
COMMENT ON COLUMN public.family_members.email IS 'Email du membre (pour invitation si majeur)';
COMMENT ON COLUMN public.family_members.invitation_sent_at IS 'Date d''envoi de l''invitation';
COMMENT ON COLUMN public.family_members.linked_user_id IS 'ID utilisateur si le membre s''est inscrit';

