import { NextResponse } from "next/server"
import { getCategories, createCategory } from "@/services/category.service"
import { menuCategories } from "@/data/menu"
import { inMemoryCategories } from "@/services/memory-store"

function addSortOrder(cat: any) {
  return { ...cat, sort_order: cat.sort_order ?? cat.order_index ?? 0 }
}

export async function GET() {
  const { data, error } = await getCategories()
  if (error) console.error("Categories API error:", error)
  const memCats = Object.values(inMemoryCategories).filter(c => !c._deleted)
  const dbIds = new Set((data || []).map(c => c.id))
  const merged = [
    ...menuCategories.filter(c => !dbIds.has(c.id)).map(c => ({
      id: c.id, name: c.name, name_ar: c.nameAr,
      sort_order: 99, item_count: c.items.length,
    })),
    ...(data || []).map(addSortOrder),
    ...memCats.filter(c => !dbIds.has(c.id)).map(addSortOrder),
  ]
  return NextResponse.json(merged)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await createCategory(body)
  if (!error) return NextResponse.json(data, { status: 201 })
  console.error("Categories POST error:", error)
  const id = `cat_${Date.now().toString(36)}`
  inMemoryCategories[id] = { id, name: body.name, name_ar: body.name_ar || "", slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"), color: body.color || "#C8A45C", icon: body.icon || "FolderTree", order_index: body.sort_order ?? 0, sort_order: body.sort_order ?? 0, is_active: body.is_active ?? true, item_count: 0 }
  return NextResponse.json(inMemoryCategories[id], { status: 201 })
}
