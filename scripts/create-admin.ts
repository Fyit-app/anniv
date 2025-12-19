/**
 * Script pour créer un compte admin
 * 
 * Usage: npx tsx scripts/create-admin.ts <email>
 * 
 * Exemple: npx tsx scripts/create-admin.ts kevin@example.com
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Variables d'environnement manquantes:")
  console.error("   - NEXT_PUBLIC_SUPABASE_URL")
  console.error("   - SUPABASE_SERVICE_ROLE_KEY")
  console.error("\nAssure-toi que ces variables sont définies dans .env.local")
  process.exit(1)
}

const email = process.argv[2]

if (!email) {
  console.error("❌ Usage: npx tsx scripts/create-admin.ts <email>")
  console.error("   Exemple: npx tsx scripts/create-admin.ts admin@example.com")
  process.exit(1)
}

async function createAdmin() {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  console.log(`\n🔧 Création du compte admin pour: ${email}\n`)

  // Vérifier si l'utilisateur existe déjà
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(u => u.email === email)

  let userId: string

  if (existingUser) {
    console.log("✅ Utilisateur existant trouvé")
    userId = existingUser.id
  } else {
    // Créer l'utilisateur
    console.log("📝 Création de l'utilisateur...")
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true, // Confirme l'email automatiquement
    })

    if (error) {
      console.error("❌ Erreur lors de la création:", error.message)
      process.exit(1)
    }

    userId = data.user!.id
    console.log("✅ Utilisateur créé")
  }

  // Mettre à jour/créer le profil avec le rôle admin
  console.log("📝 Configuration du rôle admin...")
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      role: "admin",
      prenom: "Admin",
      onboarding_completed: true,
      welcome_seen: true,
    })

  if (profileError) {
    console.error("❌ Erreur lors de la mise à jour du profil:", profileError.message)
    process.exit(1)
  }

  console.log("✅ Rôle admin configuré")

  // Envoyer le magic link
  console.log("📧 Envoi du lien de connexion...")
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
  })

  if (inviteError) {
    console.log("⚠️  Impossible d'envoyer l'invitation (peut-être déjà invité)")
    console.log("    Tu peux te connecter via /login avec ton email")
  } else {
    console.log("✅ Email d'invitation envoyé !")
  }

  console.log("\n🎉 Compte admin créé avec succès !")
  console.log(`\n📧 Email: ${email}`)
  console.log("🔐 Connecte-toi via /login pour recevoir un code de connexion")
  console.log("👑 Tu auras accès à /admin une fois connecté\n")
}

createAdmin().catch(console.error)

