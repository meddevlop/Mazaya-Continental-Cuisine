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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-lg border-t border-[#C8A45C]/20 md:hidden">
      <div className="flex items-center justify-around h-16">
        <a
          href={`tel:${settings.phone}`}
          className="flex flex-col items-center gap-0.5 text-[#9B8B80] hover:text-[#C8A45C] transition-colors px-3 py-1"
          aria-label="Call us"
        >
          <Phone size={18} />
          <span className="text-[10px] uppercase tracking-widest">Call</span>
        </a>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(settings.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-[#9B8B80] hover:text-[#C8A45C] transition-colors px-3 py-1"
          aria-label="Get directions"
        >
          <MapPin size={18} />
          <span className="text-[10px] uppercase tracking-widest">Direction</span>
        </a>
        <Link
          href="/reservations"
          className="flex flex-col items-center gap-0.5 text-[#C8A45C] transition-colors px-3 py-1"
          aria-label="Make a reservation"
        >
          <Calendar size={18} />
          <span className="text-[10px] uppercase tracking-widest">Reserve</span>
        </Link>
      </div>
    </div>
  )
}
