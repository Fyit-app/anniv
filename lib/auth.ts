import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export type UserRole = "admin" | "invite"

export async function getCurrentUserRole() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  return (profile?.role as UserRole | undefined) ?? null
}

export async function requireAdmin() {
  const role = await getCurrentUserRole()

  if (role !== "admin") {
    redirect("/dashboard")
  }

  return role
}
