-- Migration: Ajouter le système de publication pour les annonces
-- Les annonces créées seront en brouillon par défaut

-- Ajouter la colonne published à la table messages
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

-- Mettre à jour la policy pour que les invités ne voient que les messages publiés
-- Les admins voient tous les messages (publiés et brouillons)
DROP POLICY IF EXISTS "messages_select_authenticated" ON public.messages;

CREATE POLICY "messages_select_authenticated"
ON public.messages
FOR SELECT
TO authenticated
USING (published = true OR public.is_admin());

