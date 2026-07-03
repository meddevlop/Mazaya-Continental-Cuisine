import { createServerClient, STORAGE_BUCKETS } from "@/lib/supabase"

export interface GalleryData {
  id: string
  url: string
  alt: string
  alt_ar: string
  category: string
  sort_order: number
  is_active: boolean
  created_at: string
}

function mapRow(row: any): GalleryData {
  return {
    id: row.id,
    url: row.url || "",
    alt: row.alt || "",
    alt_ar: row.alt_ar || "",
    category: row.category || "general",
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? true,
    created_at: row.created_at,
  }
}

const db = () => createServerClient()

export async function getGallery() {
  const { data, error } = await db()
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function getGalleryByCategory(category: string) {
  const { data, error } = await db()
    .from("gallery")
    .select("*")
    .eq("category", category)
    .order("sort_order", { ascending: true })
  if (error) return { data: null, error: error.message }
  return { data: (data || []).map(mapRow), error: null }
}

export async function uploadImage(file: File, bucket: keyof typeof STORAGE_BUCKETS = "GALLERY") {
  const client = db()
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`
  const { data, error } = await client.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(fileName, file, { cacheControl: "3600", upsert: false })

  if (error) return { url: null, error: error.message }

  const { data: urlData } = client.storage
    .from(STORAGE_BUCKETS[bucket])
    .getPublicUrl(data.path)

  return { url: urlData.publicUrl, error: null }
}

export async function createGalleryItem(item: Record<string, any>) {
  const { data, error } = await db()
    .from("gallery")
    .insert([item])
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function updateGalleryItem(id: string, updates: Record<string, any>) {
  const { data, error } = await db()
    .from("gallery")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}

export async function deleteGalleryItem(id: string, imageUrl?: string) {
  const client = db()
  if (imageUrl) {
    const path = imageUrl.split("/").pop()
    if (path) {
      await client.storage.from(STORAGE_BUCKETS.GALLERY).remove([path])
    }
  }
  const { error } = await client.from("gallery").delete().eq("id", id)
  if (error) return { error: error.message }
  return { error: null }
}
