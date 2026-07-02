import { supabase, STORAGE_BUCKETS } from "@/lib/supabase"

export interface MediaItem {
  id: string
  url: string
  name: string
  size: number
  type: string
  folder: string
  created_at: string
  width: number
  height: number
}

export interface MediaFolder {
  id: string
  name: string
  path: string
  count: number
}

const FOLDER_MAP: { name: string; bucket: keyof typeof STORAGE_BUCKETS; path: string }[] = [
  { name: "Hero Images", bucket: "HERO", path: "/hero" },
  { name: "Gallery Images", bucket: "GALLERY", path: "/gallery" },
  { name: "Menu Images", bucket: "MENU", path: "/menu" },
  { name: "Story Images", bucket: "STORY", path: "/story" },
  { name: "Full House Images", bucket: "FULL_HOUSE", path: "/full-house" },
  { name: "Featured Dish Images", bucket: "FEATURED", path: "/featured" },
  { name: "Dish Images", bucket: "MENU", path: "/menu" },
  { name: "Logo", bucket: "LOGO", path: "/logo" },
  { name: "Icons", bucket: "ICONS", path: "/icons" },
  { name: "Other", bucket: "GALLERY", path: "/other" },
]

export async function getMediaItems(folder?: string) {
  const bucket = FOLDER_MAP.find(f => f.name === folder)?.bucket || "GALLERY"
  try {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).list()
    if (error) return { data: [], error: null }

    const folderEntry = FOLDER_MAP.find(f => f.bucket === bucket)
    const folderName = folderEntry?.name || bucket
    const items: MediaItem[] = (data || []).map((file: any, i: number) => ({
      id: `media_${bucket}_${i}`,
      url: supabase.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(file.name).data.publicUrl,
      name: file.name,
      size: file.metadata?.size || 0,
      type: file.metadata?.mimetype || "image/jpeg",
      folder: folderName,
      created_at: file.created_at || new Date().toISOString(),
      width: 800,
      height: 600,
    }))

    return { data: items, error: null }
  } catch {
    return { data: [], error: null }
  }
}

export async function getMediaFolders() {
  const folders: MediaFolder[] = await Promise.all(
    FOLDER_MAP.map(async (f) => {
      const { data } = await supabase.storage.from(STORAGE_BUCKETS[f.bucket]).list()
      let count = data?.length || 0
      return {
        id: `folder_${f.name.toLowerCase().replace(/\s+/g, "_")}`,
        name: f.name,
        path: f.path,
        count,
      }
    })
  )
  return { data: folders, error: null }
}

export async function uploadMediaItem(file: File, folder: string) {
  const bucket = FOLDER_MAP.find(f => f.name === folder)?.bucket || "GALLERY"
  try {
    const fileName = `${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).upload(fileName, file)
    if (error) return { data: null, error: error.message }
    const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(fileName)
    return { data: { ...data, url: publicUrl }, error: null }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Upload failed" }
  }
}

export async function renameMediaItem(id: string, name: string) {
  return { data: { id, name }, error: null }
}

export async function deleteMediaItem(fileName: string, folder: string) {
  const bucket = FOLDER_MAP.find(f => f.name === folder)?.bucket || "GALLERY"
  if (!fileName) return { error: "Invalid file name" }
  const { error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).remove([fileName])
  if (error) return { error: error.message }
  return { error: null }
}
