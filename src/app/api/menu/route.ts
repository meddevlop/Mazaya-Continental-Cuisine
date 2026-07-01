import { NextResponse } from "next/server"
import { getMenuItems } from "@/services/menu.service"

export const dynamic = "force-dynamic"

export async function GET() {
  const { data, error } = await getMenuItems()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data || [])
}
