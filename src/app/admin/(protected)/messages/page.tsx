"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Mail, Phone, Trash2, Loader2, Search, ArrowLeft, Archive, ArchiveRestore, Inbox, Filter } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import EmptyState from "@/components/admin/ui/EmptyState"
import LoadingSkeleton from "@/components/admin/ui/LoadingSkeleton"
import ErrorState from "@/components/admin/ui/ErrorState"
import { ConfirmDialog, Badge, Tabs, useToast } from "@/components/admin/ui"

interface Message {
  id: string; name: string; email: string; phone: string | null; subject: string
  message: string; is_read: boolean; is_archived: boolean; created_at: string
}

export default function MessagesPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true); const [error, setError] = useState("")
  const [selected, setSelected] = useState<Message | null>(null)
  const [tab, setTab] = useState("all"); const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null); const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/api/messages")
      if (!res.ok) throw new Error(); setMessages(await res.json())
    } catch { setError("Failed to load") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const toggleRead = async (msg: Message) => {
    setUpdating(msg.id)
    try {
      await fetch(`/admin/api/messages/${msg.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_read: !msg.is_read }),
      }); fetchData()
    } finally { setUpdating(null) }
  }

  const toggleArchive = async (msg: Message) => {
    setUpdating(msg.id)
    const isArchived = msg.is_archived ?? false
    try {
      await fetch(`/admin/api/messages/${msg.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_archived: !isArchived }),
      }); fetchData()
    } finally { setUpdating(null) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try { await fetch(`/admin/api/messages/${deleteTarget.id}`, { method: "DELETE" }); setDeleteTarget(null); if (selected?.id === deleteTarget.id) setSelected(null); fetchData() }
    catch { toast("error", "Failed to delete message") }
    finally { setDeleting(false) }
  }

  const filtered = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchesTab = tab === "all" ? true : tab === "unread" ? !m.is_read : tab === "archived" ? m.is_archived : !m.is_archived
    return matchesSearch && matchesTab
  })

  const formatDate = (d: string) => {
    const date = new Date(d); const now = new Date()
    const diff = now.getTime() - date.getTime()
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    return date.toLocaleDateString()
  }

  const tabs = [
    { id: "all", label: "All", count: messages.length },
    { id: "unread", label: "Unread", count: messages.filter(m => !m.is_read).length },
    { id: "inbox", label: "Inbox", count: messages.filter(m => !m.is_archived).length },
    { id: "archived", label: "Archived", count: messages.filter(m => m.is_archived).length },
  ]

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <>
      <PageHeader title="Messages" description="Contact form inquiries" />

      <Tabs tabs={tabs} active={tab} onChange={v => { setTab(v); setSelected(null) }} />

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5E56]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40" />
      </div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Message" message="Are you sure? This action cannot be undone." loading={deleting} />

      {loading ? <LoadingSkeleton className="h-64" /> : filtered.length === 0 ? (
        <EmptyState icon={<MessageSquare size={28} />} title="No messages" description={search ? "No messages match your search" : "No messages yet"} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-2">
            {filtered.map(msg => (
              <button key={msg.id} onClick={() => { setSelected(msg); if (!msg.is_read) toggleRead(msg) }} className={`w-full text-left p-4 rounded-xl transition-colors border ${selected?.id === msg.id ? "border-[#C8A45C]/30 bg-[#C8A45C]/5" : "border-white/[0.06] bg-gradient-to-br from-[#111] to-[#0D0D0D] hover:bg-white/[0.04]"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-[#C8A45C] flex-shrink-0" />}
                      {msg.is_archived && <Archive size={12} className="text-[#6B5E56]" />}
                      <h4 className={`text-sm truncate ${msg.is_read ? "text-[#D4C9C0]" : "text-[#F5F0EB] font-semibold"}`}>{msg.name}</h4>
                    </div>
                    <p className="text-xs text-[#6B5E56] truncate mt-0.5">{msg.subject}</p>
                  </div>
                  <span className="text-[10px] text-[#6B5E56] whitespace-nowrap">{formatDate(msg.created_at)}</span>
                </div>
                <p className="text-xs text-[#6B5E56] mt-2 line-clamp-2">{msg.message}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-6">
                  <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-xs text-[#6B5E56] hover:text-[#C8A45C] mb-4 lg:hidden"><ArrowLeft size={14} /> Back</button>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#F5F0EB]">{selected.name}</h3>
                      <p className="text-sm text-[#6B5E56]">{selected.subject}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleRead(selected)} disabled={updating === selected.id} className="p-2 rounded-lg text-[#6B5E56] hover:text-[#C8A45C] hover:bg-white/5" title={selected.is_read ? "Mark as unread" : "Mark as read"}>{updating === selected.id ? <Loader2 size={14} className="animate-spin" /> : <Inbox size={14} />}</button>
                      <button onClick={() => toggleArchive(selected)} disabled={updating === selected.id} className="p-2 rounded-lg text-[#6B5E56] hover:text-[#C8A45C] hover:bg-white/5" title={selected.is_archived ? "Unarchive" : "Archive"}>{selected.is_archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}</button>
                      <button onClick={() => setDeleteTarget(selected)} className="p-2 rounded-lg text-[#6B5E56] hover:text-red-400 hover:bg-white/5"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6 p-4 rounded-lg bg-white/[0.03]">
                    <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-[#C8A45C]" /><span className="text-[#D4C9C0]">{selected.email}</span></div>
                    {selected.phone && <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-[#C8A45C]" /><span className="text-[#D4C9C0]">{selected.phone}</span></div>}
                    <div className="text-[10px] text-[#6B5E56]">{new Date(selected.created_at).toLocaleString()}</div>
                  </div>
                  <p className="text-sm text-[#D4C9C0] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-[300px] flex items-center justify-center rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-6">
                  <p className="text-sm text-[#6B5E56]">Select a message to view</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  )
}
