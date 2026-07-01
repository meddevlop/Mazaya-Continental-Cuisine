"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import AnimatedSection from "@/components/ui/AnimatedSection"
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
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C8A45C] text-sm uppercase tracking-[0.3em] mb-2">{settings.nameAr}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F0EB]">
            Gallery
          </h1>
          <p className="text-[#D4C9C0] mt-4 max-w-2xl mx-auto">
            A visual journey through our culinary creations and dining experience
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 text-sm uppercase tracking-wider rounded-full transition-colors ${
                    filter === cat
                      ? "bg-[#C8A45C] text-[#1A1A1A] font-semibold"
                      : "bg-white text-[#6B5E56] hover:bg-[#E8E0D8]"
                  }`}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-[#E8E0D8] animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-[#6B5E56] py-20">No images to display yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filtered.map((item) => (
                <AnimatedSection key={item.id} delay={0}>
                  <div className="relative aspect-square overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-[#E8E0D8] flex items-center justify-center">
                      <Image
                        src={item.url}
                        alt={item.alt || "Gallery image"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
