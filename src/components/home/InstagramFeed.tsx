"use client"

import { Camera } from "lucide-react"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/ui/AnimatedSection"

interface InstagramFeedProps {
  instagram: string
}

export default function InstagramFeed({ instagram }: InstagramFeedProps) {
  return (
    <section className="py-20 md:py-28 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Follow Us"
          titleAr="تابعنا"
          subtitle="Stay connected with us on Instagram"
          light
        />

        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center">
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-[#F5F0EB] hover:text-[#C8A45C] transition-colors mb-8"
            >
              <Camera size={32} />
              <span className="text-2xl font-semibold">@{instagram}</span>
            </a>

            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-[#2C2420] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#2C2420] to-[#3D322C] flex items-center justify-center">
                    <Camera size={24} className="text-[#C8A45C]/30" />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[#D4C9C0] text-sm">
              Tag us in your photos for a chance to be featured!
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}