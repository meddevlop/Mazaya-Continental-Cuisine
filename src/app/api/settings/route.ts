import { NextResponse } from "next/server"
import { getSettings } from "@/services/settings.service"

export const dynamic = "force-dynamic"

export async function GET() {
  const { data, error } = await getSettings()
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({})
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json(data || {})
}
