-- ⚠️ SCRIPT POUR CRÉER UN ADMIN
-- Exécute ce script dans le SQL Editor de Supabase
-- Remplace l'email par ton email

-- Option A : Si tu as déjà un compte (tu t'es déjà connecté une fois)
-- Trouve ton user_id et mets à jour le rôle :

UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'TON_EMAIL@example.com'
);

-- Option B : Créer un nouvel admin depuis zéro
-- Note: Cette méthode nécessite la Service Role Key
-- Il vaut mieux utiliser le Dashboard Supabase pour créer l'utilisateur
-- puis exécuter la requête ci-dessus pour le promouvoir admin.

-- Vérifier les admins existants :
-- SELECT p.id, u.email, p.role, p.prenom, p.nom 
-- FROM public.profiles p
-- JOIN auth.users u ON u.id = p.id
-- WHERE p.role = 'admin';




