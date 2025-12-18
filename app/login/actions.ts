"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export async function signInWithOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()

  if (!email) {
    redirect("/login?error=missing_email")
  }

  const supabase = await createClient()

  const origin = (await headers()).get("origin")
  const redirectTo = origin ? `${origin}/auth/callback` : undefined

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
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
