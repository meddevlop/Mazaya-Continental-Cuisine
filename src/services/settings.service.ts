import { supabase, createServerClient } from "@/lib/supabase"

export interface SettingsData {
  id?: string
  restaurant_name: string
  restaurant_name_ar?: string
  tagline?: string
  tagline_ar?: string
  description?: string
  logo?: string
  hero_video?: string
  hero_image?: string
  hero_title?: string
  hero_subtitle?: string
  phone?: string
  whatsapp_number?: string
  email?: string
  address?: string
  address_ar?: string
  opening_hours?: string
  instagram?: string
  facebook?: string
  google_review_url?: string
  currency?: string
  rating?: number
  locale?: string
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  dark_mode?: boolean
  font_heading?: string
  font_body?: string
  footer_copyright?: string
  seo_title?: string
  og_image?: string
  social_links?: Record<string, any>
  story_image?: string
  featured_dish_image?: string
  full_house_image?: string
}

function mapRow(row: any): SettingsData {
  if (!row) row = {}
  return {
    id: row.id,
    restaurant_name: row.restaurant_name || "",
    restaurant_name_ar: row.restaurant_name_ar || "",
    tagline: row.tagline || "",
    tagline_ar: row.tagline_ar || "",
    description: row.description || "",
    logo: row.logo || "",
    hero_video: row.hero_video || "",
    hero_image: row.hero_image || "",
    hero_title: row.hero_title || "",
    hero_subtitle: row.hero_subtitle || "",
    phone: row.phone || "",
    whatsapp_number: row.whatsapp_number || "",
    email: row.email || "",
    address: row.address || "",
    address_ar: row.address_ar || "",
    opening_hours: row.opening_hours || "",
    instagram: row.instagram || "",
    facebook: row.facebook || "",
    google_review_url: row.google_review_url || "",
    currency: row.currency || "EGP",
    rating: row.rating ?? 4.9,
    locale: row.locale || "en",
    primary_color: row.primary_color || "#C8A45C",
    secondary_color: row.secondary_color || "#B8933D",
    accent_color: row.accent_color || "#D4C9C0",
    dark_mode: row.dark_mode ?? true,
    font_heading: row.font_heading || "Playfair Display",
    font_body: row.font_body || "Inter",
    footer_copyright: row.footer_copyright || "",
    seo_title: row.seo_title || "",
    og_image: row.og_image || "",
    social_links: row.social_links || {},
    story_image: row.story_image || "",
    featured_dish_image: row.featured_dish_image || "",
    full_house_image: row.full_house_image || "",
  }
}

function ensureSettingsRow() {
  return supabase.rpc("ensure_settings_row")
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single()
  if (error && error.message.includes("not found")) {
    await supabase.from("settings").insert({}).select().single()
    const { data: retry, error: retryErr } = await supabase.from("settings").select("*").single()
    if (retryErr) return { data: null, error: retryErr.message }
    return { data: mapRow(retry || {}), error: null }
  }
  if (error) return { data: null, error: error.message }
  if (!data) {
    const { data: inserted } = await supabase.from("settings").insert({}).select().single()
    return { data: mapRow(inserted || {}), error: null }
  }
  return { data: mapRow(data), error: null }
}

export async function updateSettings(settings: Partial<SettingsData>) {
  const client = createServerClient()
  const { data: existing } = await supabase.from("settings").select("id").single()
  let id = existing?.id

  if (!id) {
    const { data: inserted } = await supabase.from("settings").insert({}).select("id").single()
    id = inserted?.id
  }

  const { data, error } = await client
    .from("settings")
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq("id", id || "")
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: mapRow(data), error: null }
}
