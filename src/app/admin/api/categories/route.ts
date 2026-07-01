import { NextResponse } from "next/server"
import { getCategories, createCategory } from "@/services/category.service"

export async function GET() {
  const { data, error } = await getCategories()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await createCategory(body)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
