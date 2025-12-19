"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

/**
 * Envoie un code OTP par email
 * Utilise le type 'email' pour envoyer un code à 6 chiffres
 */
export async function sendOtpCode(email: string): Promise<{ error?: string; waitSeconds?: number }> {
  if (!email) {
    return { error: "L'email est requis" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Ne pas créer d'utilisateur si l'email n'existe pas
      // Mettre à true si vous voulez permettre l'auto-inscription
      shouldCreateUser: true,
    },
  })

  if (error) {
    console.error("Erreur OTP:", error)
    
    // Messages d'erreur user-friendly
    // Gestion du rate limit Supabase (code: over_email_send_rate_limit)
    if (error.message.includes("security purposes") || error.message.includes("rate limit") || error.code === "over_email_send_rate_limit") {
      // Essayer d'extraire le nombre de secondes du message
      const secondsMatch = error.message.match(/after (\d+) seconds/)
      if (secondsMatch) {
        const seconds = parseInt(secondsMatch[1], 10)
        return { 
          error: `Patiente ${seconds} secondes avant de redemander un code.`,
          waitSeconds: seconds 
        }
      }
      return { error: "Trop de tentatives. Réessaie dans quelques instants.", waitSeconds: 60 }
    }
    if (error.message.includes("not allowed")) {
      return { error: "Cet email n'est pas autorisé à accéder au site." }
    }
    
    return { error: "Une erreur s'est produite. Veuillez réessayer." }
  }

  return {}
}

/**
 * Vérifie le code OTP saisi par l'utilisateur
 */
export async function verifyOtpCode(
  email: string, 
  token: string
): Promise<{ error?: string; needsOnboarding?: boolean }> {
  if (!email || !token) {
    return { error: "Email et code requis" }
  }

  // Log pour debug
  console.log("Vérification OTP pour:", email, "avec token:", token.substring(0, 2) + "****")

  // Nettoyer le token (supprimer les espaces éventuels)
  const cleanToken = token.replace(/\s/g, "")

  // Supabase envoie des codes de 6 ou 8 chiffres selon la configuration
  if (!/^\d{6,8}$/.test(cleanToken)) {
    return { error: "Le code doit contenir 6 à 8 chiffres" }
  }

  const supabase = await createClient()

  // Essayer d'abord avec type "email", puis "magiclink" si ça échoue
  let data, error
  
  // Essai 1: type "email" (pour les vrais codes OTP)
  const result1 = await supabase.auth.verifyOtp({
    email,
    token: cleanToken,
    type: "email",
  })
  
  if (!result1.error) {
    data = result1.data
    error = null
  } else {
    // Essai 2: type "magiclink" (pour les tokens de magic link)
    console.log("Essai avec type magiclink...")
    const result2 = await supabase.auth.verifyOtp({
      email,
      token: cleanToken,
      type: "magiclink",
    })
    data = result2.data
    error = result2.error
  }

  if (error) {
    console.error("Erreur vérification OTP:", error)
    
    // Le code "otp_expired" peut signifier :
    // 1. Le code a vraiment expiré (après ~10 min)
    // 2. Un nouveau code a été demandé (l'ancien est invalidé)
    // 3. Le code est incorrect
    if (error.code === "otp_expired" || error.message.includes("expired") || error.message.includes("invalid")) {
      return { 
        error: "Code invalide ou expiré. Si tu as demandé un nouveau code, utilise uniquement le dernier reçu." 
      }
    }
    
    return { error: "Erreur de vérification. Veuillez réessayer." }
  }

  if (!data.user) {
    return { error: "Utilisateur non trouvé" }
  }

  // Vérifier si l'onboarding est complété
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", data.user.id)
    .single()

  // Redirection selon l'état d'onboarding
  if (!profile?.onboarding_completed) {
    redirect("/onboarding")
  }

  redirect("/dashboard")
}

/**
 * Renvoie un nouveau code OTP
 */
export async function resendOtpCode(email: string): Promise<{ error?: string; waitSeconds?: number }> {
  return sendOtpCode(email)
}

/**
 * Déconnexion
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
