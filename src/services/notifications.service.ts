import { supabase } from "@/lib/supabase"

export interface NotificationData {
  id: string
  type: "reservation" | "message" | "system" | "review"
  title: string
  description: string
  time: string
  read: boolean
  actionable: boolean
  actionLabel?: string
  actionHref?: string
}

function mapRow(row: any): NotificationData {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description || "",
    time: row.created_at,
    read: row.is_read ?? false,
    actionable: row.actionable ?? false,
    actionLabel: row.action_label || undefined,
    actionHref: row.action_href || undefined,
  }
}

export async function getNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function getUnreadNotificationCount() {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
  if (error) return { data: null, error: error.message }
  return { data: count ?? 0, error: null }
}

export async function markNotificationAsRead(id: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function markAllAsRead() {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false)
  if (error) return { data: null, error: error.message }
  return { data: true, error: null }
}
