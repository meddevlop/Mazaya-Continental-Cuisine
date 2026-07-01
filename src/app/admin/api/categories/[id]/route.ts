import { NextResponse } from "next/server"
import { updateCategory, deleteCategory } from "@/services/category.service"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { data, error } = await updateCategory(id, body)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await deleteCategory(id)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
