import { getServerClient } from "@/lib/supabase"

export interface MessageData {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  is_read: boolean
  is_archived: boolean
  source: string
  created_at: string
}

function mapRow(row: any): MessageData {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    subject: row.subject || "",
    message: row.message,
    is_read: row.is_read ?? false,
    is_archived: row.is_archived ?? false,
    source: row.source || "website",
    created_at: row.created_at,
  }
}

export async function createMessage(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}) {
  const db = getServerClient()
  const { data: result, error } = await db
    .from("messages")
    .insert([{ ...data, is_read: false, is_archived: false, source: "website" }])
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(result), error: null }
}

export async function getMessages() {
  const db = getServerClient()
  const { data, error } = await db
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function getUnreadMessages() {
  const db = getServerClient()
  const { data, error } = await db
    .from("messages")
    .select("*")
    .eq("is_read", false)
    .order("created_at", { ascending: false })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function markMessageAsRead(id: string) {
  const db = getServerClient()
  const { data, error } = await db
    .from("messages")
    .update({ is_read: true })
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function markMessageAsUnread(id: string) {
  const db = getServerClient()
  const { data, error } = await db
    .from("messages")
    .update({ is_read: false })
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function toggleMessageArchived(id: string) {
  const db = getServerClient()
  const { data: current } = await db.from("messages").select("is_archived").eq("id", id).single()
  const newArchived = current ? !current.is_archived : true
  const { data, error } = await db
    .from("messages")
    .update({ is_archived: newArchived })
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function deleteMessage(id: string) {
  const db = getServerClient()
  const { error } = await db.from("messages").delete().eq("id", id)
  if (error) return { error: error.message }
  return { error: null }
}
