-- Migration: Ajouter le système de publication pour les événements
-- Les événements créés seront en brouillon par défaut

-- Ajouter la colonne published à la table events
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

-- Mettre à jour la policy pour que les invités ne voient que les événements publiés
-- Les admins voient tous les événements (publiés et brouillons)
DROP POLICY IF EXISTS "events_select_authenticated" ON public.events;

CREATE POLICY "events_select_authenticated"
ON public.events
FOR SELECT
TO authenticated
USING (published = true OR public.is_admin());

