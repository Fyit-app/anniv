import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  MessageSquare,
  Trash2,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Megaphone,
  Mail,
  Send,
  EyeOff,
  Eye,
} from "lucide-react"

import { deleteMessage, toggleMessagePublished } from "./actions"
import { MessageForm } from "./message-form"

type SearchParams = {
  error?: string
  created?: string
  deleted?: string
  published?: string
  depublished?: string
  emails?: string
  emailError?: string
}

type Message = {
  id: string
  title: string
  content: string
  target: 'all' | 'invite'
  published: boolean
  created_at: string
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { error, created, deleted, published, depublished, emails, emailError } = await searchParams

  const supabase = await createClient()
  
  // Récupérer les messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })

  // Récupérer les profils pour la liste des destinataires
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, prenom, nom, role")
    .order("prenom")

  // Récupérer les emails via le client admin
  let recipients: { id: string; email: string; prenom: string | null; nom: string | null; role: string }[] = []
  
  try {
    const adminClient = createAdminClient()
    const { data: authData } = await adminClient.auth.admin.listUsers()
    
    if (authData?.users && profiles) {
      const emailMap = new Map(authData.users.map(u => [u.id, u.email]))
      
      recipients = profiles
        .filter(p => emailMap.has(p.id))
        .map(p => ({
          id: p.id,
          email: emailMap.get(p.id) || '',
          prenom: p.prenom,
          nom: p.nom,
          role: p.role,
        }))
    }
  } catch (e) {
    console.error("Erreur récupération destinataires:", e)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-terracotta-600 bg-clip-text text-transparent">
          Messages & Annonces
        </h1>
        <p className="text-muted-foreground mt-1">
          Communiquez avec vos invités
        </p>
      </div>

      {/* Messages de feedback */}
      {created && (
        <div className="p-4 bg-oasis-50 border border-oasis-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-oasis-600" />
          <p className="text-oasis-700">
            Annonce créée en brouillon.
            {emails && Number(emails) > 0 && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {emails} email{Number(emails) > 1 ? 's' : ''} envoyé{Number(emails) > 1 ? 's' : ''}
              </span>
            )}
            <span className="ml-2 text-oasis-600">Cliquez sur &quot;Publier&quot; pour la rendre visible.</span>
          </p>
        </div>
      )}
      {published && (
        <div className="p-4 bg-oasis-50 border border-oasis-200 rounded-xl flex items-center gap-3">
          <Eye className="w-5 h-5 text-oasis-600" />
          <p className="text-oasis-700">Annonce publiée ! Elle est maintenant visible par les invités.</p>
        </div>
      )}
      {depublished && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <EyeOff className="w-5 h-5 text-amber-600" />
          <p className="text-amber-700">Annonce dépubliée. Elle n&apos;est plus visible par les invités.</p>
        </div>
      )}
      {deleted && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-amber-600" />
          <p className="text-amber-700">Message supprimé.</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{decodeURIComponent(error)}</p>
        </div>
      )}
      {emailError && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="font-medium text-amber-800">Erreur(s) envoi email :</p>
          </div>
          <p className="text-sm text-amber-700 font-mono bg-amber-100 p-2 rounded">
            {decodeURIComponent(emailError)}
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Formulaire de création */}
        <Card className="bg-card-premium lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-gold-500" />
              Nouvelle annonce
            </CardTitle>
            <CardDescription>
              Publiez un message visible par les invités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MessageForm recipients={recipients} />
          </CardContent>
        </Card>

        {/* Liste des messages */}
        <Card className="bg-card-premium lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-oasis-500" />
              Toutes les annonces
            </CardTitle>
            <CardDescription>
              {messages?.length || 0} annonce(s) au total
              {messages && messages.length > 0 && (
                <span className="ml-2">
                  ({messages.filter((m: Message) => m.published).length} publiée(s), {messages.filter((m: Message) => !m.published).length} brouillon(s))
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!messages || messages.length === 0) ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune annonce</p>
                <p className="text-sm">Créez votre première annonce</p>
              </div>
            ) : (
              messages.map((message: Message) => {
                const createdAt = new Date(message.created_at)
                const isRecent = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000

                return (
                  <div
                    key={message.id}
                    className={`p-4 rounded-xl border transition-shadow ${
                      message.published 
                        ? 'bg-white hover:shadow-md' 
                        : 'bg-gray-50/50 border-dashed border-gray-300 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold truncate">{message.title}</h3>
                          {message.published ? (
                            <Badge className="bg-oasis-100 text-oasis-700 border-oasis-200 text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Publié
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 border-gray-300 text-xs">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Brouillon
                            </Badge>
                          )}
                          {isRecent && message.published && (
                            <Badge className="bg-gold-100 text-gold-700 border-gold-200 text-xs">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {createdAt.toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {message.target === 'all' ? (
                              <>
                                <Users className="w-3 h-3 mr-1" />
                                Tous
                              </>
                            ) : (
                              'Invités'
                            )}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <form action={toggleMessagePublished}>
                          <input type="hidden" name="message_id" value={message.id} />
                          <input type="hidden" name="current_published" value={String(message.published)} />
                          <Button
                            type="submit"
                            size="sm"
                            variant="outline"
                            className={message.published 
                              ? "text-amber-600 border-amber-300 hover:bg-amber-50" 
                              : "text-oasis-600 border-oasis-300 hover:bg-oasis-50"
                            }
                          >
                            {message.published ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-1" />
                                Dépublier
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-1" />
                                Publier
                              </>
                            )}
                          </Button>
                        </form>
                        <form action={deleteMessage}>
                          <input type="hidden" name="message_id" value={message.id} />
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
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Comment ça marche ?</h3>
              <p className="text-sm text-blue-700 mt-1">
                <strong>1. Créez</strong> une annonce - elle sera enregistrée en <strong>brouillon</strong>.
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <strong>2. Publiez</strong> l&apos;annonce quand vous êtes prêt - elle deviendra visible sur le tableau de bord des invités.
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <strong>3. Dépubliez</strong> à tout moment pour la masquer temporairement.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                <strong>Envoi par email :</strong> Cochez l&apos;option pour envoyer également le message 
                par email aux destinataires sélectionnés (indépendamment de la publication).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




