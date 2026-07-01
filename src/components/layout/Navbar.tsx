"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  const [settings, setSettings] = useState({ name: business.name, phone: business.phone })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.restaurant_name) setSettings({ name: data.restaurant_name, phone: data.phone || business.phone })
    }).catch(() => {})
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-[#1A1A1A]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#C8A45C] font-serif text-xl md:text-2xl font-bold tracking-wide">
              {settings.name}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#F5F0EB] hover:text-[#C8A45C] transition-colors duration-300 text-sm uppercase tracking-widest font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservations"
              className="bg-[#C8A45C] text-[#1A1A1A] px-5 py-2 text-sm font-bold uppercase tracking-wider hover:bg-[#B8933D] transition-colors duration-300"
            >
              Reserve
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <a href={`tel:${settings.phone}`} className="text-[#C8A45C]">
              <Phone size={20} />
            </a>
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#F5F0EB]">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-[#1A1A1A] border-t border-white/10 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-[#F5F0EB] hover:text-[#C8A45C] transition-colors text-sm uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservations"
              onClick={() => setIsOpen(false)}
              className="block mx-4 mt-4 bg-[#C8A45C] text-[#1A1A1A] text-center px-5 py-3 text-sm font-bold uppercase tracking-wider"
            >
              Reserve a Table
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
