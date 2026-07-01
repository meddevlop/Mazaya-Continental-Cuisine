"use client"

import Image from "next/image"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/ui/AnimatedSection"

interface AboutSectionProps {
  image: string
  description: string
}

export default function AboutSection({ image, description }: AboutSectionProps) {
  return (
    <section className="py-20 md:py-28 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div className="relative aspect-[4/3] overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt="Mazaya Continental Cuisine"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-[#2C2420]" />
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <SectionTitle
              title="Our Story"
              titleAr="قصتنا"
              subtitle="Bringing the finest Continental dining experience to Dubai"
              light
              center={false}
            />
            <div className="space-y-4 text-[#D4C9C0] leading-relaxed">
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