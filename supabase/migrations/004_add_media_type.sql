-- Migration: Ajout du support des vidéos dans la galerie
-- Ajoute une colonne media_type pour distinguer images et vidéos

-- Ajouter la colonne media_type à la table photos
ALTER TABLE public.photos 
ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image' 
CHECK (media_type IN ('image', 'video'));

-- Mettre à jour les politiques de stockage pour permettre les vidéos
-- (Les politiques existantes fonctionnent déjà car elles ne filtrent pas par type de fichier)

COMMENT ON COLUMN public.photos.media_type IS 'Type de média: image ou video';





