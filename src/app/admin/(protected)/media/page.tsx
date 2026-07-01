"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Image, Search, Folder, Trash2, Copy, Check, Upload, Loader2, Edit3 } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import EmptyState from "@/components/admin/ui/EmptyState"
import LoadingSkeleton from "@/components/admin/ui/LoadingSkeleton"
import ErrorState from "@/components/admin/ui/ErrorState"
import { ConfirmDialog, Modal, useToast } from "@/components/admin/ui"
import { FormField } from "@/components/admin/ui/FormField"

interface MediaItem {
  id: string; url: string; name: string; size: number; type: string; folder: string; created_at: string; width: number; height: number
}

interface MediaFolder {
  id: string; name: string; path: string; count: number
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<MediaItem[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [loading, setLoading] = useState(true); const [error, setError] = useState("")
  const [search, setSearch] = useState(""); const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null); const [deleting, setDeleting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [renameTarget, setRenameTarget] = useState<MediaItem | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [renaming, setRenaming] = useState(false)
  const [progress, setProgress] = useState(0)
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
    } catch { setError("Failed to load media") }
    finally { setLoading(false) }
  }, [activeFolder])

  useEffect(() => { fetchData() }, [fetchData])

  const handleUpload = async (file: File) => {
    setUploading(true); setProgress(0)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", activeFolder || "Other")
      const timer = setInterval(() => setProgress(p => Math.min(p + 20, 90)), 300)
      const res = await fetch("/admin/api/media", { method: "POST", body: fd })
      clearInterval(timer); setProgress(100)
      if (!res.ok) throw new Error()
      toast("success", `Uploaded ${file.name}`)
      fetchData()
    } catch { toast("error", "Upload failed") }
    finally { setTimeout(() => { setUploading(false); setProgress(0) }, 500) }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) { toast("error", "Please select a file to upload"); return }
    if (!file.type.startsWith("image/")) { toast("error", "Only image files are allowed (PNG, JPG, WebP)"); e.target.value = ""; return }
    handleUpload(file)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) { toast("error", "No file detected"); return }
    if (!file.type.startsWith("image/")) { toast("error", "Only image files are allowed (PNG, JPG, WebP)"); return }
    handleUpload(file)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try {
      await fetch(`/admin/api/media?id=${deleteTarget.id}`, { method: "DELETE" })
      setDeleteTarget(null)
      if (selectedItem?.id === deleteTarget.id) setSelectedItem(null)
      toast("success", "File deleted")
      fetchData()
    } catch { toast("error", "Failed to delete") }
    finally { setDeleting(false) }
  }

  const handleRename = async () => {
    if (!renameTarget || !renameValue.trim()) return; setRenaming(true)
    try {
      await fetch(`/admin/api/media?id=${renameTarget.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue.trim() }),
      })
      setRenameTarget(null); toast("success", "File renamed"); fetchData()
    } catch { toast("error", "Failed to rename") }
    finally { setRenaming(false) }
  }

  const copyUrl = async (url: string, id: string) => {
    try { await navigator.clipboard.writeText(url); setCopiedId(id); toast("success", "URL copied"); setTimeout(() => setCopiedId(null), 2000) } catch { toast("error", "Failed to copy") }
  }

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Manage your uploaded images"
        action={
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B8933D] cursor-pointer transition-colors touch-manipulation">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Upload"}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileInput} className="hidden" disabled={uploading} />
          </label>
        }
      />

      {uploading && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#D4C9C0]">Uploading...</span>
            <span className="text-xs text-[#C8A45C]">{progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-[#C8A45C] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5E56]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40" />
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setActiveFolder(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors touch-manipulation ${!activeFolder ? "bg-[#C8A45C] text-[#1A1A1A]" : "bg-white/5 text-[#6B5E56] hover:bg-white/10"}`}>All Files</button>
        {folders.map(f => (
          <button key={f.id} onClick={() => setActiveFolder(f.name)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors touch-manipulation ${activeFolder === f.name ? "bg-[#C8A45C] text-[#1A1A1A]" : "bg-white/5 text-[#6B5E56] hover:bg-white/10"}`}>
            <Folder size={12} /> {f.name} <span className="opacity-60">({f.count})</span>
          </button>
        ))}
      </div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete File" message="Are you sure? This will permanently remove the file." loading={deleting} />

      <Modal open={!!renameTarget} onClose={() => setRenameTarget(null)} title="Rename File" size="sm">
        <div className="space-y-4">
          <FormField label="New name" value={renameValue} onChange={setRenameValue} placeholder="Enter new file name" />
          <div className="flex justify-end gap-3">
            <button onClick={() => setRenameTarget(null)} className="px-4 py-2 rounded-lg border border-white/10 text-[#D4C9C0] text-sm">Cancel</button>
            <button onClick={handleRename} disabled={renaming} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold disabled:opacity-50">
              {renaming && <Loader2 size={14} className="animate-spin" />} Rename
            </button>
          </div>
        </div>
      </Modal>

      {loading ? <LoadingSkeleton className="h-64" /> : filtered.length === 0 && !uploading ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors ${dragOver ? "border-[#C8A45C] bg-[#C8A45C]/5" : "border-white/10"}`}
        >
          <Upload size={32} className="mx-auto mb-3 text-[#6B5E56]" />
          <p className="text-[#D4C9C0] font-medium mb-1">{search ? "No files match your search" : "Drop images here or click Upload"}</p>
          <p className="text-xs text-[#6B5E56]">PNG, JPG, WebP up to 10MB</p>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 ${dragOver ? "ring-2 ring-[#C8A45C] rounded-xl" : ""}`}
        >
          {filtered.map((item, i) => (
            <motion.div
              key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden") }} />
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 hidden">
                <Image size={32} className="text-[#6B5E56] opacity-30" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={e => { e.stopPropagation(); setRenameTarget(item); setRenameValue(item.name) }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors touch-manipulation" title="Rename"><Edit3 size={14} /></button>
                <button onClick={e => { e.stopPropagation(); copyUrl(item.url, item.id) }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors touch-manipulation" title="Copy URL">
                  {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button onClick={e => { e.stopPropagation(); setDeleteTarget(item) }} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors touch-manipulation"><Trash2 size={14} /></button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[10px] text-[#D4C9C0] truncate">{item.name}</p>
                <p className="text-[8px] text-[#6B5E56]">{formatSize(item.size)}</p>
              </div>
            </motion.div>
          ))}
          {uploading && (
            <div className="aspect-square rounded-xl border-2 border-dashed border-[#C8A45C] flex items-center justify-center">
              <Loader2 size={24} className="text-[#C8A45C] animate-spin" />
            </div>
          )}
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="absolute inset-0 bg-black/80" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()} className="relative max-w-2xl w-full rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] shadow-2xl overflow-hidden mx-4 max-h-[90vh] overflow-y-auto">
            <div className="aspect-video bg-white/5 flex items-center justify-center">
              <img src={selectedItem.url} alt={selectedItem.name} className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
              <Image size={48} className="text-[#6B5E56] opacity-20 absolute" />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-[#F5F0EB] font-semibold truncate">{selectedItem.name}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-[#6B5E56]">Size:</span> <span className="text-[#D4C9C0]">{formatSize(selectedItem.size)}</span></div>
                <div><span className="text-[#6B5E56]">Dimensions:</span> <span className="text-[#D4C9C0]">{selectedItem.width}×{selectedItem.height}</span></div>
                <div><span className="text-[#6B5E56]">Folder:</span> <span className="text-[#D4C9C0]">{selectedItem.folder}</span></div>
                <div><span className="text-[#6B5E56]">Added:</span> <span className="text-[#D4C9C0]">{new Date(selectedItem.created_at).toLocaleDateString()}</span></div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => { setRenameTarget(selectedItem); setRenameValue(selectedItem.name); setSelectedItem(null) }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-[#D4C9C0] text-sm font-semibold hover:bg-white/20 touch-manipulation"><Edit3 size={14} /> Rename</button>
                <button onClick={() => copyUrl(selectedItem.url, selectedItem.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8A45C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B8933D] touch-manipulation">
                  {copiedId === selectedItem.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === selectedItem.id ? "Copied!" : "Copy URL"}
                </button>
                <button onClick={() => { setDeleteTarget(selectedItem); setSelectedItem(null) }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/30 touch-manipulation"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
