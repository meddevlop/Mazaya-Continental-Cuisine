"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react"
import { loginAdmin } from "@/services/auth"
import { useAuthStore } from "@/store/authStore"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await loginAdmin({ email, password })

    if (result.success) {
      setUser(result.user || { name: "Admin", email, role: "admin" })
      const redirect = searchParams.get("redirect") || result.redirect || "/admin/dashboard"
      router.push(redirect)
    } else {
      setError(result.error || "Invalid credentials")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8A45C]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8A45C]/3 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C8A45C]/3 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-[#C8A45C] flex items-center justify-center mx-auto mb-4">
              <span className="text-[#1A1A1A] font-bold text-xl">M</span>
            </div>
            <h1 className="text-xl font-bold text-[#F5F0EB]">Admin Login</h1>
            <p className="text-sm text-[#6B5E56] mt-1">Mazaya Continental Cuisine</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#D4C9C0] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mazayacuisine.com"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40 focus:bg-white/[0.07] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D4C9C0] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40 focus:bg-white/[0.07] transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5E56] hover:text-[#F5F0EB] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C8A45C] focus:ring-[#C8A45C]"
                />
                <span className="text-xs text-[#6B5E56]">Remember me</span>
              </label>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#C8A45C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#B8933D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-[#111] px-3 text-[#6B5E56]">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const { supabase } = await import("@/lib/supabase")
                  const { data } = await supabase.auth.signInWithOAuth({ provider: "google" })
                  if (data?.url) window.location.href = data.url
                } catch {
                  setError("Social login unavailable in demo mode")
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-[#D4C9C0] text-sm hover:bg-white/5 hover:text-[#F5F0EB] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Google
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  const { supabase } = await import("@/lib/supabase")
                  const { data } = await supabase.auth.signInWithOAuth({ provider: "facebook" })
                  if (data?.url) window.location.href = data.url
                } catch {
                  setError("Social login unavailable in demo mode")
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-[#D4C9C0] text-sm hover:bg-white/5 hover:text-[#F5F0EB] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#D4C9C0]"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p className="text-center text-xs text-[#6B5E56] mt-6">
            Don&apos;t have an account?{" "}
            <a href="/admin/register" className="text-[#C8A45C] hover:text-[#B8933D] transition-colors font-medium">
              Create one
            </a>
          </p>

          <p className="text-center text-[10px] text-[#6B5E56] mt-4">
            Demo: admin@mazayacuisine.com / Mazaya2026!
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <LoginForm />
    </Suspense>
  )
}
