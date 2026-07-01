import { NextResponse } from "next/server"
import { uploadImage } from "@/services/gallery.service"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const { url, error } = await uploadImage(file, "GALLERY")
    if (error) return NextResponse.json({ error }, { status: 500 })

    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
