import { createClient } from "@/lib/supabase/server"
import { getEventsWithDetails, getMyFamilyMembers, getProgrammeEvents } from "./actions"
import { EventCard } from "./event-card"
import { ProgrammeSection } from "@/components/programme-timeline"
import { 
  Calendar, 
  PartyPopper, 
  Users,
  Info,
  CheckCircle2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function EvenementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Récupérer tous les événements (custom uniquement pour la section séparée)
  const allEvents = await getEventsWithDetails('all')
  const customEvents = allEvents.filter(e => e.event_type !== 'programme')
  
  // Récupérer les événements du programme
  const programmeEvents = await getProgrammeEvents()
  
  const familyMembers = await getMyFamilyMembers()
  const maxParticipants = familyMembers.length || 1

  // Compter les inscriptions
  const registeredCount = programmeEvents.filter(e => e.is_registered).length
  const totalProgrammeEvents = programmeEvents.length

  return (
    <div className="min-h-screen pattern-zellige">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terracotta-700 via-terracotta-600 to-gold-600">
        <div className="absolute inset-0 pattern-zellige-dark opacity-30" />
        <div className="absolute inset-0 pattern-stars opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-terracotta-400/15 rounded-full blur-[80px]" />
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-gold-100 text-xs font-medium mb-3 border border-white/10">
              <PartyPopper className="h-3.5 w-3.5" />
              Inscrivez-vous aux activités
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
              Programme & Inscriptions 🎉
            </h1>
            <p className="text-gold-100/70 text-sm sm:text-base max-w-xl">
              Découvrez toutes les activités de la semaine et inscrivez-vous avec votre groupe.
            </p>
            
            {/* Stats */}
            {registeredCount > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-oasis-400" />
                <span className="text-white text-sm font-medium">
                  {registeredCount}/{totalProgrammeEvents} activité{registeredCount > 1 ? "s" : ""} réservée{registeredCount > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Family Members Info */}
          {familyMembers.length > 0 ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gold-100/50 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-terracotta-500">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Votre groupe</h3>
                  <p className="text-xs text-muted-foreground">{familyMembers.length} participant{familyMembers.length > 1 ? "s" : ""} - vous pouvez inscrire jusqu&apos;à {familyMembers.length} personne{familyMembers.length > 1 ? "s" : ""} par activité</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-gold-50 to-terracotta-50 border border-gold-200/50"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-terracotta-400 flex items-center justify-center text-xs font-bold text-white">
                      {member.first_name[0]}
                    </div>
                    <span className="text-sm font-medium">
                      {member.first_name}
                      {member.is_minor && (
                        <span className="ml-1 text-xs text-muted-foreground">(mineur)</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gold-50 border border-gold-200/50 flex items-start gap-3">
              <Info className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gold-800">Aucun participant enregistré</p>
                <p className="text-xs text-gold-700 mt-1">
                  Ajoutez les membres de votre groupe lors de l&apos;onboarding pour pouvoir les inscrire aux activités.
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-terracotta-50 border border-terracotta-200/50 flex items-start gap-3">
            <Info className="h-5 w-5 text-terracotta-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-terracotta-800">Comment ça marche ?</p>
              <p className="text-xs text-terracotta-700 mt-1">
                Cliquez sur <strong>"Je participe"</strong> pour vous inscrire à une activité. Vous pouvez choisir le nombre de personnes de votre groupe à inscrire.
              </p>
            </div>
          </div>

          {/* Programme Section avec inscriptions */}
          <div className="p-5 sm:p-8 rounded-2xl bg-white border border-gold-100/50 shadow-lg">
            <ProgrammeSection 
              programmeEvents={programmeEvents}
              maxParticipants={maxParticipants}
              showRegistration={true}
            />
          </div>

          {/* Custom Events (autres événements non liés au programme) */}
          {customEvents.length > 0 && (
            <>
              <div className="pt-6">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  Autres événements
                </h2>
              </div>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {customEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    maxParticipants={maxParticipants}
                    delay={index * 100}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
