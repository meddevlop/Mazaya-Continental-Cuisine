import { NextResponse } from "next/server"
import { getMessages, getUnreadMessages } from "@/services/messages.service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const unread = searchParams.get("unread")

  if (unread === "true") {
    const { data, error } = await getUnreadMessages()
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await getMessages()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
