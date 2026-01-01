-- Migration: Correction du storage pour les images d'événements
-- Le bucket doit être public pour que les images soient accessibles
-- Et les admins doivent pouvoir uploader dans le dossier events/

-- Rendre le bucket photos public pour permettre l'accès aux images
UPDATE storage.buckets 
SET public = true 
WHERE id = 'photos';

-- Ajouter une policy pour permettre aux admins d'uploader dans n'importe quel dossier
DROP POLICY IF EXISTS "storage_photos_insert_admin" ON storage.objects;
CREATE POLICY "storage_photos_insert_admin"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos'
  AND public.is_admin()
);

-- Permettre à tous les utilisateurs authentifiés de voir les images publiques (événements)
DROP POLICY IF EXISTS "storage_photos_select_public" ON storage.objects;
CREATE POLICY "storage_photos_select_public"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'photos'
);

-- Permettre aux admins de supprimer n'importe quelle image
DROP POLICY IF EXISTS "storage_photos_delete_admin" ON storage.objects;
CREATE POLICY "storage_photos_delete_admin"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos'
  AND public.is_admin()
);

