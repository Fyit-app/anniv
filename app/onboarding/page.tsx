import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingWizard } from "./onboarding-wizard"
import { getProfile, getFamilyMembers } from "./actions"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si pas connecté, rediriger vers login
  if (!user) {
    redirect("/login")
  }

  // Si onboarding déjà complété, rediriger vers dashboard
  const profile = await getProfile()
  if (profile?.onboarding_completed) {
    redirect("/dashboard")
  }

  // Récupérer les données existantes
  const familyMembers = await getFamilyMembers()

  return (
    <div className="min-h-screen bg-section-warm pattern-zellige">
      {/* Header décoratif */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-8 md:py-12">
        {/* Logo / Titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <span className="text-3xl">🌴</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
            Bienvenue à Marrakech
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Complétez ces quelques informations pour nous aider à organiser votre séjour
          </p>
        </div>

        {/* Formulaire d'onboarding */}
        <OnboardingWizard
          initialProfile={profile}
          initialFamilyMembers={familyMembers}
          userPrenom={profile?.prenom || user.email?.split("@")[0] || ""}
        />
      </div>
    </div>
  )
}

