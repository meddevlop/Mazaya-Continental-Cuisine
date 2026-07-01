import { NextResponse } from "next/server"
import { getCustomerById } from "@/services/customers.service"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await getCustomerById(id)
  if (error) return NextResponse.json({ error }, { status: 404 })
  return NextResponse.json(data)
}
