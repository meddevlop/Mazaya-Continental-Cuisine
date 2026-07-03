"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import SectionTitle from "@/components/ui/SectionTitle"
import { ArrowRight } from "lucide-react"

interface GalleryPreviewProps {
  images: { url: string; alt: string }[]
}

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  return (
    <section className="py-24 md:py-32 bg-[#FAFAF8] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/[0.02] to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Gallery"
          titleAr="معرض الصور"
          subtitle="A visual journey through our culinary creations"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.slice(0, 6).map((img, index) => (
            <motion.div
              key={img.url + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/[0.06]"
            >
              <img src={img.url} alt={img.alt || "Gallery"} className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          ))}
        </div>

        {images.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-[#C8A45C] hover:text-[#D4B87A] font-semibold uppercase tracking-[0.2em] text-xs transition-colors group"
            >
              View Full Gallery
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        )}

        {images.length === 0 && (
          <p className="text-center text-[#6B5E56]">Gallery coming soon.</p>
        )}
      </div>
    </section>
  )
}
