import { createServerClient } from "@/lib/supabase"

export interface MenuItemData {
  id: string
  name: string
  name_ar: string
  description: string
  description_ar: string
  price: number
  category_id: string
  category_name?: string
  image_url: string
  is_available: boolean
  is_featured: boolean
  is_popular: boolean
  sort_order: number
  created_at: string
}

function mapRow(row: any): MenuItemData {
  return {
    id: row.id,
    name: row.name,
    name_ar: row.name_ar || "",
    description: row.description || "",
    description_ar: row.description_ar || "",
    price: Number(row.price),
    category_id: row.category_id || "",
    category_name: row.category?.name || "",
    image_url: row.image_url || "",
    is_available: row.is_available ?? true,
    is_featured: row.is_featured ?? false,
    is_popular: row.is_popular ?? false,
    sort_order: row.sort_order ?? 0,
    created_at: row.created_at,
  }
}

const db = () => createServerClient()

export async function getMenuItems() {
  const { data, error } = await db()
    .from("menu_items")
    .select("*, category:categories(name)")
    .order("sort_order", { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function getMenuItemsByCategory(categoryId: string) {
  const { data, error } = await db()
    .from("menu_items")
    .select("*, category:categories(name)")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function getPopularItems() {
  const { data, error } = await db()
    .from("menu_items")
    .select("*, category:categories(name)")
    .eq("is_popular", true)
    .eq("is_available", true)
    .order("sort_order", { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function createMenuItem(item: Record<string, any>) {
  const { data, error } = await db()
    .from("menu_items")
    .insert([item])
    .select("*, category:categories(name)")
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function updateMenuItem(id: string, updates: Record<string, any>) {
  const { data, error } = await db()
    .from("menu_items")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, category:categories(name)")
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function deleteMenuItem(id: string) {
  const { error } = await db().from("menu_items").delete().eq("id", id)
  if (error) return { error: error.message }
  return { error: null }
}
