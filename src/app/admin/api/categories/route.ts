import { NextResponse } from "next/server"
import { getCategories, createCategory } from "@/services/category.service"
import { menuCategories } from "@/data/menu"
import { inMemoryCategories } from "@/services/memory-store"

export async function GET() {
  const { data, error } = await getCategories()
  if (error) console.error("Categories API error:", error)
  const memCats = Object.values(inMemoryCategories).filter(c => !c._deleted)
  const dbIds = new Set((data || []).map(c => c.id))
  const merged = [
    ...menuCategories.filter(c => !dbIds.has(c.id)).map(c => ({
      id: c.id, name: c.name, name_ar: c.nameAr,
      item_count: c.items.length,
    })),
    ...(data || []),
    ...memCats.filter(c => !dbIds.has(c.id)),
  ]
  return NextResponse.json(merged)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await createCategory(body)
  if (!error) return NextResponse.json(data, { status: 201 })
  console.error("Categories POST error:", error)
  const id = `cat_${Date.now().toString(36)}`
  inMemoryCategories[id] = { id, name: body.name, name_ar: body.name_ar || "", slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"), color: body.color || "#C8A45C", icon: body.icon || "FolderTree", order_index: body.sort_order ?? 0, is_active: body.is_active ?? true, item_count: 0 }
  return NextResponse.json(inMemoryCategories[id], { status: 201 })
}
