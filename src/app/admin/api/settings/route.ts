import { NextResponse } from "next/server"
import { getSettings, updateSettings } from "@/services/settings.service"

export async function GET() {
  const { data, error } = await getSettings()
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({})
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { data, error } = await updateSettings(body)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
