import { NextResponse } from "next/server"
import { getGallery } from "@/services/gallery.service"
import { inMemoryGallery } from "@/services/memory-store"

export async function GET() {
  const { data, error } = await getGallery()
  if (error) console.error("Public gallery GET error:", error)
  const memCats = Object.values(inMemoryGallery).filter(c => !c._deleted)
  const dbIds = new Set((data || []).map((i: any) => i.id))
  const merged = [...(data || []), ...memCats.filter(c => !dbIds.has(c.id))]
  const active = merged.filter((i: any) => i.is_active !== false)
  return NextResponse.json(active)
}
