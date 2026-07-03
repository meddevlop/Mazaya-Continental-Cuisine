import { NextResponse } from "next/server"
import { updateCategory, deleteCategory } from "@/services/category.service"
import { inMemoryCategories } from "@/services/memory-store"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  if (inMemoryCategories[id]) {
    Object.assign(inMemoryCategories[id], body)
    return NextResponse.json(inMemoryCategories[id])
  }
  const { data, error } = await updateCategory(id, body)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    console.error("Categories PUT error:", error)
    return NextResponse.json(body, { status: 200 })
  }
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (inMemoryCategories[id]) {
    inMemoryCategories[id]._deleted = true
    return NextResponse.json({ success: true })
  }
  const { error } = await deleteCategory(id)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
