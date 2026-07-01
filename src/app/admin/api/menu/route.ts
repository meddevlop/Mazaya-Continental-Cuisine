import { NextResponse } from "next/server"
import { getMenuItems, createMenuItem } from "@/services/menu.service"

export async function GET() {
  const { data, error } = await getMenuItems()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await createMenuItem(body)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
