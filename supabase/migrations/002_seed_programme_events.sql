-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: Activités du programme comme événements
-- Exécuter ce script pour ajouter les activités auxquelles les invités peuvent s'inscrire
-- ═══════════════════════════════════════════════════════════════════════════

-- Ajouter une colonne pour identifier le type d'événement (programme vs autre)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_type text DEFAULT 'custom';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price_info text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS programme_day text; -- ex: 'lundi', 'mardi'...

-- Supprimer les événements du programme existants (pour pouvoir relancer le script)
DELETE FROM public.events WHERE event_type = 'programme';

-- Mardi 13 janvier - Jardin Majorelle
INSERT INTO public.events (title, description, event_date, location, max_participants, event_type, price_info, programme_day)
VALUES (
  'Visite du Jardin Majorelle',
  'Un jardin botanique légendaire aux couleurs éclatantes, créé par le peintre français Jacques Majorelle et restauré par Yves Saint Laurent.',
  '2026-01-13 10:00:00+01',
  'Jardin Majorelle, Marrakech',
  NULL,
  'programme',
  '16€ / personne',
  'mardi'
);

-- Mardi 13 janvier - Palais de la Bahia
INSERT INTO public.events (title, description, event_date, location, max_participants, event_type, price_info, programme_day)
VALUES (
  'Visite du Palais de la Bahia',
  'Chef-d''œuvre de l''architecture marocaine du XIXe siècle. Un palais somptueux aux jardins luxuriants.',
  '2026-01-13 15:00:00+01',
  'Palais de la Bahia, Médina',
  NULL,
  'programme',
  '13€ / personne',
  'mardi'
);

-- Mercredi 14 janvier - Vallée de l'Ourika
INSERT INTO public.events (title, description, event_date, location, max_participants, event_type, price_info, programme_day)
VALUES (
  'Excursion Vallée de l''Ourika',
  'Escapade dans les montagnes de l''Atlas. Découverte des cascades, villages berbères traditionnels et paysages à couper le souffle.',
  '2026-01-14 09:00:00+01',
  'Vallée de l''Ourika, Atlas',
  15,
  'programme',
  '24€ / personne',
  'mercredi'
);

-- Jeudi 15 janvier - Soirée anniversaire (LE JOUR J)
INSERT INTO public.events (title, description, event_date, location, max_participants, event_type, price_info, programme_day)
VALUES (
  'Soirée Anniversaire - 60 ans d''Yvonne 🎂',
  'LE JOUR J ! Nouvelle bougie, nouvelle étape. Guidée et portée par la grâce de Dieu. Moment dînatoire inoubliable pour célébrer ensemble.',
  '2026-01-15 18:00:00+01',
  'Restaurant Comptoir Darna',
  NULL,
  'programme',
  'Sur invitation',
  'jeudi'
);

-- Vendredi 16 janvier - Souks & Jemaa el-Fna
INSERT INTO public.events (title, description, event_date, location, max_participants, event_type, price_info, programme_day)
VALUES (
  'Place Jemaa el-Fna & Souks',
  'Plongez dans l''effervescence de la place mythique et perdez-vous dans les souks colorés. Shopping, découvertes et ambiance unique.',
  '2026-01-16 10:00:00+01',
  'Place Jemaa el-Fna, Médina',
  NULL,
  'programme',
  'Libre',
  'vendredi'
);

-- Samedi 17 janvier - Spa & Hammam
INSERT INTO public.events (title, description, event_date, location, max_participants, event_type, price_info, programme_day)
VALUES (
  'Détente au Spa & Hammam',
  'Moment de relaxation dans un hammam traditionnel marocain pour clôturer la semaine en beauté. Gommage, massage et détente.',
  '2026-01-17 14:00:00+01',
  'Hammam traditionnel',
  NULL,
  'programme',
  'Variable selon établissement',
  'samedi'
);

-- Index pour optimiser les requêtes par type
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_programme_day ON public.events(programme_day);





