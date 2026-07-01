"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Search, Folder, Upload, Loader2, Image as ImageIcon, X, Check } from "lucide-react"
import { Modal, useToast } from "@/components/admin/ui"

interface PickerItem {
  id: string; url: string; name: string; size: number; folder: string; created_at: string; width: number; height: number
}

interface PickerFolder {
  id: string; name: string; path: string; count: number
}

interface ImagePickerProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  defaultFolder?: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ImagePicker({ open, onClose, onSelect, defaultFolder }: ImagePickerProps) {
  const { toast } = useToast()
  const [items, setItems] = useState<PickerItem[]>([])
  const [folders, setFolders] = useState<PickerFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeFolder, setActiveFolder] = useState<string | null>(defaultFolder || null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [itemsRes, foldersRes] = await Promise.all([
        fetch(`/admin/api/media${activeFolder ? `?folder=${activeFolder}` : ""}`),
        fetch("/admin/api/media?folders=true"),
      ])
      if (!itemsRes.ok || !foldersRes.ok) throw new Error()
      setItems(await itemsRes.json()); setFolders(await foldersRes.json())
    } catch { toast("error", "Failed to load media") }
    finally { setLoading(false) }
  }, [activeFolder, toast])

  useEffect(() => { if (open) fetchData() }, [open, fetchData])

  useEffect(() => { setActiveFolder(defaultFolder || null) }, [defaultFolder])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", activeFolder || "Gallery Images")
      const res = await fetch("/admin/api/media", { method: "POST", body: fd })
      if (!res.ok) throw new Error()
      toast("success", `Uploaded ${file.name}`)
      fetchData()
    } catch { toast("error", "Upload failed") }
    finally { setUploading(false) }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) handleUpload(file)
  }

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Modal open={open} onClose={onClose} title="Select Image from Media Library" size="full">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5E56]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40" />
          </div>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B8933D] cursor-pointer transition-colors touch-manipulation">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Upload New"}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileInput} className="hidden" disabled={uploading} />
          </label>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveFolder(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors touch-manipulation ${!activeFolder ? "bg-[#C8A45C] text-[#1A1A1A]" : "bg-white/5 text-[#6B5E56] hover:bg-white/10"}`}>All</button>
          {folders.map(f => (
            <button key={f.id} onClick={() => setActiveFolder(f.name)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors touch-manipulation ${activeFolder === f.name ? "bg-[#C8A45C] text-[#1A1A1A]" : "bg-white/5 text-[#6B5E56] hover:bg-white/10"}`}>
              <Folder size={12} /> {f.name} <span className="opacity-60">({f.count})</span>
            </button>
          ))}
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-1 ${dragOver ? "ring-2 ring-[#C8A45C] rounded-xl" : ""}`}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon size={32} className="text-[#6B5E56] mb-2" />
              <p className="text-sm text-[#6B5E56]">No images found</p>
            </div>
          ) : (
            filtered.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => { onSelect(item.url); onClose() }}
                type="button"
                className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] hover:border-[#C8A45C]/50 transition-all touch-manipulation text-left"
              >
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-2 rounded-lg bg-[#C8A45C] text-[#1A1A1A]">
                    <Check size={16} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[10px] text-[#D4C9C0] truncate">{item.name}</p>
                  <p className="text-[8px] text-[#6B5E56]">{formatSize(item.size)}</p>
                </div>
              </motion.button>
            ))
          )}
          {uploading && (
            <div className="aspect-square rounded-xl border-2 border-dashed border-[#C8A45C] flex items-center justify-center">
              <Loader2 size={24} className="text-[#C8A45C] animate-spin" />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}