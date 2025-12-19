import Link from "next/link"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { signOut } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { ModalsProvider } from "@/components/modals-provider"
import { getCurrentProfile, getProgrammeEvents } from "./actions"
import { 
  Home, 
  Calendar, 
  Camera, 
  Plane, 
  Settings,
  LogOut,
  MapPin
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/evenements", label: "Événements", icon: Calendar },
  { href: "/galerie", label: "Galerie", icon: Camera },
  { href: "/sejour", label: "Mon séjour", icon: Plane },
]

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si pas connecté, rediriger vers login
  if (!user) {
    redirect("/login")
  }

  // Récupérer le profil complet
  const profile = await getCurrentProfile()

  // Si onboarding pas complété, rediriger vers onboarding
  if (!profile?.onboarding_completed) {
    redirect("/onboarding")
  }

  // Récupérer les événements pour le stepper (si nécessaire)
  const events = !profile.welcome_seen ? await getProgrammeEvents() : []

  return (
    <div className="min-h-screen bg-section-warm">
      {/* Provider pour les modales (Welcome + EventStepper) */}
      <ModalsProvider profile={profile} events={events} />

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gold-200/30 bg-white/80 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-gold-200/30 px-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 via-terracotta-500 to-oasis-500 shadow-lg shadow-gold-500/25">
                  <span className="font-display text-lg font-bold text-white">60</span>
                </div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold-400 to-terracotta-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
              </div>
              <div>
                <span className="block font-display text-base font-semibold text-foreground">
                  Yvonne
                </span>
                <span className="block text-xs text-muted-foreground">
                  Marrakech 2026
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    "text-muted-foreground hover:bg-gold-100/50 hover:text-foreground",
                    "group"
                  )}
                >
                  <Icon className="h-5 w-5 text-gold-600 transition-transform group-hover:scale-110" />
                  {item.label}
                </Link>
              )
            })}

            {/* Lien vers infos pratiques */}
            <Link
              href="/#infos"
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:bg-gold-100/50 hover:text-foreground",
                "group"
              )}
            >
              <MapPin className="h-5 w-5 text-oasis-600 transition-transform group-hover:scale-110" />
              Infos pratiques
            </Link>
          </nav>

          {/* Footer */}
          <div className="border-t border-gold-200/30 p-4">
            {/* User info */}
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-gold-50/50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-terracotta-400 text-sm font-bold text-white">
                {profile?.prenom?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {profile?.prenom || user.email?.split("@")[0]}
                </p>
                <p className="text-xs text-muted-foreground">Invité</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              {profile?.role === "admin" && (
                <Button asChild variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
                  <Link href="/admin">
                    <Settings className="h-4 w-4" />
                    Administration
                  </Link>
                </Button>
              )}
              <form action={signOut}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="submit" 
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-gold-200/30 bg-white/90 backdrop-blur-xl px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 via-terracotta-500 to-oasis-500">
            <span className="font-display text-sm font-bold text-white">60</span>
          </div>
          <span className="font-display text-base font-semibold text-foreground">Yvonne</span>
        </Link>

        <div className="flex items-center gap-2">
          {profile?.role === "admin" && (
            <Button asChild variant="ghost" size="icon" className="h-9 w-9">
              <Link href="/admin">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <form action={signOut}>
            <Button variant="ghost" size="icon" type="submit" className="h-9 w-9">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gold-200/30 bg-white/95 backdrop-blur-xl px-2 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Main Content */}
      <main className="min-h-screen pt-16 pb-20 lg:pl-64 lg:pt-0 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
