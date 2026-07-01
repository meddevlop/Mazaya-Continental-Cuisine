import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

function createSessionToken(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return `mz_${timestamp}_${random}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/admin/login?error=no_code", request.url))
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data?.session?.user) {
    return NextResponse.redirect(new URL("/admin/login?error=oauth_failed", request.url))
  }

  const user = data.session.user
  const token = createSessionToken()
  const response = NextResponse.redirect(new URL("/admin/dashboard", request.url))
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
  })
  return response
}
