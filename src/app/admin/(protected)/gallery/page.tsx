"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Loader2, Image, Search, Upload, Edit3, X, Check, Library, Eye, EyeOff } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import EmptyState from "@/components/admin/ui/EmptyState"
import LoadingSkeleton from "@/components/admin/ui/LoadingSkeleton"
import ErrorState from "@/components/admin/ui/ErrorState"
import { Modal, ConfirmDialog, Tabs, ImagePicker, useToast } from "@/components/admin/ui"
import { FormField, SelectField } from "@/components/admin/ui/FormField"

interface GalleryItem {
  id: string; url: string; alt: string; alt_ar: string; category: string; is_active: boolean; created_at: string
}

const galleryCategories = ["interior", "food", "events", "exterior", "general"]

export default function GalleryPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true); const [error, setError] = useState("")
  const [search, setSearch] = useState(""); const [categoryTab, setCategoryTab] = useState("all")
  const [uploading, setUploading] = useState(false); const dragRef = useRef<HTMLDivElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null); const [deleting, setDeleting] = useState(false)
  const [editTarget, setEditTarget] = useState<GalleryItem | null>(null); const [editAlt, setEditAlt] = useState(""); const [editAltAr, setEditAltAr] = useState(""); const [editCategory, setEditCategory] = useState("general")
  const [pickerOpen, setPickerOpen] = useState(false); const [pickingForNew, setPickingForNew] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try { const res = await fetch("/admin/api/gallery"); if (!res.ok) throw new Error(); setItems(await res.json()) }
    catch { setError("Failed to load gallery") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append("file", file)
      const uploadRes = await fetch("/admin/api/gallery/upload", { method: "POST", body: fd })
      const { url } = await uploadRes.json()
      if (!url) throw new Error()
      await fetch("/admin/api/gallery", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt: file.name.replace(/\.[^.]+$/, ""), alt_ar: file.name.replace(/\.[^.]+$/, ""), category: "general" }),
      })
      fetchData()
    } catch { toast("error", "Upload failed") }
    finally { setUploading(false) }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) handleUpload(file); e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]; if (file && file.type.startsWith("image/")) handleUpload(file)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try {
      const res = await fetch(`/admin/api/gallery/${deleteTarget.id}?url=${encodeURIComponent(deleteTarget.url)}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setDeleteTarget(null); fetchData()
    } catch { toast("error", "Failed to delete image") }
    finally { setDeleting(false) }
  }

  const handlePickerSelect = async (url: string) => {
    try {
      const res = await fetch("/admin/api/gallery", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt: "", alt_ar: "", category: "general" }),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      handleEdit(created)
      fetchData()
    } catch { toast("error", "Failed to add image") }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditTarget(item); setEditAlt(item.alt); setEditAltAr(item.alt_ar); setEditCategory(item.category)
  }

  const saveEdit = async () => {
    if (!editTarget) return
    try {
      await fetch(`/admin/api/gallery/${editTarget.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: editAlt, alt_ar: editAltAr, category: editCategory }),
      })
      setEditTarget(null); fetchData()
    } catch { toast("error", "Failed to update image") }
  }

  const filtered = items.filter(i => {
    const matchesSearch = i.alt.toLowerCase().includes(search.toLowerCase()) || i.alt_ar.includes(search)
    const matchesCategory = categoryTab === "all" || i.category === categoryTab
    return matchesSearch && matchesCategory
  })

  const tabs = [{ id: "all", label: "All" }, ...galleryCategories.map(c => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))]

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <>
      <PageHeader title="Gallery" description="Manage your restaurant images"
        action={
          <div className="flex gap-2">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B8933D] cursor-pointer transition-colors touch-manipulation">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading..." : "Upload"}
              <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" disabled={uploading} />
            </label>
            <button onClick={() => setPickerOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-[#D4C9C0] text-sm font-semibold hover:bg-white/5 transition-colors touch-manipulation">
              <Library size={16} /> From Library
            </button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5E56]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40" />
        </div>
      </div>

      <Tabs tabs={tabs} active={categoryTab} onChange={setCategoryTab} />

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Image" size="sm">
        <div className="space-y-4">
          {editTarget && <img src={editTarget.url} alt="" className="w-full aspect-video object-cover rounded-lg" />}
          <FormField label="Alt Text (EN)" value={editAlt} onChange={setEditAlt} />
          <FormField label="Alt Text (AR)" value={editAltAr} onChange={setEditAltAr} dir="rtl" />
          <SelectField label="Category" value={editCategory} onChange={setEditCategory} options={galleryCategories.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditTarget(null)} className="px-4 py-2 rounded-lg border border-white/10 text-[#D4C9C0] text-sm">Cancel</button>
            <button onClick={saveEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold"><Check size={14} /> Save</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Image" message="Are you sure? This will permanently remove the image." loading={deleting} />

      {loading ? <LoadingSkeleton className="h-64" /> : filtered.length === 0 ? (
        <EmptyState icon={<Image size={28} />} title="No images" description={search ? "No images match your search" : "Upload your first gallery image"} />
      ) : (
        <>
          <div
            ref={dragRef}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${dragOver ? "ring-2 ring-[#C8A45C] rounded-xl" : ""}`}
          >
            {filtered.map(item => (
              <motion.div key={item.id} layout className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06]">
                <img src={item.url} alt={item.alt} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={async () => { await fetch(`/admin/api/gallery/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !item.is_active }) }); fetchData() }} className={`p-2 rounded-lg transition-colors ${item.is_active ? "bg-green-500/20 hover:bg-green-500/40 text-green-400" : "bg-white/10 hover:bg-white/20 text-white"}`}>{item.is_active ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"><Edit3 size={16} /></button>
                  <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[10px] text-[#D4C9C0] truncate">{item.alt}</p>
                  <span className="text-[8px] text-[#6B5E56] uppercase">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
          {dragOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-[#C8A45C]/10 border-2 border-dashed border-[#C8A45C] rounded-2xl p-8 text-center">
                <Upload size={32} className="text-[#C8A45C] mx-auto mb-2" />
                <p className="text-sm text-[#C8A45C]">Drop image to upload</p>
              </div>
            </div>
          )}
        </>
      )}

      <ImagePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handlePickerSelect} defaultFolder="Gallery Images" />
    </>
  )
}
