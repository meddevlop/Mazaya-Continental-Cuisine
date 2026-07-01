import { NextResponse } from "next/server"
import { getCategories } from "@/services/category.service"

export const dynamic = "force-dynamic"

export async function GET() {
  const { data, error } = await getCategories()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data || [])
}
