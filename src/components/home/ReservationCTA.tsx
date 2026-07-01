"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"
import AnimatedSection from "@/components/ui/AnimatedSection"
import Button from "@/components/ui/Button"

interface ReservationCTAProps {
  heroImage: string
  phone: string
}

export default function ReservationCTA({ heroImage, phone }: ReservationCTAProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {heroImage ? (
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('${heroImage}')` }} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]" />
      )}
      <div className="absolute inset-0 bg-black/70" />

      <AnimatedSection>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <Calendar size={40} className="text-[#C8A45C] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#F5F0EB] mb-4">
            Reserve Your Table
          </h2>
          <p className="text-lg text-[#D4C9C0] mb-8 max-w-xl mx-auto">
            Experience the finest Continental dining in Dubai. Book your table today and let us
            create an unforgettable evening for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reservations">
              <Button variant="primary" size="lg">
                Make a Reservation
              </Button>
            </Link>
            {phone && (
              <a href={`tel:${phone}`}>
                <Button variant="outline" size="lg">
                  Call {phone}
                </Button>
              </a>
            )}
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}