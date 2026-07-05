import { NextResponse } from "next/server"
import { getMenuItems } from "@/services/menu.service"
import { menuCategories } from "@/data/menu"

export const dynamic = "force-dynamic"

export async function GET() {
  const { data, error } = await getMenuItems()
  if (error) return NextResponse.json({ error }, { status: 500 })
  const dbIds = new Set((data || []).map((i: any) => i.id))
  const fallback = menuCategories.flatMap(c =>
    c.items.map(i => ({
      id: `${c.id}-${i.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: i.name, name_ar: i.nameAr || "", description: i.description || "", description_ar: "",
      price: i.price, category_id: c.id, category_name: c.name,
      is_featured: false, is_available: true, sort_order: 0, is_popular: i.isBestSeller || false,
    }))
  ).filter((i: any) => !dbIds.has(i.id))
  return NextResponse.json([...(data || []), ...fallback])
}
