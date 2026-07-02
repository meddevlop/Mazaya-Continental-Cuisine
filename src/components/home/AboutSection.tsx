"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/ui/AnimatedSection"
import { Quote } from "lucide-react"

interface AboutSectionProps {
  image: string
  description: string
}

export default function AboutSection({ image, description }: AboutSectionProps) {
  return (
    <section className="py-24 md:py-32 bg-[#111111] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#111111]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#C8A45C]/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <AnimatedSection direction="left">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt="Mazaya Continental Cuisine"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2C2420] to-[#1A1A1A]" />
                )}
                <div className="absolute inset-0 border border-[#C8A45C]/10" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#C8A45C]/20 hidden lg:block" />
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.15}>
            <div className="relative">
              <Quote size={40} className="text-[#C8A45C]/20 absolute -top-4 -left-2" />
              <SectionTitle
                title="Our Story"
                titleAr="قصتنا"
                subtitle="Bringing the finest Continental dining experience"
                light
                center={false}
              />
            </div>
            <div className="space-y-5 text-[#9B8B80] leading-relaxed text-sm md:text-base">
              {description ? (
                description.split("\n").map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <>
                  <p>
                    At Mazaya Continental Cuisine, we believe that dining is more than just food — it is an experience
                    that engages all the senses. Our passionate chefs blend traditional Middle Eastern flavors with
                    contemporary Continental techniques to create dishes that are both familiar and extraordinary.
                  </p>
                  <p>
                    Nestled in the heart of Dubai, we pride ourselves on using only the freshest ingredients,
                    premium Australian lamb, and authentic spices to craft every dish with care and precision.
                    From our signature mixed grills to our aromatic mansaf, every plate tells a story of
                    culinary excellence.
                  </p>
                  <p>
                    Whether you are joining us for a family gathering, a romantic dinner, or a celebration with
                    friends, Mazaya promises an unforgettable dining journey.
                  </p>
                </>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
