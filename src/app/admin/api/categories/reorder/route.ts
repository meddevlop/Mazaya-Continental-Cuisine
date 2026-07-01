import { NextResponse } from "next/server"
import { reorderCategories } from "@/services/category.service"

export async function PUT(request: Request) {
  const { ids } = await request.json()
  if (!Array.isArray(ids)) return NextResponse.json({ error: "ids array required" }, { status: 400 })
  const { error } = await reorderCategories(ids)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}
