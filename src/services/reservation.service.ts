import { getServerClient } from "@/lib/supabase"

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface ReservationData {
  id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  date: string
  time: string
  guests: number
  special_requests: string
  status: ReservationStatus
  source: string
  created_at: string
}

function mapRow(row: any): ReservationData {
  return {
    id: row.id,
    guest_name: row.guest_name,
    guest_email: row.guest_email || "",
    guest_phone: row.guest_phone,
    date: row.date,
    time: row.time,
    guests: row.guests ?? 2,
    special_requests: row.special_requests || "",
    status: row.status || "pending",
    source: row.source || "website",
    created_at: row.created_at,
  }
}

export async function createReservation(data: {
  guest_name: string
  guest_email?: string
  guest_phone: string
  date: string
  time: string
  guests: number
  special_requests?: string
  source?: string
}) {
  const db = getServerClient()
  const { data: result, error } = await db
    .from("reservations")
    .insert([{ ...data, status: "pending", source: data.source || "website" }])
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(result), error: null }
}

export async function getReservations() {
  const db = getServerClient()
  const { data, error } = await db
    .from("reservations")
    .select("*")
    .order("date", { ascending: false })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function getReservationsByDate(date: string) {
  const db = getServerClient()
  const { data, error } = await db
    .from("reservations")
    .select("*")
    .eq("date", date)
    .order("time", { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function getReservationsByStatus(status: ReservationStatus) {
  const db = getServerClient()
  const { data, error } = await db
    .from("reservations")
    .select("*")
    .eq("status", status)
    .order("date", { ascending: false })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  const db = getServerClient()
  const { data, error } = await db
    .from("reservations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function deleteReservation(id: string) {
  const db = getServerClient()
  const { error } = await db.from("reservations").delete().eq("id", id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function getTodaysReservations() {
  const db = getServerClient()
  const today = new Date().toISOString().split("T")[0]
  const { data, error } = await db
    .from("reservations")
    .select("*")
    .eq("date", today)
    .order("time", { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function getPendingReservations() {
  const db = getServerClient()
  const { data, error } = await db
    .from("reservations")
    .select("*")
    .eq("status", "pending")
    .order("date", { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}
