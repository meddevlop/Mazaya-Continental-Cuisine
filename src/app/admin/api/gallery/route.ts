import { NextResponse } from "next/server"
import { getGallery, createGalleryItem } from "@/services/gallery.service"
import { inMemoryGallery } from "@/services/memory-store"

export async function GET() {
  const { data, error } = await getGallery()
  if (error) console.error("Gallery GET error:", error)
  const memCats = Object.values(inMemoryGallery).filter(c => !c._deleted)
  const dbIds = new Set((data || []).map((i: any) => i.id))
  const merged = [...(data || []), ...memCats.filter(c => !dbIds.has(c.id))]
  return NextResponse.json(merged, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate" },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await createGalleryItem(body)
  if (!error) return NextResponse.json(data, { status: 201 })
  console.error("Gallery POST error:", error)
  const id = `gal_${Date.now().toString(36)}`
  inMemoryGallery[id] = { id, url: body.url, alt: body.alt || "", alt_ar: body.alt_ar || "", category: body.category || "general", is_active: true, sort_order: 0, created_at: new Date().toISOString() }
  return NextResponse.json(inMemoryGallery[id], { status: 201 })
}
