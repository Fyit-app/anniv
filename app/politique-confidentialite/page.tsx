import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Trash2, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Politique de confidentialité – Yvonne 60 ans",
  description: "Politique de confidentialité du site d'anniversaire d'Yvonne à Marrakech",
}

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-xl border-b border-gold-200/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 pattern-zellige opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-terracotta-500 shadow-xl shadow-gold-500/25 mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Nous attachons une grande importance à la protection de vos données personnelles. 
            Cette page vous informe sur la manière dont nous collectons et utilisons vos informations.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Dernière mise à jour : Décembre 2025
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="space-y-12">
            
            {/* Section 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    1. Collecte des données
                  </h2>
                </div>
              </div>
              <div className="pl-14 space-y-4 text-muted-foreground">
                <p>
                  Dans le cadre de l'organisation de l'anniversaire d'Yvonne à Marrakech, nous collectons les informations suivantes :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Adresse email</strong> : pour l'authentification et les communications</li>
                  <li><strong>Prénom et nom</strong> : pour personnaliser votre expérience</li>
                  <li><strong>Informations de séjour</strong> : dates d'arrivée/départ, moyen de transport, lieu d'hébergement</li>
                  <li><strong>Participants</strong> : prénoms des personnes vous accompagnant</li>
                  <li><strong>Inscriptions aux activités</strong> : pour organiser le programme</li>
                  <li><strong>Photos partagées</strong> : dans l'espace galerie de l'événement</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-oasis-100 text-oasis-700">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    2. Utilisation des données
                  </h2>
                </div>
              </div>
              <div className="pl-14 space-y-4 text-muted-foreground">
                <p>
                  Vos données sont utilisées exclusivement pour :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Vous permettre d'accéder à votre espace invité</li>
                  <li>Organiser les activités et le programme de l'événement</li>
                  <li>Faciliter la coordination entre les participants</li>
                  <li>Vous envoyer des informations importantes concernant l'événement</li>
                  <li>Partager des souvenirs via la galerie photos</li>
                </ul>
                <p className="mt-4 p-4 bg-gold-50 rounded-xl border border-gold-200 text-foreground">
                  <strong>Important :</strong> Vos données ne sont jamais vendues, partagées avec des tiers à des fins commerciales, 
                  ni utilisées pour de la publicité.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta-100 text-terracotta-700">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    3. Protection des données
                  </h2>
                </div>
              </div>
              <div className="pl-14 space-y-4 text-muted-foreground">
                <p>
                  Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Connexion sécurisée via HTTPS</li>
                  <li>Authentification par code OTP (sans mot de passe à mémoriser)</li>
                  <li>Hébergement sur des serveurs sécurisés (Supabase)</li>
                  <li>Accès restreint aux données (seuls les invités authentifiés peuvent voir les informations)</li>
                  <li>Politiques de sécurité au niveau des lignes (RLS) pour isoler les données</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    4. Conservation et suppression
                  </h2>
                </div>
              </div>
              <div className="pl-14 space-y-4 text-muted-foreground">
                <p>
                  Vos données sont conservées uniquement pour la durée nécessaire à l'organisation de l'événement :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Les données seront conservées jusqu'à 6 mois après l'événement (janvier 2026)</li>
                  <li>Les photos de la galerie pourront être conservées plus longtemps avec votre accord</li>
                  <li>Vous pouvez demander la suppression de vos données à tout moment</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-oasis-100 text-oasis-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    5. Vos droits
                  </h2>
                </div>
              </div>
              <div className="pl-14 space-y-4 text-muted-foreground">
                <p>
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Droit d'accès</strong> : consulter vos données personnelles</li>
                  <li><strong>Droit de rectification</strong> : corriger vos informations</li>
                  <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
                  <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                  <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
                </ul>
              </div>
            </div>

            {/* Section 6 - Cookies */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta-100 text-terracotta-700">
                  <span className="text-xl">🍪</span>
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    6. Cookies
                  </h2>
                </div>
              </div>
              <div className="pl-14 space-y-4 text-muted-foreground">
                <p>
                  Ce site utilise des cookies strictement nécessaires au fonctionnement :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Cookies d'authentification</strong> : pour maintenir votre session connectée</li>
                  <li><strong>Cookies de préférences</strong> : pour mémoriser vos choix (consentement cookies)</li>
                </ul>
                <p>
                  Aucun cookie de tracking publicitaire ou de réseaux sociaux n'est utilisé.
                </p>
              </div>
            </div>

            {/* Section 7 - Contact */}
            <div className="bg-gradient-to-br from-gold-50 to-terracotta-50 rounded-2xl p-6 sm:p-8 border border-gold-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-terracotta-500 text-white shadow-lg">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    7. Contact
                  </h2>
                </div>
              </div>
              <div className="pl-14 space-y-4 text-muted-foreground">
                <p>
                  Pour toute question concernant vos données personnelles ou pour exercer vos droits, 
                  vous pouvez contacter l'organisateur de l'événement.
                </p>
                <p className="text-foreground font-medium">
                  Ce site est un site privé destiné uniquement aux invités de l'anniversaire d'Yvonne.
                </p>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-600 hover:to-terracotta-600 text-white shadow-xl shadow-gold-500/25"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-8 border-t border-gold-200/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 - Site privé pour l'anniversaire d'Yvonne
          </p>
        </div>
      </footer>
    </div>
  )
}

