import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  Settings,
  Crown,
  UserPlus,
  Shield,
  ShieldOff,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Mail,
  User,
  Info,
} from "lucide-react"

import { addAdmin, removeAdmin, createAdminUser } from "./actions"

type SearchParams = {
  error?: string
  success?: string
  removed?: string
  created?: string
}

export default async function AdminParametresPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { error, success, removed, created } = await searchParams

  const supabase = await createClient()
  const admin = createAdminClient()

  // Récupérer l'utilisateur actuel
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  // Récupérer tous les admins
  const { data: admins } = await supabase
    .from("profiles")
    .select("id, prenom, nom, telephone")
    .eq("role", "admin")
    .order("nom", { ascending: true })

  // Récupérer les emails des admins via l'admin client
  const adminsWithEmail = await Promise.all(
    (admins || []).map(async (adminProfile) => {
      const { data } = await admin.auth.admin.getUserById(adminProfile.id)
      return {
        ...adminProfile,
        email: data.user?.email || "Email inconnu",
        isCurrentUser: adminProfile.id === currentUser?.id,
      }
    })
  )

  // Récupérer les invités pour les promouvoir admin
  const { data: invites } = await supabase
    .from("profiles")
    .select("id, prenom, nom")
    .eq("role", "invite")
    .order("nom", { ascending: true })

  const invitesWithEmail = await Promise.all(
    (invites || []).map(async (invite) => {
      const { data } = await admin.auth.admin.getUserById(invite.id)
      return {
        ...invite,
        email: data.user?.email || "Email inconnu",
      }
    })
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-terracotta-600 bg-clip-text text-transparent">
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez les administrateurs et les accès
        </p>
      </div>

      {/* Messages de feedback */}
      {success && (
        <div className="p-4 bg-oasis-50 border border-oasis-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-oasis-600" />
          <p className="text-oasis-700">Administrateur ajouté avec succès !</p>
        </div>
      )}
      {created && (
        <div className="p-4 bg-oasis-50 border border-oasis-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-oasis-600" />
          <p className="text-oasis-700">Nouvel administrateur créé et invitation envoyée !</p>
        </div>
      )}
      {removed && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <ShieldOff className="w-5 h-5 text-amber-600" />
          <p className="text-amber-700">Droits administrateur révoqués.</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{decodeURIComponent(error)}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Liste des admins */}
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold-500" />
              Administrateurs actuels
            </CardTitle>
            <CardDescription>
              {adminsWithEmail.length} administrateur(s) avec tous les droits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminsWithEmail.map((adminUser) => (
              <div
                key={adminUser.id}
                className="flex items-center justify-between p-4 rounded-xl border bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    {(adminUser.prenom?.[0] || adminUser.email[0] || 'A').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {[adminUser.prenom, adminUser.nom].filter(Boolean).join(' ') || 'Admin'}
                      {adminUser.isCurrentUser && (
                        <Badge className="bg-gold-100 text-gold-700 text-xs">Vous</Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{adminUser.email}</p>
                  </div>
                </div>
                {!adminUser.isCurrentUser && (
                  <form action={removeAdmin}>
                    <input type="hidden" name="user_id" value={adminUser.id} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      title="Révoquer les droits admin"
                    >
                      <ShieldOff className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Créer un nouvel admin */}
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-oasis-500" />
              Créer un nouvel admin
            </CardTitle>
            <CardDescription>
              Créer un nouveau compte avec droits administrateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createAdminUser} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" htmlFor="email">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nouvel.admin@email.com"
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

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Crown className="w-4 h-4 mr-2" />
                Créer l'administrateur
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Promouvoir un invité existant */}
      {invitesWithEmail.length > 0 && (
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-terracotta-500" />
              Promouvoir un invité
            </CardTitle>
            <CardDescription>
              Donnez les droits administrateur à un invité existant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {invitesWithEmail.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 rounded-xl border bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-200 to-gold-300 flex items-center justify-center text-gold-700 font-medium flex-shrink-0">
                      {(invite.prenom?.[0] || invite.email[0] || '?').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {[invite.prenom, invite.nom].filter(Boolean).join(' ') || 'Sans nom'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{invite.email}</p>
                    </div>
                  </div>
                  <form action={addAdmin}>
                    <input type="hidden" name="user_id" value={invite.id} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50 ml-2"
                      title="Promouvoir admin"
                    >
                      <Crown className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info sur les droits */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-purple-900">Droits des administrateurs</h3>
              <ul className="text-sm text-purple-700 mt-2 space-y-1">
                <li>✓ Voir et gérer tous les invités</li>
                <li>✓ Créer, modifier et supprimer des événements</li>
                <li>✓ Valider ou rejeter les photos/vidéos</li>
                <li>✓ Voir les détails des séjours de tous les invités</li>
                <li>✓ Publier des messages et annonces</li>
                <li>✓ Ajouter ou supprimer d'autres administrateurs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

