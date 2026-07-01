import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

function createSessionToken(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return `mz_${timestamp}_${random}`
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, captchaAnswer, captchaExpected } = body

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 })
    }

    if (!captchaAnswer || String(captchaAnswer) !== String(captchaExpected)) {
      return NextResponse.json({ success: false, error: "Incorrect verification answer. Please try again." }, { status: 400 })
    }

    let authUser: { id: string; email: string } | null = null

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }
      authUser = data?.user ? { id: data.user.id, email: data.user.email || email } : null
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }
      authUser = data?.user ? { id: data.user.id, email: data.user.email || email } : null
    }

    if (!authUser) {
      return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
    }

    const token = createSessionToken()
    const response = NextResponse.json({
      success: true,
      redirect: "/admin/dashboard",
      user: { name, email: authUser.email, role: "user" },
    })
    setSessionCookie(response, token, SESSION_DURATION_MS / 1000)
    response.cookies.set("admin_email", authUser.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    })
    return response
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
