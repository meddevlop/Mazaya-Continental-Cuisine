import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_LOGIN = "/signup"
const ADMIN_REGISTER = "/admin/register"
const ADMIN_DASHBOARD = "/admin/dashboard"
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

function isSessionValid(token: string): boolean {
  if (!token.startsWith("mz_")) return false
  const parts = token.split("_")
  if (parts.length < 3) return false
  const timestamp = parseInt(parts[1], 36)
  if (isNaN(timestamp)) return false
  return Date.now() - timestamp < SESSION_DURATION_MS
}

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value
  const role = request.cookies.get("admin_role")?.value
  const { pathname } = request.nextUrl

  const isAdminPath = pathname.startsWith("/admin")
  const isLoginPath = pathname === ADMIN_LOGIN
  const isRegisterPath = pathname === ADMIN_REGISTER
  const isAuthApiPath = pathname === "/admin/api/auth"
  const isRegisterApiPath = pathname === "/admin/api/auth/register"
  const isStaticAsset = pathname.includes("_next") || pathname.includes("favicon")

  if (isStaticAsset) return NextResponse.next()

  if (isAuthApiPath || isRegisterApiPath) return NextResponse.next()

  if (isAdminPath && !isLoginPath && !isRegisterPath) {
    if (!session || !isSessionValid(session)) {
      const loginUrl = new URL(ADMIN_LOGIN, request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if ((isLoginPath || isRegisterPath) && session && isSessionValid(session)) {
    return NextResponse.redirect(new URL(ADMIN_DASHBOARD, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
