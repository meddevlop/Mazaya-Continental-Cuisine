"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit3, Trash2, Loader2, FolderTree, GripVertical, Eye, EyeOff, Palette } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import EmptyState from "@/components/admin/ui/EmptyState"
import ErrorState from "@/components/admin/ui/ErrorState"
import { Modal, ConfirmDialog, ColorPicker, useToast } from "@/components/admin/ui"
import { FormField, ToggleField } from "@/components/admin/ui/FormField"

interface Category {
  id: string; name: string; name_ar: string; slug: string; color: string; icon: string
  sort_order: number; is_active: boolean; item_count?: number
}

const ICONS = ["FolderTree", "UtensilsCrossed", "Coffee", "Wine", "IceCream", "CakeSlice", "Beef", "Fish", "Salad", "Soup", "Pizza", "Sandwich"] as const

const defaultIcon = "FolderTree"

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false); const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", name_ar: "", slug: "", color: "#C8A45C", icon: defaultIcon, sort_order: "0", is_active: true })
  const [saving, setSaving] = useState(false); const [validation, setValidation] = useState<Record<string, string>>({}); const [deleteTarget, setDeleteTarget] = useState<Category | null>(null); const [deleting, setDeleting] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const dragOverIdx = useRef<number | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/admin/api/categories")
      if (!res.ok) throw new Error()
      setCategories(await res.json())
    } catch { setError("Failed to load categories") }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "Name is required"
    if (!form.name_ar.trim()) errs.name_ar = "Arabic name is required"
    if (!form.slug.trim()) errs.slug = "Slug is required"
    if (form.slug.trim() && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug.trim())) errs.slug = "Slug must be lowercase with hyphens only"
    if (form.sort_order && (isNaN(parseInt(form.sort_order)) || parseInt(form.sort_order) < 0)) errs.sort_order = "Must be a positive number"
    setValidation(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!validate()) return; setSaving(true)
    const body = { ...form, sort_order: parseInt(form.sort_order) || 0 }
    try {
      const res = await fetch(`/admin/api/categories${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setShowForm(false); setEditingId(null); setForm({ name: "", name_ar: "", slug: "", color: "#C8A45C", icon: defaultIcon, sort_order: "0", is_active: true }); setValidation({}); fetchData()
    } catch { toast("error", "Failed to save category") }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try { await fetch(`/admin/api/categories/${deleteTarget.id}`, { method: "DELETE" }); setDeleteTarget(null); fetchData() }
    catch { toast("error", "Failed to delete category") }
    finally { setDeleting(false) }
  }

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, name_ar: cat.name_ar, slug: cat.slug, color: cat.color || "#C8A45C", icon: cat.icon || defaultIcon, sort_order: String(cat.sort_order), is_active: cat.is_active })
    setEditingId(cat.id); setShowForm(true)
  }

  const handleDragStart = (idx: number) => { setDragIdx(idx) }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault(); dragOverIdx.current = idx
  }

  const handleDrop = async () => {
    if (dragIdx === null || dragOverIdx.current === null || dragIdx === dragOverIdx.current) { setDragIdx(null); return }
    const reordered = [...sorted]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(dragOverIdx.current, 0, moved)
    const updated = reordered.map((cat, i) => ({ ...cat, sort_order: i }))
    setCategories(updated)
    setDragIdx(null)
    try {
      await fetch("/admin/api/categories/reorder", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: updated.map(c => c.id) }),
      })
    } catch { /* silent fallback */ }
  }

  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order)

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <>
      <PageHeader title="Categories" description="Organize your menu categories"
        action={
          <button onClick={() => { setForm({ name: "", name_ar: "", slug: "", color: "#C8A45C", icon: defaultIcon, sort_order: "0", is_active: true }); setEditingId(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B8933D]">
            <Plus size={16} /> Add Category
          </button>
        }
      />

      <Modal open={showForm} onClose={() => { setShowForm(false); setValidation({}) }} title={editingId ? "Edit Category" : "New Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name (EN)" value={form.name} onChange={v => setForm({ ...form, name: v, slug: editingId ? form.slug : generateSlug(v) })} required error={validation.name} />
            <FormField label="Name (AR)" value={form.name_ar} onChange={v => setForm({ ...form, name_ar: v })} required dir="rtl" />
          </div>
          <FormField label="Slug" value={form.slug} onChange={v => setForm({ ...form, slug: v })} required error={validation.slug} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker label="Color" value={form.color} onChange={v => setForm({ ...form, color: v })} />
            <FormField label="Sort Order" value={form.sort_order} onChange={v => setForm({ ...form, sort_order: v })} type="number" />
          </div>
          <div>
            <label className="block text-xs text-[#D4C9C0] mb-1.5">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map(icon => (
                <button key={icon} type="button" onClick={() => setForm({ ...form, icon })} className={`p-2 rounded-lg border text-xs transition-all ${form.icon === icon ? "border-[#C8A45C] bg-[#C8A45C]/10 text-[#C8A45C]" : "border-white/10 text-[#6B5E56] hover:border-white/20"}`}>{icon.replace(/([A-Z])/g, " $1").trim().slice(0, 8)}</button>
              ))}
            </div>
          </div>
          <ToggleField label="Active (visible on menu)" checked={form.is_active} onChange={v => setForm({ ...form, is_active: v })} />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-lg border border-white/10 text-[#D4C9C0] text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold disabled:opacity-50">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Category" message={`Delete "${deleteTarget?.name}"? Items in this category will remain but will be uncategorized.`} loading={deleting} />

      {sorted.length === 0 ? (
        <EmptyState icon={<FolderTree size={28} />} title="No categories" description="Create your first menu category" />
      ) : (
        <div className="space-y-2">
          {sorted.map((cat, idx) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              draggable onDragStart={() => handleDragStart(idx)} onDragOver={e => handleDragOver(e, idx)} onDrop={handleDrop}
              className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border ${dragIdx === idx ? "border-[#C8A45C] opacity-50" : "border-white/[0.06]"} hover:border-white/[0.1] transition-colors group`}>
              <GripVertical size={16} className="text-[#6B5E56] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab flex-shrink-0" />
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cat.color + "20" }}>
                <Palette size={16} style={{ color: cat.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[#F5F0EB] font-medium">{cat.name}</h4>
                  {!cat.is_active && <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-[#6B5E56]">Hidden</span>}
                </div>
                <p className="text-xs text-[#6B5E56]">{cat.name_ar} · {cat.slug} · {cat.item_count ?? 0} items</p>
              </div>
              <button onClick={() => handleEdit(cat)} className="p-2 rounded-lg text-[#6B5E56] hover:text-[#C8A45C] hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"><Edit3 size={15} /></button>
              <button onClick={() => setDeleteTarget(cat)} className="p-2 rounded-lg text-[#6B5E56] hover:text-red-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={15} /></button>
            </motion.div>
          ))}
        </div>
      )}
    </>
  )
}
