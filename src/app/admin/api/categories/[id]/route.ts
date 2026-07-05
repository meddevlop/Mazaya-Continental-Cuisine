import { NextResponse } from "next/server"
import { updateCategory, deleteCategory } from "@/services/category.service"
import { inMemoryCategories } from "@/services/memory-store"

function mapBody(body: any) {
  const { sort_order, order_index, ...rest } = body
  return { ...rest, order_index: sort_order ?? order_index ?? 0, sort_order: sort_order ?? 0 }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const mapped = mapBody(body)
  if (inMemoryCategories[id]) {
    Object.assign(inMemoryCategories[id], mapped)
    return NextResponse.json(inMemoryCategories[id])
  }
  const { data, error } = await updateCategory(id, mapped)
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
