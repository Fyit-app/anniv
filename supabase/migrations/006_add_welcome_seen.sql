-- Migration: Ajouter welcome_seen à profiles
-- Cette colonne permet de n'afficher la modale de bienvenue qu'une seule fois

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS welcome_seen boolean NOT NULL DEFAULT false;

-- Commentaire pour documentation
COMMENT ON COLUMN public.profiles.welcome_seen IS 'Indique si l''utilisateur a vu la modale de bienvenue après onboarding';




