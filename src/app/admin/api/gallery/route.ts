import { NextResponse } from "next/server"
import { getGallery, createGalleryItem } from "@/services/gallery.service"

export async function GET() {
  const { data, error } = await getGallery()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await createGalleryItem(body)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
