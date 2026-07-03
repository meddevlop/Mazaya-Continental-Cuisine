import { createServerClient } from "@/lib/supabase"

export interface CategoryData {
  id: string
  name: string
  name_ar: string
  slug: string
  color: string
  icon: string
  order_index: number
  is_active: boolean
  item_count?: number
}

function mapRow(row: any): CategoryData {
  return {
    id: row.id,
    name: row.name,
    name_ar: row.name_ar || "",
    slug: row.slug,
    color: row.color || "#C8A45C",
    icon: row.icon || "FolderTree",
    order_index: row.order_index ?? 0,
    is_active: row.is_active ?? true,
  }
}

const db = () => createServerClient()

export async function getCategories() {
  const { data, error } = await db()
    .from("categories")
    .select("*, menu_items:menu_items(count)")
    .order("order_index", { ascending: true })
  if (error) return { data: null, error: error.message }
  const mapped = (data || []).map((row: any) => ({
    ...mapRow(row),
    item_count: row.menu_items?.[0]?.count ?? 0,
  }))
  return { data: mapped, error: null }
}

export async function getActiveCategories() {
  const { data, error } = await db()
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function createCategory(category: Record<string, any>) {
  const { data, error } = await db()
    .from("categories")
    .insert([category])
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function updateCategory(id: string, updates: Record<string, any>) {
  const { data, error } = await db()
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function deleteCategory(id: string) {
  const { error } = await db().from("categories").delete().eq("id", id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function reorderCategories(ids: string[]) {
  const updates = ids.map((id, idx) =>
    db().from("categories").update({ order_index: idx }).eq("id", id)
  )
  const results = await Promise.all(updates)
  const error = results.find(r => r.error)?.error
  if (error) return { error: error.message }
  return { error: null }
}
