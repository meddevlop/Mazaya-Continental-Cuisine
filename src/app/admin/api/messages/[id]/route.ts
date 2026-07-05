import { NextResponse } from "next/server"
import { markMessageAsRead, markMessageAsUnread, toggleMessageArchived, deleteMessage } from "@/services/messages.service"

function handleError(error: string) {
  if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ error }, { status: 500 })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  if (body.is_read === true) {
    const { data, error } = await markMessageAsRead(id)
    if (error) return handleError(error)
    return NextResponse.json(data)
  }

  if (body.is_read === false) {
    const { data, error } = await markMessageAsUnread(id)
    if (error) return handleError(error)
    return NextResponse.json(data)
  }

  if (body.is_archived !== undefined) {
    const { data, error } = await toggleMessageArchived(id)
    if (error) return handleError(error)
    return NextResponse.json(data)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await deleteMessage(id)
  if (error) return handleError(error)
  return NextResponse.json({ success: true })
}
