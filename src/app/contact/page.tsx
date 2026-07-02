"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Camera, Clock, Send, Loader2, CheckCircle } from "lucide-react"
import AnimatedSection from "@/components/ui/AnimatedSection"
import Button from "@/components/ui/Button"
import { business } from "@/data/business"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [settings, setSettings] = useState({
    phone: business.phone, email: business.email, address: business.address,
    instagram: business.instagram, nameAr: business.nameAr, hours: business.hours,
  })

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (!data.restaurant_name) return
      setSettings({
        phone: data.phone || business.phone,
        email: data.email || business.email,
        address: data.address || business.address,
        instagram: data.instagram?.replace("https://instagram.com/", "") || business.instagram,
        nameAr: data.restaurant_name_ar || business.nameAr,
        hours: data.opening_hours ? [{ day: "", time: data.opening_hours }] : business.hours,
      })
    }).catch(() => {})
  }, [])

  const contactInfo = [
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Location", value: settings.address, href: "https://maps.app.goo.gl/Czz518iv9vguZKwB7" },
    { icon: Camera, label: "Instagram", value: `@${settings.instagram}`, href: `https://instagram.com/${settings.instagram}` },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus("success"); setForm({ name: "", email: "", phone: "", message: "" })
    } catch { setStatus("error") }
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#111111]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A45C]/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            className="text-[#C8A45C] text-xs uppercase tracking-[0.35em] mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {settings.nameAr}
          </motion.p>
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F5F0EB] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-[#9B8B80] mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Get in touch with us for reservations, inquiries, or any questions
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            <AnimatedSection direction="left">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#111111] mb-10">Get in Touch</h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    target={info.label === "Location" || info.label === "Instagram" ? "_blank" : undefined}
                    rel={info.label === "Location" || info.label === "Instagram" ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-5 p-5 bg-white border border-[#E8E0D8]/60 hover:border-[#C8A45C]/30 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-[#C8A45C]/10 to-[#D4B87A]/5 flex items-center justify-center group-hover:from-[#C8A45C]/20 group-hover:to-[#D4B87A]/10 transition-all duration-300 flex-shrink-0">
                      <info.icon size={22} className="text-[#C8A45C]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E56] mb-0.5">{info.label}</p>
                      <p className="text-[#111111] font-semibold group-hover:text-[#C8A45C] transition-colors truncate">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-10 p-8 bg-[#111111] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#111111]" />
                <div className="relative">
                  <h3 className="text-[#C8A45C] font-serif font-bold text-xl mb-5 flex items-center gap-2">
                    <Clock size={18} /> Opening Hours
                  </h3>
                  <div className="space-y-3">
                    {settings.hours.map((h) => (
                      <div key={h.day} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-[#9B8B80]">{h.day}</span>
                        <span className="text-[#F5F0EB] font-medium">{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.15}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#111111] mb-10">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#6B5E56] mb-2 uppercase tracking-wider">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-5 py-3.5 bg-white border border-[#E8E0D8]/60 text-[#111111] text-sm focus:outline-none focus:border-[#C8A45C] transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#6B5E56] mb-2 uppercase tracking-wider">Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-white border border-[#E8E0D8]/60 text-[#111111] text-sm focus:outline-none focus:border-[#C8A45C] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B5E56] mb-2 uppercase tracking-wider">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-white border border-[#E8E0D8]/60 text-[#111111] text-sm focus:outline-none focus:border-[#C8A45C] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B5E56] mb-2 uppercase tracking-wider">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-5 py-3.5 bg-white border border-[#E8E0D8]/60 text-[#111111] text-sm focus:outline-none focus:border-[#C8A45C] transition-colors resize-none" />
                </div>
                {status === "error" && <p className="text-red-500 text-sm bg-red-50 px-4 py-2">Something went wrong. Please try again.</p>}
                {status === "success" && (
                  <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 px-4 py-3">
                    <CheckCircle size={16} /> Message sent successfully! We&apos;ll get back to you soon.
                  </div>
                )}
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {status === "loading" ? "Sending..." : "Send Message"}
                </Button>
              </form>

              <div className="mt-10">
                <div className="aspect-[16/9] bg-gradient-to-br from-[#E8E0D8] to-[#D4C9C0] flex items-center justify-center border border-[#E8E0D8]/60 relative overflow-hidden">
                  <div className="text-center p-8 relative z-10">
                    <MapPin size={36} className="mx-auto mb-3 text-[#C8A45C]" />
                    <p className="text-[#111111] font-medium">{settings.address}</p>
                    <a
                      href="https://maps.app.goo.gl/Czz518iv9vguZKwB7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8A45C] hover:text-[#D4B87A] text-sm mt-2 inline-block transition-colors underline underline-offset-4"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
