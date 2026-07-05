import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSettings, updateSettings } from "@/services/settings.service"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const { data, error } = await getSettings()
  if (error) {
    return NextResponse.json({}, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    })
  }
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
  })
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("admin_sb_token")?.value
    const { data, error } = await updateSettings(body, accessToken)
    if (error) {
      console.error("settings PUT error:", error)
      return NextResponse.json({ error, detail: error }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error("settings PUT exception:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
