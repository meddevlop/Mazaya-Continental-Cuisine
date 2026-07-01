import { supabase } from "@/lib/supabase"

export interface CustomerData {
  id: string
  name: string
  phone: string
  email: string
  reservation_count: number
  last_reservation: string | null
  notes: string
  is_favorite: boolean
  created_at: string
}

function mapRow(row: any): CustomerData {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || "",
    reservation_count: row.reservation_count ?? 0,
    last_reservation: row.last_reservation || null,
    notes: row.notes || "",
    is_favorite: row.is_favorite ?? false,
    created_at: row.created_at,
  }
}

export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("last_reservation", { ascending: false, nullsFirst: false })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function upsertCustomer(customer: { name: string; phone: string; email?: string }) {
  const { data, error } = await supabase
    .from("customers")
    .upsert(customer, { onConflict: "phone" })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}
