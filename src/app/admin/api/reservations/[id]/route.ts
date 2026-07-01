import { NextResponse } from "next/server"
import { updateReservationStatus, deleteReservation } from "@/services/reservation.service"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { data, error } = await updateReservationStatus(id, body.status)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await deleteReservation(id)
  if (error) {
    if (error.includes("No rows")) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
