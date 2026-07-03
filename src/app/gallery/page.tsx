"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { business } from "@/data/business"

interface Settings { nameAr: string }
interface GalleryImage { id: string; url: string; alt: string; alt_ar?: string; category?: string }

export default function GalleryPage() {
  const [settings, setSettings] = useState<Settings>({ nameAr: business.nameAr })
  const [images, setImages] = useState<GalleryImage[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.restaurant_name_ar) setSettings({ nameAr: data.restaurant_name_ar })
    }).catch(() => {})
    fetch("/api/gallery").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setImages(data)
    }).catch(() => {})
  }, [])

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + images.length) % images.length : null)
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % images.length : null)

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
          {images.length === 0 ? (
            <p className="text-center text-[#6B5E56] py-20">Gallery coming soon.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {images.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <img src={img.url} alt={img.alt || "Gallery"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white z-10" onClick={closeLightbox}>
            <X size={32} />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10" onClick={e => { e.stopPropagation(); prevImage() }}>
            <ChevronLeft size={40} />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10" onClick={e => { e.stopPropagation(); nextImage() }}>
            <ChevronRight size={40} />
          </button>
          <img
            src={images[lightboxIndex].url}
            alt={images[lightboxIndex].alt || "Gallery"}
            className="max-w-full max-h-full object-contain p-4"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
