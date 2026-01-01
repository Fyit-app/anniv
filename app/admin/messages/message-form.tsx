"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Users,
  Mail,
  Check,
  User,
} from "lucide-react"

import { createMessage } from "./actions"

type Recipient = {
  id: string
  email: string
  prenom: string | null
  nom: string | null
  role: string
}

type Props = {
  recipients: Recipient[]
}

export function MessageForm({ recipients }: Props) {
  const [sendEmail, setSendEmail] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(
    new Set(recipients.map(r => r.id))
  )
  const [target, setTarget] = useState<'all' | 'invite'>('all')

  // Filtrer les destinataires selon le target
  const filteredRecipients = recipients.filter(r => 
    target === 'all' || r.role === 'invite'
  )

  const toggleRecipient = (id: string) => {
    const newSet = new Set(selectedRecipients)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedRecipients(newSet)
  }

  const selectAll = () => {
    setSelectedRecipients(new Set(filteredRecipients.map(r => r.id)))
  }

  const selectNone = () => {
    setSelectedRecipients(new Set())
  }

  const selectedCount = filteredRecipients.filter(r => selectedRecipients.has(r.id)).length

  return (
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
        <label className="text-sm font-medium">Visibilité sur le dashboard</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:bg-gold-50 has-[:checked]:border-gold-300">
            <input
              type="radio"
              name="target"
              value="all"
              checked={target === 'all'}
              onChange={() => setTarget('all')}
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
              checked={target === 'invite'}
              onChange={() => setTarget('invite')}
              className="w-4 h-4 text-oasis-500"
            />
            <span className="text-sm">Invités uniquement</span>
          </label>
        </div>
      </div>

      {/* Option envoi email */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="send_email"
            value="true"
            checked={sendEmail}
            onChange={(e) => setSendEmail(e.target.checked)}
            className="w-5 h-5 mt-0.5 text-blue-600 rounded border-blue-300 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Envoyer par email</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Envoie également ce message par email aux destinataires sélectionnés
            </p>
          </div>
        </label>
      </div>

      {/* Sélection des destinataires email */}
      {sendEmail && (
        <div className="p-4 rounded-xl bg-white border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm">Destinataires email</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {selectedCount}/{filteredRecipients.length}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="text-xs h-7"
              >
                Tout sélectionner
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectNone}
                className="text-xs h-7"
              >
                Aucun
              </Button>
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
            {filteredRecipients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun destinataire disponible
              </p>
            ) : (
              filteredRecipients.map((recipient) => (
                <label
                  key={recipient.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedRecipients.has(recipient.id)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="recipients"
                    value={recipient.id}
                    checked={selectedRecipients.has(recipient.id)}
                    onChange={() => toggleRecipient(recipient.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-terracotta-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {recipient.prenom?.[0] || recipient.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {recipient.prenom || recipient.email.split('@')[0]}
                        {recipient.nom && ` ${recipient.nom}`}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {recipient.email}
                      </p>
                    </div>
                    {recipient.role === 'admin' && (
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        Admin
                      </Badge>
                    )}
                  </div>
                  {selectedRecipients.has(recipient.id) && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </label>
              ))
            )}
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-600 hover:to-terracotta-600"
        disabled={sendEmail && selectedCount === 0}
      >
        <Send className="w-4 h-4 mr-2" />
        {sendEmail 
          ? `Publier et envoyer à ${selectedCount} personne${selectedCount > 1 ? 's' : ''}`
          : "Publier l'annonce"
        }
      </Button>
    </form>
  )
}


