"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit3, Trash2, Search, X, Loader2, UtensilsCrossed, Star, Eye, EyeOff, Filter } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import EmptyState from "@/components/admin/ui/EmptyState"
import ErrorState from "@/components/admin/ui/ErrorState"
import { Modal, ConfirmDialog, Pagination, Badge, useToast } from "@/components/admin/ui"
import { FormField, TextareaField, SelectField, ToggleField } from "@/components/admin/ui/FormField"

interface MenuItem {
  id: string; name: string; name_ar: string; description: string; description_ar: string
  price: number; category_id: string; category_name?: string
  is_featured: boolean; is_available: boolean; sort_order: number; is_popular?: boolean
}

interface Category { id: string; name: string; name_ar: string }

const emptyForm = { name: "", name_ar: "", description: "", description_ar: "", price: "", category_id: "", is_featured: false, is_popular: false, is_available: true, sort_order: "0" }

export default function MenuPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState("")
  const [search, setSearch] = useState(""); const [categoryFilter, setCategoryFilter] = useState("all"); const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all")
  const [page, setPage] = useState(1); const pageSize = 10
  const [showForm, setShowForm] = useState(false); const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm); const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null); const [deleting, setDeleting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [validation, setValidation] = useState<Record<string, string>>({})

  const fetchData = useCallback(async () => {
    try {
      const [menuRes, catRes] = await Promise.all([fetch("/admin/api/menu"), fetch("/admin/api/categories")])
      if (!menuRes.ok || !catRes.ok) throw new Error()
      setItems(await menuRes.json()); setCategories(await catRes.json())
    } catch { setError("Failed to load menu items") }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "Name is required"
    if (!form.name_ar.trim()) errs.name_ar = "Arabic name is required"
    if (!form.price || parseFloat(form.price) <= 0) errs.price = "Valid price required"
    if (!form.category_id) errs.category_id = "Category required"
    setValidation(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    const body = { ...form, price: parseFloat(form.price), sort_order: parseInt(form.sort_order) || 0 }
    try {
      const res = await fetch(`/admin/api/menu${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setShowForm(false); setEditingId(null); setForm(emptyForm); setValidation({}); fetchData()
    } catch { toast("error", "Failed to save menu item") }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch(`/admin/api/menu/${deleteTarget.id}`, { method: "DELETE" })
      setDeleteTarget(null); fetchData()
    } catch { toast("error", "Failed to delete menu item") }
    finally { setDeleting(false) }
  }

  const handleEdit = (item: MenuItem) => {
    setForm({
      name: item.name, name_ar: item.name_ar, description: item.description, description_ar: item.description_ar,
      price: String(item.price), category_id: item.category_id,
      is_featured: item.is_featured, is_popular: item.is_popular ?? false, is_available: item.is_available, sort_order: String(item.sort_order),
    })
    setEditingId(item.id); setShowForm(true); setValidation({})
  }

  const filtered = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.name_ar.includes(search)
    const matchesCategory = categoryFilter === "all" || i.category_id === categoryFilter
    const matchesAvailability = availabilityFilter === "all" || (availabilityFilter === "available" ? i.is_available : !i.is_available)
    return matchesSearch && matchesCategory && matchesAvailability
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <>
      <PageHeader title={`Menu Items (${items.length})`} description={`Manage your restaurant menu — ${items.length} items across ${categories.length} categories`}
        action={
          <button onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B8933D] transition-colors">
            <Plus size={16} /> Add Menu Item
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5E56]" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search menu items..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${showFilters ? "bg-[#C8A45C]/10 border-[#C8A45C]/30 text-[#C8A45C]" : "bg-white/5 border-white/10 text-[#6B5E56] hover:text-[#D4C9C0]"}`}>
          <Filter size={16} /> Filters
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-[#6B5E56] font-medium uppercase tracking-wider">Category</span>
                <div className="flex gap-1.5 flex-wrap">
                  {[{ id: "all", name: "All" }, ...categories].map(c => {
                    const count = c.id === "all" ? items.length : items.filter(i => i.category_id === c.id).length
                    return (
                      <button key={c.id} onClick={() => { setCategoryFilter(c.id); setPage(1) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${categoryFilter === c.id ? "bg-[#C8A45C] text-[#1A1A1A]" : "bg-white/5 text-[#6B5E56] hover:bg-white/10"}`}>{c.name} ({count})</button>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-[#6B5E56] font-medium uppercase tracking-wider">Availability</span>
                <div className="flex gap-1.5">
                  {(["all", "available", "unavailable"] as const).map(a => (
                    <button key={a} onClick={() => { setAvailabilityFilter(a); setPage(1) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${availabilityFilter === a ? "bg-[#C8A45C] text-[#1A1A1A]" : "bg-white/5 text-[#6B5E56] hover:bg-white/10"}`}>{a}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={showForm} onClose={() => { setShowForm(false); setValidation({}) }} title={editingId ? "Edit Menu Item" : "Add Menu Item"} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name (EN)" value={form.name} onChange={v => setForm({ ...form, name: v })} required placeholder="Grilled Salmon" error={validation.name} />
            <FormField label="Name (AR)" value={form.name_ar} onChange={v => setForm({ ...form, name_ar: v })} required placeholder="سمك السلمون المشوي" dir="rtl" error={validation.name_ar} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextareaField label="Description (EN)" value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="Fresh Atlantic salmon with lemon butter sauce..." />
            <TextareaField label="Description (AR)" value={form.description_ar} onChange={v => setForm({ ...form, description_ar: v })} placeholder="سمك السلمون الأطلسي الطازج مع صلصة الزبدة والليمون..." dir="rtl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Price (AED)" value={form.price} onChange={v => setForm({ ...form, price: v })} type="number" required placeholder="0.00" error={validation.price} />
            <SelectField label="Category" value={form.category_id} onChange={v => setForm({ ...form, category_id: v })} options={categories.map(c => ({ value: c.id, label: c.name }))} placeholder="Select category" required />
            <FormField label="Sort Order" value={form.sort_order} onChange={v => setForm({ ...form, sort_order: v })} type="number" placeholder="0" />
          </div>
          <div className="flex gap-6">
            <ToggleField label="Featured" checked={form.is_featured} onChange={v => setForm({ ...form, is_featured: v })} />
            <ToggleField label="Popular" checked={form.is_popular ?? false} onChange={v => setForm({ ...form, is_popular: v })} />
            <ToggleField label="Available" checked={form.is_available} onChange={v => setForm({ ...form, is_available: v })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowForm(false); setValidation({}) }} className="px-4 py-2.5 rounded-lg border border-white/10 text-[#D4C9C0] text-sm hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B8933D] disabled:opacity-50">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editingId ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Menu Item" message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} loading={deleting} />

      {paginated.length === 0 ? (
        <EmptyState icon={<UtensilsCrossed size={28} />} title="No menu items" description={search || categoryFilter !== "all" ? "No items match your filters" : "Add your first menu item"} />
      ) : (
        <>
          <div className="grid gap-3">
            {paginated.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] hover:border-white/[0.1] transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[#F5F0EB] font-medium truncate">{item.name}</h4>
                    {item.is_featured && <Badge variant="gold">Featured</Badge>}
                    {item.is_popular && <Badge variant="yellow"><Star size={10} /> Popular</Badge>}
                    {item.is_available ? <Badge variant="green">Available</Badge> : <Badge variant="red">Unavailable</Badge>}
                  </div>
                  <p className="text-xs text-[#6B5E56] mt-0.5">{item.name_ar} · {item.category_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#C8A45C] font-semibold text-sm">{item.price.toLocaleString()} AED</span>
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-[#6B5E56] hover:text-[#C8A45C] hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"><Edit3 size={15} /></button>
                  <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg text-[#6B5E56] hover:text-red-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          <Pagination current={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
        </>
      )}
    </>
  )
}
