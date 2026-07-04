"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, Image as ImageIcon, X, Loader2, Library } from "lucide-react"
import ImagePicker from "./ImagePicker"

const BUCKET_FOLDER_MAP: Record<string, string> = {
  MENU: "Menu Images",
  GALLERY: "Gallery Images",
  LOGO: "Logo",
  HERO: "Hero Images",
  STORY: "Story Images",
  FULL_HOUSE: "Full House Images",
  FEATURED: "Featured Dish Images",
  ICONS: "Icons",
}

interface ImageUploadProps {
  currentUrl?: string | null
  onUpload: (url: string) => void
  onRemove?: () => void
  label?: string
  bucket?: string
}

export default function ImageUpload({ currentUrl, onUpload, onRemove, label = "Upload Image", bucket = "MENU" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [error, setError] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(currentUrl || null)
  }, [currentUrl])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")
    setUploading(true)
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    const fd = new FormData()
    fd.append("file", file)
    fd.append("bucket", bucket)

    try {
      const res = await fetch("/admin/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.url) {
        onUpload(data.url)
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (err) {
      setPreview(currentUrl || null)
      setError(err instanceof Error ? err.message : "Upload failed")
    }
    setUploading(false)
  }

  const handleRemove = () => {
    setPreview(null)
    setError("")
    onRemove?.()
    if (inputRef.current) inputRef.current.value = ""
  }

  const handlePickerSelect = (url: string) => {
    setPreview(url)
    onUpload(url)
  }

  return (
    <div className="space-y-1.5">
      {preview ? (
        <div className="relative group aspect-video rounded-lg overflow-hidden border border-white/[0.06] bg-[#0D0D0D]">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="p-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer transition-colors touch-manipulation">
              <Upload size={16} className="text-white" />
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
            </label>
            <button onClick={() => setPickerOpen(true)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors touch-manipulation" title="Select from Library">
              <Library size={16} />
            </button>
            <button onClick={handleRemove} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors touch-manipulation">
              <X size={16} />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-[#C8A45C]" />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-white/10 hover:border-[#C8A45C]/40 bg-white/[0.02] cursor-pointer transition-colors group touch-manipulation min-h-[120px]">
            {uploading ? (
              <Loader2 size={24} className="animate-spin text-[#C8A45C]" />
            ) : (
              <>
                <ImageIcon size={24} className="text-[#6B5E56] group-hover:text-[#C8A45C] transition-colors mb-2" />
                <span className="text-xs text-[#6B5E56] group-hover:text-[#D4C9C0] transition-colors px-2 text-center">{label}</span>
              </>
            )}
            <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" disabled={uploading} />
          </label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-[#D4C9C0] text-xs hover:bg-white/5 transition-colors touch-manipulation"
          >
            <Library size={14} /> Browse Media Library
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}

      <ImagePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handlePickerSelect}
        defaultFolder={BUCKET_FOLDER_MAP[bucket]}
      />
    </div>
  )
}
