import { NextResponse } from "next/server"
import { getMediaItems, getMediaFolders, deleteMediaItem, uploadMediaItem, renameMediaItem } from "@/services/media.service"
import { createGalleryItem } from "@/services/gallery.service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("folders") === "true") {
    const { data, error } = await getMediaFolders()
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  }
  const folder = searchParams.get("folder") || undefined
  const { data, error } = await getMediaItems(folder)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const fd = await request.formData()
  const file = fd.get("file") as File | null
  const folder = (fd.get("folder") as string) || "Other"
  if (!file) return NextResponse.json({ error: "file required" }, { status: 400 })
  const { data, error } = await uploadMediaItem(file, folder)
  if (error) return NextResponse.json({ error }, { status: 500 })
  if (data?.url) {
    await createGalleryItem({ url: data.url, alt: file.name.replace(/\.[^.]+$/, ""), alt_ar: "", category: "general", is_active: true }).catch(() => {})
  }
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const body = await request.json()
  const { data, error } = await renameMediaItem(id, body.name)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { error } = await deleteMediaItem(id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}
