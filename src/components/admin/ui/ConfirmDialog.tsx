"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Loader2 } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  variant?: "danger" | "warning" | "info"
  loading?: boolean
}

export default function ConfirmDialog({
  open, onClose, onConfirm, title, message,
  confirmLabel = "Delete", variant = "danger", loading,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] shadow-2xl p-6 text-center"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              variant === "danger" ? "bg-red-500/20 text-red-400" :
              variant === "warning" ? "bg-yellow-500/20 text-yellow-400" :
              "bg-blue-500/20 text-blue-400"
            }`}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-semibold text-[#F5F0EB] mb-2">{title}</h3>
            <p className="text-sm text-[#6B5E56] mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-[#D4C9C0] text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  variant === "danger" ? "bg-red-500 text-white hover:bg-red-600" :
                  variant === "warning" ? "bg-yellow-500 text-[#1A1A1A] hover:bg-yellow-600" :
                  "bg-[#C8A45C] text-[#1A1A1A] hover:bg-[#B8933D]"
                }`}
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
