import { NextResponse } from "next/server"
import { createMessage } from "@/services/messages.service"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }
    const result = await createMessage(body)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
    if (!result.data) return NextResponse.json({ error: "No data returned" }, { status: 500 })
    return NextResponse.json(result.data, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid request" }, { status: 400 })
  }
}
