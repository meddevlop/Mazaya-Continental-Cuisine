import { NextResponse } from "next/server"
import { markNotificationAsRead } from "@/services/notifications.service"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await markNotificationAsRead(id)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json(data)
}
