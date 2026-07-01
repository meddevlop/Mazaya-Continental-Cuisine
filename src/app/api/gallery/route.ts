import { NextResponse } from "next/server"
import { getGallery } from "@/services/gallery.service"

export const dynamic = "force-dynamic"

export async function GET() {
  const { data, error } = await getGallery()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data || [])
}
