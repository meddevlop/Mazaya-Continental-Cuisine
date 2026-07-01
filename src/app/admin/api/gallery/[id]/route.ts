import { NextResponse } from "next/server"
import { updateGalleryItem, deleteGalleryItem } from "@/services/gallery.service"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { data, error } = await updateGalleryItem(id, body)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const parsedUrl = new URL(request.url)
  const imageUrl = parsedUrl.searchParams.get("url") || undefined
  const { error } = await deleteGalleryItem(id, imageUrl)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
