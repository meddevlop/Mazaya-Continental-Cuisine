import { NextResponse } from "next/server"
import { getCategories, createCategory } from "@/services/category.service"
import { menuCategories } from "@/data/menu"

export async function GET() {
  const { data, error } = await getCategories()
  if (data && data.length > 0) return NextResponse.json(data)
  if (error) console.error("Categories API error:", error)
  const fallback = menuCategories.map(c => ({
    id: c.id, name: c.name, name_ar: c.nameAr,
  }))
  return NextResponse.json(fallback)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await createCategory(body)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
