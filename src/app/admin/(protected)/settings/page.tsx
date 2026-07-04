"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, Check } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import ErrorState from "@/components/admin/ui/ErrorState"
import { Tabs, ImageUpload, useToast } from "@/components/admin/ui"
import { FormField, TextareaField } from "@/components/admin/ui/FormField"
import type { SettingsData } from "@/services/settings.service"

const settingsTabs = [
  { id: "general", label: "General" },
  { id: "hero", label: "Hero" },
  { id: "homepage", label: "Homepage" },
  { id: "contact", label: "Contact" },
  { id: "social", label: "Social" },
  { id: "hours", label: "Hours" },
  { id: "localization", label: "Localization" },
  { id: "seo", label: "SEO" },
  { id: "footer", label: "Footer" },
]

const defaultSettings: SettingsData = {
  restaurant_name: "Mazaya Continental Cuisine",
  restaurant_name_ar: "مزايا كونتيننتال",
  tagline: "Experience the Finest Continental & Egyptian Cuisine",
  tagline_ar: "تذوق أرقى المأكولات العالمية والمصرية",
  hero_title: "Continental Dining at Its Finest",
  hero_subtitle: "Experience the finest Continental cuisine in an elegant setting",
  phone: "+20 128 234 5667",
  whatsapp_number: "201282345667",
  email: "info@mazayacuisine.com",
  address: "26، Al-Saudia St., Al-Montazah, Sidi Gaber, Alexandria",
  address_ar: "٢٦ ش السعودية، المنتزه، سيدي جابر، الإسكندرية",
  opening_hours: "Mon-Sun: 12:00 PM - 12:00 AM",
  instagram: "https://instagram.com/mazaya_continental",
  facebook: "",
  google_review_url: "",
  currency: "AED",
  locale: "en",
  primary_color: "#C8A45C",
  secondary_color: "#B8933D",
  accent_color: "#D4C9C0",
  dark_mode: true,
  font_heading: "Playfair Display",
  font_body: "Inter",
  footer_copyright: "© 2026 Mazaya Continental Cuisine. All rights reserved.",
  seo_title: "Mazaya Continental Cuisine | Premium Dining in Dubai",
  og_image: "",
  story_image: "",
  about_image: "",
  featured_dish_1_image: "",
  featured_dish_2_image: "",
  featured_dish_3_image: "",
  featured_dish_4_image: "",
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const [saving, setSaving] = useState(false); const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/admin/api/settings?t=${Date.now()}`); if (!res.ok) throw new Error()
      const data = await res.json()
      setSettings({ ...defaultSettings, ...data })
    } catch { setError("Failed to load settings") }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!settings) return
    setSaving(true); setSuccess(false)
    try {
      const res = await fetch("/admin/api/settings", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      setSettings(prev => prev ? { ...prev, ...saved } : prev)
      setSuccess(true); setTimeout(() => setSuccess(false), 3000)
    } catch { toast("error", "Failed to save settings") }
    finally { setSaving(false) }
  }

  const update = (key: keyof SettingsData, value: any) => setSettings(prev => prev ? { ...prev, [key]: value } : prev)

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <>
      <PageHeader title="Settings" description="Complete restaurant management" />

      <Tabs tabs={settingsTabs} active={activeTab} onChange={setActiveTab} />

      <motion.form key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {activeTab === "general" && (
          <Section title="General Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Restaurant Name" value={settings.restaurant_name} onChange={v => update("restaurant_name", v)} required />
              <FormField label="Restaurant Name (AR)" value={settings.restaurant_name_ar ?? ""} onChange={v => update("restaurant_name_ar", v)} dir="rtl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Tagline" value={settings.tagline ?? ""} onChange={v => update("tagline", v)} />
              <FormField label="Tagline (AR)" value={settings.tagline_ar ?? ""} onChange={v => update("tagline_ar", v)} dir="rtl" />
            </div>
            <FormField label="Currency" value={settings.currency ?? "AED"} onChange={v => update("currency", v)} />
          </Section>
        )}

        {activeTab === "hero" && (
          <Section title="Hero Section">
            <FormField label="Hero Title" value={settings.hero_title ?? ""} onChange={v => update("hero_title", v)} placeholder="Continental Dining at Its Finest" />
            <FormField label="Hero Subtitle" value={settings.hero_subtitle ?? ""} onChange={v => update("hero_subtitle", v)} placeholder="Experience the finest Continental cuisine" />
          </Section>
        )}

        {activeTab === "homepage" && (
          <Section title="Homepage Content">
            <FormField label="About Title" value={settings.tagline ?? ""} onChange={v => update("tagline", v)} />
            <TextareaField label="About Description" value={settings.description ?? ""} onChange={v => update("description", v)} placeholder="Welcome text for the homepage..." rows={5} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUpload currentUrl={settings.about_image} onUpload={url => update("about_image", url)} onRemove={() => update("about_image", "")} label="About Section Image" bucket="STORY" />
              <ImageUpload currentUrl={settings.story_image} onUpload={url => update("story_image", url)} onRemove={() => update("story_image", "")} label="Our Story Image" bucket="STORY" />
            </div>
            <div className="border-t border-white/[0.06] pt-5">
              <h4 className="text-[#F5F0EB] font-semibold text-sm mb-4">Featured Dishes Images</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ImageUpload currentUrl={settings.featured_dish_1_image} onUpload={url => update("featured_dish_1_image", url)} onRemove={() => update("featured_dish_1_image", "")} label="Dish 1" bucket="FEATURED" />
                <ImageUpload currentUrl={settings.featured_dish_2_image} onUpload={url => update("featured_dish_2_image", url)} onRemove={() => update("featured_dish_2_image", "")} label="Dish 2" bucket="FEATURED" />
                <ImageUpload currentUrl={settings.featured_dish_3_image} onUpload={url => update("featured_dish_3_image", url)} onRemove={() => update("featured_dish_3_image", "")} label="Dish 3" bucket="FEATURED" />
                <ImageUpload currentUrl={settings.featured_dish_4_image} onUpload={url => update("featured_dish_4_image", url)} onRemove={() => update("featured_dish_4_image", "")} label="Dish 4" bucket="FEATURED" />
              </div>
            </div>
          </Section>
        )}

        {activeTab === "contact" && (
          <Section title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Phone" value={settings.phone ?? ""} onChange={v => update("phone", v)} type="tel" />
              <FormField label="WhatsApp Number" value={settings.whatsapp_number ?? ""} onChange={v => update("whatsapp_number", v)} type="tel" />
            </div>
            <FormField label="Email" value={settings.email ?? ""} onChange={v => update("email", v)} type="email" />
            <TextareaField label="Address" value={settings.address ?? ""} onChange={v => update("address", v)} />
            <TextareaField label="Address (AR)" value={settings.address_ar ?? ""} onChange={v => update("address_ar", v)} dir="rtl" />
          </Section>
        )}

        {activeTab === "social" && (
          <Section title="Social Media Links">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Instagram URL" value={settings.instagram ?? ""} onChange={v => update("instagram", v)} type="url" />
              <FormField label="Facebook URL" value={settings.facebook ?? ""} onChange={v => update("facebook", v)} type="url" />
            </div>
            <FormField label="Google Maps Review URL" value={settings.google_review_url ?? ""} onChange={v => update("google_review_url", v)} type="url" />
          </Section>
        )}

        {activeTab === "hours" && (
          <Section title="Opening Hours">
            <FormField label="Opening Hours Text" value={settings.opening_hours ?? ""} onChange={v => update("opening_hours", v)} placeholder="Mon-Sun: 12:00 PM - 12:00 AM" />
          </Section>
        )}

        {activeTab === "localization" && (
          <Section title="Localization">
            <FormField label="Default Locale" value={settings.locale ?? "en"} onChange={v => update("locale", v)} placeholder="en" />
            <p className="text-xs text-[#6B5E56]">Set to &quot;en&quot; for English or &quot;ar&quot; for Arabic. Dynamic language switching requires additional implementation.</p>
          </Section>
        )}

        {activeTab === "seo" && (
          <Section title="SEO Settings">
            <FormField label="Meta Title" value={settings.seo_title ?? ""} onChange={v => update("seo_title", v)} placeholder="Mazaya Continental Cuisine | Premium Dining" />
            <TextareaField label="Meta Description" value={settings.description ?? ""} onChange={v => update("description", v)} placeholder="Brief description for search engines..." rows={3} />
          </Section>
        )}

        {activeTab === "footer" && (
          <Section title="Footer">
            <FormField label="Copyright Text" value={settings.footer_copyright ?? ""} onChange={v => update("footer_copyright", v)} placeholder="© 2026 Mazaya Continental Cuisine. All rights reserved." />
            <TextareaField label="Address Display" value={settings.address ?? ""} onChange={v => update("address", v)} />
            <FormField label="Opening Hours Display" value={settings.opening_hours ?? ""} onChange={v => update("opening_hours", v)} />
          </Section>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#C8A45C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#B8933D] disabled:opacity-50 transition-colors">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {success && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-sm text-green-400"><Check size={14} /> Settings saved!</motion.span>}
        </div>
      </motion.form>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-6 space-y-5">
      <h3 className="text-[#F5F0EB] font-semibold text-sm">{title}</h3>
      {children}
    </div>
  )
}
