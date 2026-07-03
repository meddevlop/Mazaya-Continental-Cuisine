import { NextResponse } from "next/server"
import { getMenuItems, createMenuItem } from "@/services/menu.service"
import { menuCategories } from "@/data/menu"

export async function GET() {
  const { data, error } = await getMenuItems()
  if (data && data.length > 0) return NextResponse.json(data)
  if (error) console.error("Menu API error:", error)
  const fallback = menuCategories.flatMap(c =>
    c.items.map(i => ({
      id: `${c.id}-${i.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: i.name, name_ar: i.nameAr || "", description: i.description || "", description_ar: "",
      price: i.price, category_id: c.id, category_name: c.name,
      is_featured: false, is_available: true, sort_order: 0, is_popular: i.isBestSeller || false,
    }))
  )
  return NextResponse.json(fallback)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await createMenuItem(body)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
