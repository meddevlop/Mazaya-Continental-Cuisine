"use client"

import Link from "next/link"
import Image from "next/image"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/ui/AnimatedSection"
import { ArrowRight } from "lucide-react"

interface GalleryPreviewProps {
  images: string[]
}

const fallbackImages = ["", "", "", "", "", ""]

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  const items = images.length >= 6 ? images : [...images, ...fallbackImages].slice(0, 6)

  return (
    <section className="py-20 md:py-28 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Gallery"
          titleAr="معرض الصور"
          subtitle="A visual journey through our culinary creations"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {items.map((src, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <div className="relative aspect-square overflow-hidden">
                {src ? (
                  <Image
                    src={src}
                    alt={`Mazaya Gallery ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#E8E0D8]" />
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-[#C8A45C] hover:text-[#B8933D] font-semibold uppercase tracking-wider text-sm transition-colors"
          >
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}