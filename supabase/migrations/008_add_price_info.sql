-- Ajout du champ prix pour les événements
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price_info text;

