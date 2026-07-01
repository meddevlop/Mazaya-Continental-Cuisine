"use client"

import { useState, useEffect } from "react"
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
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C8A45C] text-sm uppercase tracking-[0.3em] mb-2">{settings.nameAr}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F0EB]">
            Contact Us
          </h1>
          <p className="text-[#D4C9C0] mt-4 max-w-2xl mx-auto">
            Get in touch with us for reservations, inquiries, or any questions
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <h2 className="text-2xl font-serif font-bold text-[#2C2420] mb-8">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    target={info.label === "Location" || info.label === "Instagram" ? "_blank" : undefined}
                    rel={info.label === "Location" || info.label === "Instagram" ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 bg-white border border-[#E8E0D8] hover:border-[#C8A45C] transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#C8A45C]/10 flex items-center justify-center group-hover:bg-[#C8A45C]/20 transition-colors">
                      <info.icon size={20} className="text-[#C8A45C]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#6B5E56]">{info.label}</p>
                      <p className="text-[#2C2420] font-semibold group-hover:text-[#C8A45C] transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8 p-6 bg-[#1A1A1A]">
                <h3 className="text-[#C8A45C] font-serif font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock size={18} /> Opening Hours
                </h3>
                <div className="space-y-2">
                  {settings.hours.map((h) => (
                    <div key={h.day} className="flex justify-between text-sm">
                      <span className="text-[#D4C9C0]">{h.day}</span>
                      <span className="text-[#F5F0EB] font-medium">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="text-2xl font-serif font-bold text-[#2C2420] mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="bg-white border border-[#E8E0D8] p-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B5E56] mb-1">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 border border-[#E8E0D8] text-[#2C2420] text-sm focus:outline-none focus:border-[#C8A45C]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6B5E56] mb-1">Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2.5 border border-[#E8E0D8] text-[#2C2420] text-sm focus:outline-none focus:border-[#C8A45C]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B5E56] mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-2.5 border border-[#E8E0D8] text-[#2C2420] text-sm focus:outline-none focus:border-[#C8A45C]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B5E56] mb-1">Message *</label>
                  <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="w-full px-4 py-2.5 border border-[#E8E0D8] text-[#2C2420] text-sm focus:outline-none focus:border-[#C8A45C] resize-none" />
                </div>
                {status === "error" && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
                {status === "success" && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle size={16} /> Message sent successfully! We&apos;ll get back to you soon.
                  </div>
                )}
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {status === "loading" ? "Sending..." : "Send Message"}
                </Button>
              </form>

              <div className="mt-8">
                <div className="aspect-[16/9] bg-[#E8E0D8] flex items-center justify-center text-[#D4C9C0] text-sm border border-[#E8E0D8]">
                  <div className="text-center p-8">
                    <MapPin size={32} className="mx-auto mb-2 text-[#C8A45C]" />
                    <p>{settings.address}</p>
                    <a
                      href="https://maps.app.goo.gl/Czz518iv9vguZKwB7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8A45C] hover:underline text-sm mt-2 inline-block"
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
