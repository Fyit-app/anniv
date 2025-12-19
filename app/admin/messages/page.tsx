import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/server"
import {
  MessageSquare,
  Send,
  Trash2,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Megaphone,
} from "lucide-react"

import { createMessage, deleteMessage } from "./actions"

type SearchParams = {
  error?: string
  created?: string
  deleted?: string
}

type Message = {
  id: string
  title: string
  content: string
  target: 'all' | 'invite'
  created_at: string
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { error, created, deleted } = await searchParams

  const supabase = await createClient()
  
  // Récupérer les messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })

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
          <p className="text-oasis-700">Message publié avec succès !</p>
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
            <form action={createMessage} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="title">
                  Titre *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ex: Rappel important"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="content">
                  Message *
                </label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Écrivez votre message ici..."
                  required
                  rows={5}
                  className="bg-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Destinataires</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:bg-gold-50 has-[:checked]:border-gold-300">
                    <input
                      type="radio"
                      name="target"
                      value="all"
                      defaultChecked
                      className="w-4 h-4 text-gold-500"
                    />
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Tous</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:bg-oasis-50 has-[:checked]:border-oasis-300">
                    <input
                      type="radio"
                      name="target"
                      value="invite"
                      className="w-4 h-4 text-oasis-500"
                    />
                    <span className="text-sm">Invités uniquement</span>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-600 hover:to-terracotta-600">
                <Send className="w-4 h-4 mr-2" />
                Publier l'annonce
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liste des messages */}
        <Card className="bg-card-premium lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-oasis-500" />
              Messages publiés
            </CardTitle>
            <CardDescription>
              {messages?.length || 0} message(s) au total
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!messages || messages.length === 0) ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun message publié</p>
                <p className="text-sm">Créez votre première annonce</p>
              </div>
            ) : (
              messages.map((message: Message) => {
                const createdAt = new Date(message.created_at)
                const isRecent = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000

                return (
                  <div
                    key={message.id}
                    className="p-4 rounded-xl border bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{message.title}</h3>
                          {isRecent && (
                            <Badge className="bg-oasis-100 text-oasis-700 border-oasis-200 text-xs">
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
                Les messages publiés ici seront visibles par les invités sur leur tableau de bord.
                Vous pouvez cibler tous les utilisateurs ou uniquement les invités (pas les admins).
                Les messages les plus récents apparaissent en premier.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

