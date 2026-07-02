"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedSection from "@/components/ui/AnimatedSection"
import { X } from "lucide-react"
import { business } from "@/data/business"

interface Settings { nameAr: string }

interface GalleryItem {
  id: string
  url: string
  alt: string
  category: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [settings, setSettings] = useState<Settings>({ nameAr: business.nameAr })

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.restaurant_name_ar) setSettings({ nameAr: data.restaurant_name_ar })
    }).catch(() => {})
  }, [])

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const categories = ["all", ...new Set(items.map((i) => i.category))]
  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter)

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
          <motion.p
            className="text-[#9B8B80] mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            A visual journey through our culinary creations and dining experience
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2.5 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                    filter === cat
                      ? "bg-gradient-to-r from-[#C8A45C] to-[#D4B87A] text-[#111111] font-semibold shadow-lg shadow-[#C8A45C]/20"
                      : "bg-white/60 backdrop-blur-sm text-[#6B5E56] hover:text-[#111111] border border-[#E8E0D8]/60 hover:border-[#C8A45C]/30"
                  }`}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </motion.div>
          )}

          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="break-inside-avoid bg-[#E8E0D8] animate-pulse rounded-lg" style={{ height: `${200 + Math.random() * 200}px` }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-[#6B5E56] py-20">No images to display yet.</p>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="break-inside-avoid"
                >
                  <button
                    onClick={() => setLightbox(item.url)}
                    className="relative w-full overflow-hidden group cursor-pointer block"
                  >
                    <div className="relative" style={{ minHeight: "200px" }}>
                      <Image
                        src={item.url}
                        alt={item.alt || "Gallery image"}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                        style={{ display: "block" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="text-white text-sm uppercase tracking-widest">View</div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white z-10"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>
            <motion.img
              src={lightbox}
              alt="Gallery"
              className="max-w-full max-h-[90vh] object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
