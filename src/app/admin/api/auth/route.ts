import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

function createSessionToken(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return `mz_${timestamp}_${random}`
}

function isSessionValid(token: string): boolean {
  if (!token.startsWith("mz_")) return false
  const parts = token.split("_")
  if (parts.length < 3) return false
  const timestamp = parseInt(parts[1], 36)
  if (isNaN(timestamp)) return false
  return Date.now() - timestamp < SESSION_DURATION_MS
}

function setSessionCookie(response: NextResponse, token: string, maxAge: number) {
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  })
}

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")?.value

  if (session && isSessionValid(session)) {
    const userEmail = cookieStore.get("admin_email")?.value || "admin@mazayacuisine.com"
    const isAdmin = userEmail === "admin@mazayacuisine.com"
    const response = NextResponse.json({
      authenticated: true,
      user: { name: isAdmin ? "Admin" : userEmail.split("@")[0], email: userEmail, role: isAdmin ? "admin" : "user" },
    })
    setSessionCookie(response, session, SESSION_DURATION_MS / 1000)
    return response
  }

  if (session) {
    const response = NextResponse.json({ authenticated: false }, { status: 401 })
    setSessionCookie(response, "", 0)
    return response
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return NextResponse.json({ success: false, error: error.message || "Invalid credentials" }, { status: 401 })
    }

    const isAdmin = email === "admin@mazayacuisine.com"
    const token = createSessionToken()
    const response = NextResponse.json({
      success: true,
      redirect: "/admin/dashboard",
      user: { name: isAdmin ? "Admin" : email.split("@")[0], email, role: isAdmin ? "admin" : "user" },
    })
    setSessionCookie(response, token, SESSION_DURATION_MS / 1000)
    response.cookies.set("admin_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    })
    return response
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("Auth POST error:", msg)
    return NextResponse.json({ success: false, error: msg || "Internal server error" }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  setSessionCookie(response, "", 0)
  return response
}
