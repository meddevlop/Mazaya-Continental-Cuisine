export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  captchaAnswer: number
  captchaExpected: number
}

export interface AuthResponse {
  success: boolean
  error?: string
  redirect?: string
  user?: { name: string; email: string; role: string }
}

export async function loginAdmin(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const res = await fetch("/admin/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const data = await res.json()

    if (!res.ok) {
      return { success: false, error: data.error || "Login failed" }
    }

    return { success: true, redirect: data.redirect }
  } catch {
    return { success: false, error: "Connection error. Please try again." }
  }
}

export async function registerAdmin(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const res = await fetch("/admin/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const data = await res.json()

    if (!res.ok) {
      return { success: false, error: data.error || "Registration failed" }
    }

    return { success: true, redirect: data.redirect, user: data.user }
  } catch {
    return { success: false, error: "Connection error. Please try again." }
  }
}

export async function logoutAdmin(): Promise<void> {
  await fetch("/admin/api/auth", { method: "DELETE" })
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const res = await fetch("/admin/api/auth")
    return res.ok
  } catch {
    return false
  }
}
