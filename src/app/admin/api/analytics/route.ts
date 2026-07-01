import { NextResponse } from "next/server"
import { getAnalyticsOverview } from "@/services/analytics.service"

export async function GET() {
  const { data, error } = await getAnalyticsOverview()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
