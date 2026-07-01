import { NextResponse } from "next/server"
import { getNotifications, markAllAsRead, getUnreadNotificationCount } from "@/services/notifications.service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("count") === "true") {
    const { data, error } = await getUnreadNotificationCount()
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json({ count: data })
  }
  const { data, error } = await getNotifications()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH() {
  const { data, error } = await markAllAsRead()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: data })
}
