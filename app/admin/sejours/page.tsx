import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import {
  Plane,
  Car,
  Train,
  MapPin,
  Calendar,
  Users,
  Home,
  ArrowRight,
  Clock,
  UserCheck,
} from "lucide-react"

type ProfileWithDetails = {
  id: string
  prenom: string | null
  nom: string | null
  onboarding_completed: boolean
  arrival_date: string | null
  departure_date: string | null
  arrival_transport: string | null
  arrival_airport: string | null
  residence_location: string | null
  group_name: string | null
}

type FamilyMember = {
  id: string
  profile_id: string
  first_name: string
  is_minor: boolean
}

export default async function AdminSejoursPage() {
  const supabase = await createClient()

  // Récupérer les profils avec détails de séjour
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, prenom, nom, onboarding_completed, arrival_date, departure_date, arrival_transport, arrival_airport, residence_location, group_name")
    .eq("role", "invite")
    .order("arrival_date", { ascending: true })

  // Récupérer les membres de famille
  const { data: familyMembers } = await supabase
    .from("family_members")
    .select("id, profile_id, first_name, is_minor")

  // Grouper les membres par profil
  const familyByProfile = (familyMembers || []).reduce((acc, fm) => {
    if (!acc[fm.profile_id]) {
      acc[fm.profile_id] = []
    }
    acc[fm.profile_id].push(fm)
    return acc
  }, {} as Record<string, FamilyMember[]>)

  const confirmedProfiles = (profiles || []).filter(p => p.onboarding_completed)
  const pendingProfiles = (profiles || []).filter(p => !p.onboarding_completed)

  // Statistiques par transport
  const transportStats = confirmedProfiles.reduce((acc, p) => {
    const transport = p.arrival_transport || 'non_specifie'
    acc[transport] = (acc[transport] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Statistiques par logement
  const locationStats = confirmedProfiles.reduce((acc, p) => {
    const location = p.residence_location || 'non_specifie'
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Groupes
  const groups = confirmedProfiles.reduce((acc, p) => {
    if (p.group_name) {
      if (!acc[p.group_name]) {
        acc[p.group_name] = []
      }
      acc[p.group_name].push(p)
    }
    return acc
  }, {} as Record<string, ProfileWithDetails[]>)

  // Total des participants
  const totalParticipants = confirmedProfiles.reduce((total, p) => {
    return total + 1 + (familyByProfile[p.id]?.length || 0)
  }, 0)

  const getTransportIcon = (transport: string | null) => {
    switch (transport) {
      case 'avion': return <Plane className="w-4 h-4" />
      case 'train': return <Train className="w-4 h-4" />
      case 'voiture': return <Car className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const getTransportLabel = (transport: string | null) => {
    switch (transport) {
      case 'avion': return 'Avion'
      case 'train': return 'Train'
      case 'voiture': return 'Voiture'
      case 'autre': return 'Autre'
      default: return 'Non spécifié'
    }
  }

  const getLocationLabel = (location: string | null) => {
    switch (location) {
      case 'riad': return 'Riad familial'
      case 'hotel': return 'Hôtel'
      case 'airbnb': return 'Airbnb'
      case 'autre': return 'Autre'
      default: return 'Non spécifié'
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-terracotta-600 bg-clip-text text-transparent">
          Vue des séjours
        </h1>
        <p className="text-muted-foreground mt-1">
          Aperçu global des dates d'arrivée et logements
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-oasis-50 to-oasis-100/50 border-oasis-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-oasis-700">Confirmés</p>
                <p className="text-3xl font-bold text-oasis-800">{confirmedProfiles.length}</p>
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
                <p className="text-3xl font-bold text-amber-800">{pendingProfiles.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gold-50 to-gold-100/50 border-gold-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gold-700">Total participants</p>
                <p className="text-3xl font-bold text-gold-800">{totalParticipants}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-gold-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Groupes</p>
                <p className="text-3xl font-bold text-purple-800">{Object.keys(groups).length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transport et logement */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-gold-500" />
              Moyens de transport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(transportStats).map(([transport, count]) => (
              <div key={transport} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    {getTransportIcon(transport)}
                  </div>
                  <span className="font-medium">{getTransportLabel(transport)}</span>
                </div>
                <Badge variant="secondary" className="text-lg px-4">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-terracotta-500" />
              Hébergements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(locationStats).map(([location, count]) => (
              <div key={location} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{getLocationLabel(location)}</span>
                </div>
                <Badge variant="secondary" className="text-lg px-4">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Liste des séjours confirmés */}
      <Card className="bg-card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-oasis-500" />
            Séjours confirmés
          </CardTitle>
          <CardDescription>
            {confirmedProfiles.length} invité(s) ont confirmé leur séjour
          </CardDescription>
        </CardHeader>
        <CardContent>
          {confirmedProfiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun séjour confirmé pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {confirmedProfiles.map((profile) => {
                const family = familyByProfile[profile.id] || []
                const adults = family.filter(f => !f.is_minor).length
                const minors = family.filter(f => f.is_minor).length

                return (
                  <div
                    key={profile.id}
                    className="p-4 rounded-xl border bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Infos principales */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-oasis-400 to-oasis-600 flex items-center justify-center text-white font-bold">
                          {(profile.prenom?.[0] || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {[profile.prenom, profile.nom].filter(Boolean).join(' ') || 'Sans nom'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {family.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                +{family.length} ({adults} adulte{adults > 1 ? 's' : ''}, {minors} enfant{minors > 1 ? 's' : ''})
                              </Badge>
                            )}
                            {profile.group_name && (
                              <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                                {profile.group_name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-50 border border-gold-200">
                          <Calendar className="w-4 h-4 text-gold-600" />
                          <span className="font-medium">
                            {profile.arrival_date
                              ? new Date(profile.arrival_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                              : '?'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-terracotta-50 border border-terracotta-200">
                          <Calendar className="w-4 h-4 text-terracotta-600" />
                          <span className="font-medium">
                            {profile.departure_date
                              ? new Date(profile.departure_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                              : '?'}
                          </span>
                        </div>
                      </div>

                      {/* Transport et logement */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTransportIcon(profile.arrival_transport)}
                          {getTransportLabel(profile.arrival_transport)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          {getLocationLabel(profile.residence_location)}
                        </Badge>
                      </div>
                    </div>

                    {/* Détails des accompagnants */}
                    {family.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-dashed">
                        <p className="text-xs text-muted-foreground mb-2">Accompagnants :</p>
                        <div className="flex flex-wrap gap-2">
                          {family.map((member) => (
                            <span
                              key={member.id}
                              className={`px-2 py-1 rounded-md text-xs ${
                                member.is_minor
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {member.first_name}
                              {member.is_minor && ' (enfant)'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Groupes */}
      {Object.keys(groups).length > 0 && (
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Groupes formés
            </CardTitle>
            <CardDescription>
              Invités qui se sont groupés ensemble
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groups).map(([groupName, members]) => (
                <div
                  key={groupName}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200"
                >
                  <h3 className="font-semibold text-purple-900 mb-3">{groupName}</h3>
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 text-xs font-medium">
                          {(member.prenom?.[0] || '?').toUpperCase()}
                        </div>
                        <span className="text-sm">
                          {[member.prenom, member.nom].filter(Boolean).join(' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* En attente */}
      {pendingProfiles.length > 0 && (
        <Card className="bg-card-premium border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Clock className="w-5 h-5" />
              En attente de confirmation
            </CardTitle>
            <CardDescription>
              {pendingProfiles.length} invité(s) n'ont pas encore complété leur onboarding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {pendingProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-700 font-medium text-sm">
                    {(profile.prenom?.[0] || '?').toUpperCase()}
                  </div>
                  <span className="font-medium text-amber-900">
                    {[profile.prenom, profile.nom].filter(Boolean).join(' ') || 'Sans nom'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
