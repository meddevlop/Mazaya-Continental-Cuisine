import { NextResponse } from "next/server"
import { getSettings } from "@/services/settings.service"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const { data, error } = await getSettings()
  if (error) {
    return NextResponse.json({})
  }
  return NextResponse.json(data || {}, {
    headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
  })
}
