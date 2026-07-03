import { NextResponse } from "next/server"
import { updateGalleryItem, deleteGalleryItem, getGallery } from "@/services/gallery.service"
import { inMemoryGallery } from "@/services/memory-store"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  if (inMemoryGallery[id]) {
    Object.assign(inMemoryGallery[id], body)
    return NextResponse.json(inMemoryGallery[id])
  }
  const { data, error } = await updateGalleryItem(id, body)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    console.error("Gallery PUT error:", error)
    return NextResponse.json(body, { status: 200 })
  }
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (inMemoryGallery[id]) {
    inMemoryGallery[id]._deleted = true
    return NextResponse.json({ success: true })
  }
  const { data: allItems } = await getGallery()
  const item = (allItems || []).find((i: any) => i.id === id)
  const imageUrl = item?.url || undefined
  const { error } = await deleteGalleryItem(id, imageUrl)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    console.error("Gallery DELETE error:", error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
  return NextResponse.json({ success: true })
}
