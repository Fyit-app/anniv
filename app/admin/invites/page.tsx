import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import {
  UserPlus,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Users,
  Search,
  Trash2,
  Send,
  UserCheck,
  AlertCircle,
} from "lucide-react"

import { createInvite, deleteInvite, sendInvitation } from "./actions"

type SearchParams = {
  error?: string
  created?: string
  deleted?: string
  invited?: string
}

type ProfileWithEmail = {
  id: string
  role: string
  prenom: string | null
  nom: string | null
  telephone: string | null
  onboarding_completed: boolean
  arrival_date: string | null
  departure_date: string | null
  email?: string
  familyCount?: number
}

export default async function AdminInvitesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { error, created, deleted, invited } = await searchParams

  const supabase = await createClient()
  
  // Récupérer les profils
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role, prenom, nom, telephone, onboarding_completed, arrival_date, departure_date")
    .order("nom", { ascending: true })

  // Récupérer les membres de famille pour chaque profil
  const { data: familyMembers } = await supabase
    .from("family_members")
    .select("profile_id")

  // Compter les membres par profil
  const familyCounts = familyMembers?.reduce((acc, fm) => {
    acc[fm.profile_id] = (acc[fm.profile_id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const profilesWithCounts: ProfileWithEmail[] = (profiles || []).map((p) => ({
    ...p,
    familyCount: familyCounts[p.id] || 0,
  }))

  const invites = profilesWithCounts.filter((p) => p.role === "invite")
  const admins = profilesWithCounts.filter((p) => p.role === "admin")
  
  const onboardingCompleted = invites.filter((p) => p.onboarding_completed).length
  const onboardingPending = invites.length - onboardingCompleted

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-terracotta-600 bg-clip-text text-transparent">
            Gestion des invités
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez et gérez les comptes des invités
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1.5">
            <Users className="w-4 h-4 mr-1" />
            {invites.length} invités
          </Badge>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-gold-50 to-gold-100/50 border-gold-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gold-700">Total invités</p>
                <p className="text-3xl font-bold text-gold-800">{invites.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-gold-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-oasis-50 to-oasis-100/50 border-oasis-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-oasis-700">Confirmés</p>
                <p className="text-3xl font-bold text-oasis-800">{onboardingCompleted}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-oasis-500/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-oasis-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">En attente</p>
                <p className="text-3xl font-bold text-amber-800">{onboardingPending}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages de feedback */}
      {created && (
        <div className="p-4 bg-oasis-50 border border-oasis-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-oasis-600" />
          <p className="text-oasis-700">Invité créé avec succès !</p>
        </div>
      )}
      {deleted && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-amber-600" />
          <p className="text-amber-700">Invité supprimé.</p>
        </div>
      )}
      {invited && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
          <Send className="w-5 h-5 text-blue-600" />
          <p className="text-blue-700">Invitation envoyée par email !</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{decodeURIComponent(error)}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Formulaire de création */}
        <Card className="bg-card-premium lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold-500" />
              Nouvel invité
            </CardTitle>
            <CardDescription>
              Créer un compte invité avec connexion Magic Link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createInvite} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" htmlFor="email">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="invité@email.com"
                  required
                  className="bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="prenom">
                    Prénom
                  </label>
                  <Input
                    id="prenom"
                    name="prenom"
                    type="text"
                    placeholder="Jean"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="nom">
                    Nom
                  </label>
                  <Input
                    id="nom"
                    name="nom"
                    type="text"
                    placeholder="Dupont"
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" htmlFor="telephone">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Téléphone
                </label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  className="bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="send_invitation"
                  name="send_invitation"
                  className="w-4 h-4 rounded border-gray-300"
                  defaultChecked
                />
                <label htmlFor="send_invitation" className="text-sm text-muted-foreground">
                  Envoyer l'invitation par email
                </label>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-600 hover:to-terracotta-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Créer l'invité
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liste des invités */}
        <Card className="bg-card-premium lg:col-span-2">
          <CardHeader>
            <CardTitle>Liste des invités</CardTitle>
            <CardDescription>
              {invites.length} invité(s) · Cliquez pour voir les détails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invites.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun invité pour le moment</p>
                <p className="text-sm">Créez votre premier invité avec le formulaire</p>
              </div>
            ) : (
              invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                      invite.onboarding_completed 
                        ? 'bg-gradient-to-br from-oasis-400 to-oasis-600'
                        : 'bg-gradient-to-br from-amber-400 to-amber-600'
                    }`}>
                      {(invite.prenom?.[0] || invite.nom?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">
                        {[invite.prenom, invite.nom].filter(Boolean).join(' ') || 'Sans nom'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {invite.telephone && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {invite.telephone}
                          </span>
                        )}
                        {invite.familyCount && invite.familyCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            +{invite.familyCount} accompagnant{invite.familyCount > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {invite.onboarding_completed ? (
                      <Badge className="bg-oasis-100 text-oasis-700 border-oasis-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Confirmé
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        <Clock className="w-3 h-3 mr-1" />
                        En attente
                      </Badge>
                    )}

                    {invite.arrival_date && (
                      <Badge variant="outline" className="hidden sm:flex">
                        {new Date(invite.arrival_date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </Badge>
                    )}

                    <form action={sendInvitation}>
                      <input type="hidden" name="user_id" value={invite.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>

                    <form action={deleteInvite}>
                      <input type="hidden" name="user_id" value={invite.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admins */}
      {admins.length > 0 && (
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="text-lg">Administrateurs</CardTitle>
            <CardDescription>{admins.length} admin(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {(admin.prenom?.[0] || 'A').toUpperCase()}
                  </div>
                  <span className="font-medium text-purple-900">
                    {[admin.prenom, admin.nom].filter(Boolean).join(' ') || 'Admin'}
                  </span>
                  <Badge className="bg-purple-500 text-white text-xs">Admin</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
