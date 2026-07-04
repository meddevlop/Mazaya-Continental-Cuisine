"use client"

import { motion } from "framer-motion"
import SectionTitle from "@/components/ui/SectionTitle"

interface OurStorySectionProps {
  image: string
}

export default function OurStorySection({ image }: OurStorySectionProps) {
  if (!image) return null

  return (
    <section className="py-24 md:py-32 bg-[#111111] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#111111]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Story"
          titleAr="قصتنا"
          subtitle="A glimpse into our culinary journey"
          light
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto aspect-[16/9] overflow-hidden rounded-xl"
        >
          <img
            src={image}
            alt="Our Story"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 border border-[#C8A45C]/10 rounded-xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  )
}
