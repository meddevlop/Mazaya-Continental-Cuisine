"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { business } from "@/data/business"

interface Settings { nameAr: string }

export default function GalleryPage() {
  const [settings, setSettings] = useState<Settings>({ nameAr: business.nameAr })

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.restaurant_name_ar) setSettings({ nameAr: data.restaurant_name_ar })
    }).catch(() => {})
  }, [])

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#111111]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A45C]/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            className="text-[#C8A45C] text-xs uppercase tracking-[0.35em] mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {settings.nameAr}
          </motion.p>
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F5F0EB] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Gallery
          </motion.h1>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[#6B5E56] py-20">Gallery coming soon.</p>
        </div>
      </section>
    </div>
  )
}
