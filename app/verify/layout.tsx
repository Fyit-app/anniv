import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function VerifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Vérifier si l'utilisateur est déjà connecté
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si connecté, rediriger vers le dashboard
  if (user) {
    redirect("/dashboard")
  }

  return <>{children}</>
}

