"use server"

import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function createMessage(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get("title") ?? "").trim()
  const content = String(formData.get("content") ?? "").trim()
  const target = String(formData.get("target") ?? "all").trim() as 'all' | 'invite'

  if (!title || !content) {
    redirect("/admin/messages?error=Titre%20et%20contenu%20requis")
  }

  const supabase = await createClient()

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

  redirect("/admin/messages?created=1")
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

