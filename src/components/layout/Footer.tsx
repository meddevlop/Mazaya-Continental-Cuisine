"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Camera, Clock } from "lucide-react"
import { business } from "@/data/business"

export default function Footer() {
  const [settings, setSettings] = useState({
    name: business.name, tagline: business.tagline, rating: business.rating,
    phone: business.phone, email: business.email, address: business.address,
    instagram: business.instagram, hours: business.hours, nameAr: business.nameAr, taglineAr: business.taglineAr,
  })

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (!data.restaurant_name) return
      setSettings({
        name: data.restaurant_name || business.name,
        tagline: data.tagline || business.tagline,
        rating: business.rating,
        phone: data.phone || business.phone,
        email: data.email || business.email,
        address: data.address || business.address,
        instagram: (data.instagram || "").replace("https://instagram.com/", "") || business.instagram,
        hours: data.opening_hours ? [{ day: "", time: data.opening_hours }] : business.hours,
        nameAr: data.restaurant_name_ar || business.nameAr,
        taglineAr: data.tagline_ar || business.taglineAr,
      })
    }).catch(() => {})
  }, [])

  return (
    <footer className="bg-[#1A1A1A] text-[#F5F0EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-[#C8A45C] font-serif text-2xl font-bold mb-4">{settings.name}</h3>
            <p className="text-[#D4C9C0] text-sm leading-relaxed">{settings.tagline}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-[#C8A45C] text-lg">★</span>
              <span className="font-bold">{settings.rating}</span>
              <span className="text-[#D4C9C0] text-sm">Rating</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-[#C8A45C]">Quick Links</h4>
            <div className="space-y-2">
              {["Home", "Menu", "Gallery", "About", "Contact"].map((link) => (
                <Link
                  key={link}
                  href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                  className="block text-[#D4C9C0] hover:text-[#C8A45C] transition-colors text-sm"
                >
                  {link}
                </Link>
              ))}
              <Link href="/reservations" className="block text-[#C8A45C] hover:text-[#B8933D] transition-colors text-sm font-semibold">
                Reserve a Table
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-[#C8A45C]">Contact</h4>
            <div className="space-y-3">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-[#D4C9C0] hover:text-[#C8A45C] transition-colors text-sm">
                <Phone size={14} /> {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-[#D4C9C0] hover:text-[#C8A45C] transition-colors text-sm">
                <Mail size={14} /> {settings.email}
              </a>
              <div className="flex items-start gap-2 text-[#D4C9C0] text-sm">
                <MapPin size={14} className="mt-0.5" /> {settings.address}
              </div>
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#D4C9C0] hover:text-[#C8A45C] transition-colors text-sm"
              >
                <Camera size={14} /> @{settings.instagram}
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-[#C8A45C]">Opening Hours</h4>
            <div className="space-y-2">
              {settings.hours.map((h) => (
                <div key={h.day} className="flex items-start gap-2 text-sm">
                  <Clock size={14} className="mt-0.5 text-[#C8A45C]" />
                  <div>
                    <p className="text-[#D4C9C0]">{h.day}</p>
                    <p className="text-[#F5F0EB] font-medium">{h.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#D4C9C0] text-sm">&copy; {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <p className="text-[#D4C9C0] text-sm">
            {settings.nameAr} &mdash; {settings.taglineAr}
          </p>
        </div>
      </div>
    </footer>
  )
}
