"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

function getBaseUrl(headersList: Headers): string {
  // 1. Utiliser la variable d'environnement si définie
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // 2. Essayer le header origin
  const origin = headersList.get("origin")
  if (origin && !origin.includes("localhost")) {
    return origin
  }

  // 3. Construire à partir du header host
  const host = headersList.get("host")
  if (host && !host.includes("localhost")) {
    const protocol = headersList.get("x-forwarded-proto") || "https"
    return `${protocol}://${host}`
  }

  // 4. Fallback pour le développement local
  return "http://localhost:3000"
}

export async function signInWithOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()

  if (!email) {
    redirect("/login?error=missing_email")
  }

  const supabase = await createClient()

  const headersList = await headers()
  const baseUrl = getBaseUrl(headersList)
  const redirectTo = `${baseUrl}/auth/callback`

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/login?checkEmail=1")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
