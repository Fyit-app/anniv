"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Plus,
  Trash2,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Baby,
  Edit2,
  X,
  Check,
  Sparkles,
} from "lucide-react"
import { addFamilyMember, updateFamilyMember, removeFamilyMember, sendInvitation, updateGroupName } from "./actions"
import type { FamilyMember } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GroupManagerProps {
  groupName: string | null
  familyMembers: FamilyMember[]
}

interface LocalMember extends FamilyMember {
  isEditing?: boolean
  editFirstName?: string
  editEmail?: string
  editIsMinor?: boolean
}

export function GroupManager({ groupName: initialGroupName, familyMembers: initialMembers }: GroupManagerProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  // État du nom de groupe
  const [isEditingGroupName, setIsEditingGroupName] = useState(false)
  const [groupName, setGroupName] = useState(initialGroupName || "")
  const [tempGroupName, setTempGroupName] = useState(initialGroupName || "")
  
  // État des membres
  const [members, setMembers] = useState<LocalMember[]>(initialMembers)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({ first_name: "", is_minor: false, email: "" })

  const clearMessage = () => setTimeout(() => setMessage(null), 5000)

  // ═══════════════════════════════════════════════════════════════════════════
  // Gestion du nom de groupe
  // ═══════════════════════════════════════════════════════════════════════════

  const handleSaveGroupName = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("group_name", tempGroupName)
      const result = await updateGroupName(formData)
      
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setGroupName(tempGroupName)
        setMessage({ type: "success", text: "Nom du groupe mis à jour" })
      }
      setIsEditingGroupName(false)
      clearMessage()
    })
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Gestion des membres
  // ═══════════════════════════════════════════════════════════════════════════

  const handleAddMember = () => {
    if (!newMember.first_name.trim()) {
      setMessage({ type: "error", text: "Le prénom est obligatoire" })
      clearMessage()
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("first_name", newMember.first_name)
      formData.append("is_minor", String(newMember.is_minor))
      if (!newMember.is_minor && newMember.email) {
        formData.append("email", newMember.email)
      }

      const result = await addFamilyMember(formData)
      
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMessage({ type: "success", text: "Participant ajouté" })
        setNewMember({ first_name: "", is_minor: false, email: "" })
        setShowAddForm(false)
        // Rafraîchir la liste - la page sera revalidée
        window.location.reload()
      }
      clearMessage()
    })
  }

  const handleUpdateMember = (member: LocalMember) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("member_id", member.id)
      formData.append("first_name", member.editFirstName || member.first_name)
      formData.append("is_minor", String(member.editIsMinor ?? member.is_minor))
      if (!(member.editIsMinor ?? member.is_minor) && member.editEmail) {
        formData.append("email", member.editEmail)
      }

      const result = await updateFamilyMember(formData)
      
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMembers(members.map(m => 
          m.id === member.id 
            ? { 
                ...m, 
                first_name: member.editFirstName || m.first_name,
                email: (member.editIsMinor ?? m.is_minor) ? null : (member.editEmail ?? m.email),
                is_minor: member.editIsMinor ?? m.is_minor,
                isEditing: false 
              }
            : m
        ))
        setMessage({ type: "success", text: "Participant mis à jour" })
      }
      clearMessage()
    })
  }

  const handleRemoveMember = (memberId: string) => {
    if (members.length <= 1) {
      setMessage({ type: "error", text: "Vous devez avoir au moins un participant" })
      clearMessage()
      return
    }

    startTransition(async () => {
      const result = await removeFamilyMember(memberId)
      
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMembers(members.filter(m => m.id !== memberId))
        setMessage({ type: "success", text: "Participant supprimé" })
      }
      clearMessage()
    })
  }

  const handleSendInvitation = (memberId: string) => {
    const member = members.find(m => m.id === memberId)
    if (!member?.email) {
      setMessage({ type: "error", text: "Veuillez d'abord renseigner l'email" })
      clearMessage()
      return
    }

    startTransition(async () => {
      const result = await sendInvitation(memberId)
      
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMembers(members.map(m => 
          m.id === memberId 
            ? { ...m, invitation_sent_at: new Date().toISOString() }
            : m
        ))
        setMessage({ type: "success", text: result.message || "Invitation envoyée" })
      }
      clearMessage()
    })
  }

  const startEditing = (member: LocalMember) => {
    setMembers(members.map(m => 
      m.id === member.id 
        ? { 
            ...m, 
            isEditing: true, 
            editFirstName: m.first_name,
            editEmail: m.email || "",
            editIsMinor: m.is_minor
          }
        : { ...m, isEditing: false }
    ))
  }

  const cancelEditing = (memberId: string) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, isEditing: false } : m
    ))
  }

  return (
    <div className="space-y-6">
      {/* Message de feedback */}
      {message && (
        <div className={cn(
          "p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2",
          message.type === "success" 
            ? "bg-oasis-50 border border-oasis-200" 
            : "bg-red-50 border border-red-200"
        )}>
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-oasis-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <p className={cn(
            "text-sm",
            message.type === "success" ? "text-oasis-800" : "text-red-800"
          )}>
            {message.text}
          </p>
        </div>
      )}

      {/* Carte du groupe */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gold-100/50 shadow-lg">
        {/* Header avec nom du groupe */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-terracotta-500 shadow-lg shadow-gold-500/25">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              {isEditingGroupName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={tempGroupName}
                    onChange={(e) => setTempGroupName(e.target.value)}
                    placeholder="Ex: Famille Dupont"
                    className="h-9 w-48"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSaveGroupName}
                    disabled={isPending}
                    className="h-8 w-8"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-oasis-600" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setIsEditingGroupName(false)
                      setTempGroupName(groupName)
                    }}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-foreground">
                    {groupName || "Votre groupe"}
                  </h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setIsEditingGroupName(true)
                      setTempGroupName(groupName)
                    }}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {members.length} participant{members.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 py-1.5 px-3">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" />
            <span>{members.filter(m => !m.is_minor).length} majeur{members.filter(m => !m.is_minor).length > 1 ? "s" : ""}</span>
            <span className="text-muted-foreground">•</span>
            <span>{members.filter(m => m.is_minor).length} mineur{members.filter(m => m.is_minor).length > 1 ? "s" : ""}</span>
          </Badge>
        </div>

        {/* Liste des membres */}
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className={cn(
                "p-4 rounded-xl border transition-all",
                member.isEditing 
                  ? "bg-oasis-50/50 border-oasis-200" 
                  : "bg-gradient-to-r from-gold-50/50 to-terracotta-50/50 border-gold-200/50"
              )}
            >
              {member.isEditing ? (
                // Mode édition
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      member.editIsMinor 
                        ? "bg-secondary/20" 
                        : "bg-primary/20"
                    )}>
                      {member.editIsMinor ? (
                        <Baby className="h-5 w-5 text-secondary" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <Input
                      value={member.editFirstName}
                      onChange={(e) => setMembers(members.map(m => 
                        m.id === member.id ? { ...m, editFirstName: e.target.value } : m
                      ))}
                      placeholder="Prénom"
                      className="flex-1"
                    />
                  </div>

                  <div className="flex gap-2 pl-13">
                    <button
                      type="button"
                      onClick={() => setMembers(members.map(m => 
                        m.id === member.id ? { ...m, editIsMinor: false } : m
                      ))}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                        !member.editIsMinor
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border hover:bg-muted"
                      )}
                    >
                      Majeur
                    </button>
                    <button
                      type="button"
                      onClick={() => setMembers(members.map(m => 
                        m.id === member.id ? { ...m, editIsMinor: true, editEmail: "" } : m
                      ))}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                        member.editIsMinor
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-background border hover:bg-muted"
                      )}
                    >
                      Mineur
                    </button>
                  </div>

                  {!member.editIsMinor && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        Email (pour invitation)
                      </label>
                      <Input
                        type="email"
                        value={member.editEmail || ""}
                        onChange={(e) => setMembers(members.map(m => 
                          m.id === member.id ? { ...m, editEmail: e.target.value } : m
                        ))}
                        placeholder="email@exemple.com"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelEditing(member.id)}
                    >
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateMember(member)}
                      disabled={isPending}
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              ) : (
                // Mode affichage
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                      member.is_minor 
                        ? "bg-gradient-to-br from-secondary/80 to-secondary text-secondary-foreground" 
                        : "bg-gradient-to-br from-gold-400 to-terracotta-400 text-white"
                    )}>
                      {member.first_name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member.first_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {member.is_minor ? (
                          <span className="flex items-center gap-1">
                            <Baby className="h-3 w-3" />
                            Mineur
                          </span>
                        ) : (
                          <>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Majeur
                            </span>
                            {member.email && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {member.email}
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Bouton invitation pour les majeurs avec email */}
                    {!member.is_minor && member.email && !member.linked_user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendInvitation(member.id)}
                        disabled={isPending}
                        className={cn(
                          "text-xs gap-1.5",
                          member.invitation_sent_at 
                            ? "text-oasis-600 hover:text-oasis-700" 
                            : "text-gold-600 hover:text-gold-700"
                        )}
                      >
                        {isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : member.invitation_sent_at ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Renvoyer</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Inviter</span>
                          </>
                        )}
                      </Button>
                    )}

                    {member.linked_user_id && (
                      <Badge variant="outline" className="text-xs bg-oasis-50 text-oasis-700 border-oasis-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Inscrit
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(member)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={isPending || members.length <= 1}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm ? (
          <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-dashed space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                newMember.is_minor ? "bg-secondary/20" : "bg-primary/20"
              )}>
                {newMember.is_minor ? (
                  <Baby className="h-5 w-5 text-secondary" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              <Input
                value={newMember.first_name}
                onChange={(e) => setNewMember({ ...newMember, first_name: e.target.value })}
                placeholder="Prénom du participant"
                className="flex-1"
                autoFocus
              />
            </div>

            <div className="flex gap-2 pl-13">
              <button
                type="button"
                onClick={() => setNewMember({ ...newMember, is_minor: false })}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  !newMember.is_minor
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border hover:bg-muted"
                )}
              >
                Majeur
              </button>
              <button
                type="button"
                onClick={() => setNewMember({ ...newMember, is_minor: true, email: "" })}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  newMember.is_minor
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-background border hover:bg-muted"
                )}
              >
                Mineur
              </button>
            </div>

            {!newMember.is_minor && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  Email (optionnel, pour lui envoyer une invitation)
                </label>
                <Input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="email@exemple.com"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false)
                  setNewMember({ first_name: "", is_minor: false, email: "" })
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={isPending || !newMember.first_name.trim()}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full mt-4 border-dashed border-gold-300 text-gold-700 hover:bg-gold-50 hover:border-gold-400"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un participant
          </Button>
        )}
      </div>

      {/* Info box invitation */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-oasis-50 to-oasis-100/50 border border-oasis-200/50 flex items-start gap-3">
        <Mail className="h-5 w-5 text-oasis-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-oasis-800">Inviter les membres majeurs</p>
          <p className="text-xs text-oasis-700 mt-1">
            Les participants majeurs peuvent recevoir un lien d&apos;invitation par email pour créer leur propre compte 
            et accéder à l&apos;application avec leurs propres identifiants.
          </p>
        </div>
      </div>
    </div>
  )
}




