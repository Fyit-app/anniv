-- Migration: Création du bucket de stockage pour les photos et vidéos
-- À exécuter dans Supabase SQL Editor

-- Créer le bucket "photos" (privé par défaut)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  false,  -- bucket privé
  104857600,  -- 100 MB max par fichier
  ARRAY[
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];

-- Les politiques RLS sont déjà définies dans schema.sql
-- Elles permettent aux utilisateurs d'uploader dans leur propre dossier
-- et aux admins de tout voir/supprimer




