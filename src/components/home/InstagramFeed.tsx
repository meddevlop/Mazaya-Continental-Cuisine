"use client"

import { motion } from "framer-motion"
import { Camera } from "lucide-react"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/ui/AnimatedSection"

interface InstagramFeedProps {
  instagram: string
}

export default function InstagramFeed({ instagram }: InstagramFeedProps) {
  return (
    <section className="py-24 md:py-32 bg-[#111111] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#111111]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Follow Us"
          titleAr="تابعنا"
          subtitle="Stay connected with us on Instagram"
          light
        />

        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <motion.a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-[#F5F0EB] hover:text-[#C8A45C] transition-colors mb-12 group"
              whileHover={{ scale: 1.02 }}
            >
              <Camera size={28} className="text-[#C8A45C]" />
              <span className="text-2xl md:text-3xl font-serif font-bold">@{instagram}</span>
            </motion.a>

            <div className="grid grid-cols-3 gap-3 md:gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="aspect-square overflow-hidden group"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-[#2C2420] to-[#3D322C] flex items-center justify-center relative">
                    <div className="absolute inset-0 shimmer" />
                    <Camera size={28} className="text-[#C8A45C]/20 group-hover:text-[#C8A45C]/40 transition-colors duration-500" />
                    <div className="absolute inset-0 border border-transparent group-hover:border-[#C8A45C]/20 transition-all duration-500 m-2" />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="mt-8 text-[#6B5E56] text-sm tracking-wide"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Tag us in your photos for a chance to be featured
            </motion.p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
