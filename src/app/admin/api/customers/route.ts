import { NextResponse } from "next/server"
import { getCustomers } from "@/services/customers.service"

export async function GET() {
  const { data, error } = await getCustomers()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
