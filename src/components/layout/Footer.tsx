"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Camera, Clock, ArrowUpRight } from "lucide-react"
import { business } from "@/data/business"

export default function Footer() {
  const [settings, setSettings] = useState({
    name: business.name, tagline: business.tagline, rating: business.rating,
    phone: business.phone, email: business.email, address: business.address,
    instagram: business.instagram, hours: business.hours, nameAr: business.nameAr, taglineAr: business.taglineAr,
  })

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (!data.restaurant_name) return
      setSettings({
        name: data.restaurant_name || business.name,
        tagline: data.tagline || business.tagline,
        rating: business.rating,
        phone: data.phone || business.phone,
        email: data.email || business.email,
        address: data.address || business.address,
        instagram: (data.instagram || "").replace("https://instagram.com/", "") || business.instagram,
        hours: data.opening_hours ? [{ day: "", time: data.opening_hours }] : business.hours,
        nameAr: data.restaurant_name_ar || business.nameAr,
        taglineAr: data.tagline_ar || business.taglineAr,
      })
    }).catch(() => {})
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <footer className="bg-[#111111] text-[#F5F0EB] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#111111] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A45C]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[#C8A45C] font-serif text-3xl font-bold mb-4">{settings.name}</h3>
            <p className="text-[#9B8B80] text-sm leading-relaxed mb-6">{settings.tagline}</p>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-[#C8A45C] text-lg">★</span>
                ))}
              </div>
              <span className="text-[#C8A45C] font-bold">{settings.rating}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-bold text-xs uppercase tracking-[0.25em] mb-6 text-[#C8A45C]">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Menu", href: "/menu" },
                { label: "Gallery", href: "/gallery" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Reserve a Table", href: "/reservations", gold: true },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-1.5 text-sm transition-colors duration-300 group ${
                    link.gold
                      ? "text-[#C8A45C] hover:text-[#D4B87A]"
                      : "text-[#9B8B80] hover:text-[#D4C9C0]"
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={12} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-bold text-xs uppercase tracking-[0.25em] mb-6 text-[#C8A45C]">Contact</h4>
            <div className="space-y-4">
              {[
                { icon: Phone, value: settings.phone, href: `tel:${settings.phone}` },
                { icon: Mail, value: settings.email, href: `mailto:${settings.email}` },
                { icon: MapPin, value: settings.address },
                { icon: Camera, value: `@${settings.instagram}`, href: `https://instagram.com/${settings.instagram}` },
              ].map((item, i) => (
                <div key={i}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-3 text-sm text-[#9B8B80] hover:text-[#C8A45C] transition-colors duration-300 group"
                    >
                      <item.icon size={14} className="mt-0.5 text-[#C8A45C] flex-shrink-0" />
                      <span>{item.value}</span>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 text-sm text-[#9B8B80]">
                      <item.icon size={14} className="mt-0.5 text-[#C8A45C] flex-shrink-0" />
                      <span>{item.value}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-bold text-xs uppercase tracking-[0.25em] mb-6 text-[#C8A45C]">Opening Hours</h4>
            <div className="space-y-3">
              {settings.hours.length > 0 ? (
                settings.hours.map((h) => (
                  <div key={h.day} className="flex items-start gap-3 text-sm">
                    <Clock size={14} className="mt-0.5 text-[#C8A45C] flex-shrink-0" />
                    <div>
                      {h.day && <p className="text-[#9B8B80]">{h.day}</p>}
                      <p className="text-[#F5F0EB] font-medium">{h.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 text-sm">
                  <Clock size={14} className="mt-0.5 text-[#C8A45C] flex-shrink-0" />
                  <div>
                    <p className="text-[#F5F0EB] font-medium">Contact for hours</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h4 className="font-bold text-xs uppercase tracking-[0.25em] mb-4 text-[#C8A45C]">Follow Us</h4>
              <div className="flex gap-3">
                {[
                  { icon: Camera, href: `https://instagram.com/${settings.instagram}`, label: "Instagram" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#9B8B80] hover:text-[#C8A45C] hover:border-[#C8A45C]/30 transition-all duration-300"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6B5E56] text-xs tracking-wide">
            &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <p className="text-[#6B5E56] text-xs tracking-wide">
            {settings.nameAr} &mdash; {settings.taglineAr}
          </p>
          <button
            onClick={scrollToTop}
            className="text-[#6B5E56] hover:text-[#C8A45C] text-xs tracking-wider uppercase transition-colors duration-300"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  )
}
