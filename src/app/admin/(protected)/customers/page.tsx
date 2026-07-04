"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Users, Search, Phone, Mail, Star, Calendar, MessageSquare, ChevronRight } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import EmptyState from "@/components/admin/ui/EmptyState"
import ErrorState from "@/components/admin/ui/ErrorState"
import { Modal, Pagination, Badge } from "@/components/admin/ui"

interface Customer {
  id: string; name: string; phone: string; email: string
  reservation_count: number; last_reservation: string | null
  notes: string; is_favorite: boolean; created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState("")
  const [search, setSearch] = useState(""); const [page, setPage] = useState(1); const pageSize = 12
  const [favoriteFilter, setFavoriteFilter] = useState(false)
  const [selected, setSelected] = useState<Customer | null>(null)

  const fetchData = useCallback(async () => {
    try { const res = await fetch("/admin/api/customers"); if (!res.ok) throw new Error(); setCustomers(await res.json()) }
    catch { setError("Failed to load customers") }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchesFav = favoriteFilter ? c.is_favorite : true
    return matchesSearch && matchesFav
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <>
      <PageHeader title="Customers" description="Your guest database" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5E56]" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search customers..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40" />
        </div>
        <button onClick={() => setFavoriteFilter(!favoriteFilter)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${favoriteFilter ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" : "bg-white/5 border-white/10 text-[#6B5E56]"}`}><Star size={16} /> Favorites</button>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || "Customer"} size="md">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#C8A45C]/20 flex items-center justify-center text-2xl font-bold text-[#C8A45C]">{selected.name.charAt(0)}</div>
              <div>
                <h3 className="text-lg font-semibold text-[#F5F0EB]">{selected.name} {selected.is_favorite && <Star size={14} className="inline text-yellow-400 fill-yellow-400" />}</h3>
                <p className="text-sm text-[#6B5E56]">Customer since {new Date(selected.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/[0.03]">
              <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-[#C8A45C]" /><span className="text-[#D4C9C0]">{selected.email}</span></div>
              <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-[#C8A45C]" /><span className="text-[#D4C9C0]">{selected.phone}</span></div>
              <div className="flex items-center gap-2 text-sm"><Calendar size={14} className="text-[#C8A45C]" /><span className="text-[#D4C9C0]">{selected.reservation_count} reservations</span></div>
              <div className="flex items-center gap-2 text-sm"><MessageSquare size={14} className="text-[#C8A45C]" /><span className="text-[#D4C9C0]">{selected.last_reservation ? new Date(selected.last_reservation).toLocaleDateString() : "No recent"}</span></div>
            </div>
            {selected.notes && (
              <div>
                <h4 className="text-xs text-[#6B5E56] font-medium mb-1.5 uppercase">Notes</h4>
                <p className="text-sm text-[#D4C9C0] bg-white/[0.03] rounded-lg p-3">{selected.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {paginated.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No customers found" description={search ? "No customers match your search" : "No customer data yet"} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((c, i) => (
              <motion.button
                key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                onClick={() => setSelected(c)}
                className="text-left p-4 rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] hover:border-[#C8A45C]/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#C8A45C]/20 flex items-center justify-center text-sm font-bold text-[#C8A45C]">{c.name.charAt(0)}</div>
                  {c.is_favorite && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                </div>
                <h4 className="text-sm font-medium text-[#F5F0EB] truncate">{c.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-[#6B5E56] mt-1">
                  <Phone size={11} /> {c.phone}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                  <span className="text-xs text-[#6B5E56]">{c.reservation_count} visits</span>
                  <ChevronRight size={14} className="text-[#6B5E56] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </div>
          <Pagination current={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
        </>
      )}
    </>
  )
}
