"use server"

import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/emails/send-email"
import { AnnouncementEmail } from "@/lib/emails/templates/announcement-email"

export async function createMessage(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get("title") ?? "").trim()
  const content = String(formData.get("content") ?? "").trim()
  const target = String(formData.get("target") ?? "all").trim() as 'all' | 'invite'
  const sendEmailOption = formData.get("send_email") === "true"
  
  // Récupérer les IDs des destinataires sélectionnés
  const selectedRecipientIds = formData.getAll("recipients").map(v => String(v))

  if (!title || !content) {
    redirect("/admin/messages?error=Titre%20et%20contenu%20requis")
  }

  const supabase = await createClient()

  // Insérer le message dans la base de données
  const { error } = await supabase
    .from("messages")
    .insert({
      title,
      content,
      target,
    })

  if (error) {
    redirect(`/admin/messages?error=${encodeURIComponent(error.message)}`)
  }

  // Envoyer les emails si l'option est cochée et des destinataires sont sélectionnés
  let emailsSent = 0
  let emailErrors: string[] = []
  
  if (sendEmailOption && selectedRecipientIds.length > 0) {
    // Récupérer les profils des destinataires sélectionnés
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, prenom, nom")
      .in("id", selectedRecipientIds)

    if (profilesError) {
      emailErrors.push(`Erreur profils: ${profilesError.message}`)
    } else if (!profiles || profiles.length === 0) {
      emailErrors.push("Aucun profil trouvé")
    } else {
      // Récupérer les emails des utilisateurs via le client admin (service_role)
      try {
        const adminClient = createAdminClient()
        const { data: authData, error: authError } = await adminClient.auth.admin.listUsers()
        
        if (authError) {
          emailErrors.push(`Erreur auth admin: ${authError.message}`)
        } else if (!authData?.users || authData.users.length === 0) {
          emailErrors.push("Aucun utilisateur auth trouvé")
        } else {
          const userEmailMap = new Map(
            authData.users.map(u => [u.id, u.email])
          )

          const dashboardUrl = process.env.NEXT_PUBLIC_SITE_URL 
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
            : "https://votre-site.com/dashboard"

          // Envoyer un email à chaque destinataire sélectionné
          for (const profile of profiles) {
            const email = userEmailMap.get(profile.id)
            if (email) {
              const guestName = profile.prenom || email.split('@')[0]
              
              const result = await sendEmail({
                to: email,
                subject: `📢 ${title} - Anniversaire Yvonne`,
                react: AnnouncementEmail({
                  guestName,
                  title,
                  content,
                  dashboardUrl,
                }),
              })
              
              if (result.success) {
                emailsSent++
              } else {
                emailErrors.push(`${email}: ${result.error}`)
              }
            }
          }
        }
      } catch (e) {
        emailErrors.push(`Exception: ${e instanceof Error ? e.message : 'Erreur inconnue'}`)
      }
    }
  }

  // Redirection avec info sur les emails envoyés
  const params = new URLSearchParams({ created: "1" })
  if (emailsSent > 0) {
    params.set("emails", String(emailsSent))
  }
  if (emailErrors.length > 0) {
    params.set("emailError", emailErrors.join(" | "))
  }
  redirect(`/admin/messages?${params.toString()}`)
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin()

  const messageId = String(formData.get("message_id") ?? "").trim()

  if (!messageId) {
    redirect("/admin/messages?error=ID%20message%20manquant")
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)

  if (error) {
    redirect(`/admin/messages?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/admin/messages?deleted=1")
}




