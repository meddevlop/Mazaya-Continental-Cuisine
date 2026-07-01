import { NextResponse } from "next/server"
import { getReservations, getReservationsByDate, getReservationsByStatus } from "@/services/reservation.service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const status = searchParams.get("status")

  if (date) {
    const { data, error } = await getReservationsByDate(date)
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  }

  if (status) {
    const { data, error } = await getReservationsByStatus(status as any)
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await getReservations()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
