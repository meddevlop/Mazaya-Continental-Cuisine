import { NextResponse } from "next/server"
import { createReservation, getReservations } from "@/services/reservation.service"

export const dynamic = "force-dynamic"

export async function GET() {
  const { data, error } = await getReservations()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, error } = await createReservation(body)
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
