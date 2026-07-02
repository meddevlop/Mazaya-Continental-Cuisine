"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import SectionTitle from "@/components/ui/SectionTitle"
import { ArrowRight } from "lucide-react"

interface GalleryPreviewProps {
  images: string[]
}

const fallbackImages = ["", "", "", "", "", ""]

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
}

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  const items = images.length >= 6 ? images : [...images, ...fallbackImages].slice(0, 6)

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
          {items.map((src, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="relative aspect-square overflow-hidden group">
                {src ? (
                  <Image
                    src={src}
                    alt={`Mazaya Gallery ${index + 1}`}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#E8E0D8] to-[#D4C9C0]" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                <div className="absolute inset-0 border border-transparent group-hover:border-[#C8A45C]/30 transition-all duration-500 m-3" />
              </div>
            </motion.div>
          ))}
        </div>

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
      </div>
    </section>
  )
}
