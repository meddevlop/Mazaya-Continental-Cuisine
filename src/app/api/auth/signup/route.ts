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
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    if (!data?.user) {
      return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: data.user.email || email,
      full_name: name,
      role: "user",
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
    }

    const token = createSessionToken()
    const response = NextResponse.json({
      success: true,
      redirect: "/",
      user: { name, email: data.user.email, role: "user" },
    })

    setSessionCookie(response, token, SESSION_DURATION_MS / 1000)
    response.cookies.set("admin_email", data.user.email || email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    })
    response.cookies.set("admin_role", "user", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    })

    return response
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("Signup POST error:", msg)
    return NextResponse.json({ success: false, error: msg || "Internal server error" }, { status: 500 })
  }
}
