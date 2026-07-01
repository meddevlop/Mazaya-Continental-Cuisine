"use client"

import { useState, useEffect } from "react"
import { Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { business } from "@/data/business"

export default function MobileStickyBar() {
  const [settings, setSettings] = useState({ phone: business.phone, address: business.address })

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.phone || data.address) setSettings({ phone: data.phone || business.phone, address: data.address || business.address })
    }).catch(() => {})
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t border-[#C8A45C]/30 md:hidden">
      <div className="flex items-center justify-around h-16">
        <a
          href={`tel:${settings.phone}`}
          className="flex flex-col items-center gap-0.5 text-[#D4C9C0] hover:text-[#C8A45C] transition-colors px-3 py-1"
        >
          <Phone size={18} />
          <span className="text-[10px] uppercase tracking-wider">Call</span>
        </a>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(settings.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-[#D4C9C0] hover:text-[#C8A45C] transition-colors px-3 py-1"
        >
          <MapPin size={18} />
          <span className="text-[10px] uppercase tracking-wider">Direction</span>
        </a>
        <Link
          href="/reservations"
          className="flex flex-col items-center gap-0.5 text-[#C8A45C] hover-[#B8933D] transition-colors px-3 py-1"
        >
          <Calendar size={18} />
          <span className="text-[10px] uppercase tracking-wider">Reserve</span>
        </Link>
      </div>
    </div>
  )
}
