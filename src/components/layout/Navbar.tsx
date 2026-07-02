"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone } from "lucide-react"
import { business } from "@/data/business"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [settings, setSettings] = useState({ name: business.name, phone: business.phone })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.restaurant_name) setSettings({ name: data.restaurant_name, phone: data.phone || business.phone })
    }).catch(() => {})
  }, [])

  useEffect(() => {
    fetch("/admin/api/auth").then(r => r.json()).then(data => {
      if (data.authenticated && data.user?.role === "admin") setIsAdmin(true)
    }).catch(() => {})
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? "glass" : "bg-transparent"
      }`}
    >
      <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
        isScrolled ? "h-16 md:h-18" : "h-20 md:h-24"
      } flex items-center justify-between`}>
        <Link href="/" className="flex items-center gap-2 group">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`font-serif font-bold tracking-wide transition-all duration-700 ${
              isScrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            } gold-gradient`}
          >
            {settings.name}
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={link.href}
                className="relative text-[#D4C9C0] hover:text-[#C8A45C] transition-colors duration-300 text-xs uppercase tracking-[0.25em] font-medium group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8A45C] transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="hidden lg:flex items-center gap-3"
            >
              {isAdmin && (
                <Link href="/admin/dashboard" className="w-7 h-7 rounded-lg bg-[#C8A45C]/20 border border-[#C8A45C]/30 flex items-center justify-center hover:bg-[#C8A45C]/30 transition-colors">
                  <span className="text-[#C8A45C] text-xs font-bold">M</span>
                </Link>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/reservations"
                className="bg-gradient-to-r from-[#C8A45C] to-[#D4B87A] text-[#111111] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] hover:from-[#B8933D] hover:to-[#C8A45C] transition-all duration-500 shadow-[0_4px_20px_rgba(200,164,92,0.25)] hover:shadow-[0_6px_30px_rgba(200,164,92,0.35)]"
              >
                Reserve
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <a href={`tel:${settings.phone}`} className="text-[#C8A45C]">
            <Phone size={18} />
          </a>
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#F5F0EB] p-1" aria-label="Toggle menu">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <div className="px-4 pb-6 pt-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-[#D4C9C0] hover:text-[#C8A45C] transition-colors text-sm uppercase tracking-[0.2em] border-b border-white/5"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <div className="flex items-center gap-4 mt-4 px-1">
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2.5 rounded border border-white/10 text-[#C8A45C] hover:text-[#C8A45C] hover:border-[#C8A45C]/30 text-xs uppercase tracking-[0.2em] transition-all duration-300"
                  >
                    Admin
                  </Link>
                </div>
              )}
              <Link
                href="/reservations"
                onClick={() => setIsOpen(false)}
                className="block mt-3 bg-gradient-to-r from-[#C8A45C] to-[#D4B87A] text-[#111111] text-center px-5 py-3 text-sm font-bold uppercase tracking-[0.2em]"
              >
                Reserve a Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
