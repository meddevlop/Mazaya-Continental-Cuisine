"use client"

import { motion } from "framer-motion"
import SectionTitle from "@/components/ui/SectionTitle"

export default function GalleryPreview() {
  return (
    <section className="py-24 md:py-32 bg-[#FAFAF8] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/[0.02] to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Gallery"
          titleAr="معرض الصور"
          subtitle="A visual journey through our culinary creations"
        />
        <p className="text-center text-[#6B5E56]">Gallery coming soon.</p>
      </div>
    </section>
  )
}
