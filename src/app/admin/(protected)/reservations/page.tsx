"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { CalendarCheck, Search, X, Loader2, ChevronDown, Eye, CalendarDays, Filter } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import EmptyState from "@/components/admin/ui/EmptyState"
import ErrorState from "@/components/admin/ui/ErrorState"
import { Modal, ConfirmDialog, Pagination, Badge, Tabs, useToast } from "@/components/admin/ui"

type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed"

interface Reservation {
  id: string; guest_name: string; guest_email: string; guest_phone: string
  date: string; time: string; guests: number; status: ReservationStatus
  special_requests: string | null; created_at: string
}

const statusStyles: Record<ReservationStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
  completed: "bg-blue-500/20 text-blue-400",
}

const tabs = [
  { id: "all" as const, label: "All" },
  { id: "pending" as const, label: "Pending" },
  { id: "confirmed" as const, label: "Confirmed" },
  { id: "cancelled" as const, label: "Cancelled" },
  { id: "completed" as const, label: "Completed" },
]

export default function ReservationsPage() {
  const { toast } = useToast()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<ReservationStatus | "all">("all")
  const [search, setSearch] = useState(""); const [dateFilter, setDateFilter] = useState("")
  const [page, setPage] = useState(1); const pageSize = 10
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null); const [deleting, setDeleting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const url = filter === "all" ? "/admin/api/reservations" : `/admin/api/reservations?status=${filter}`
      const res = await fetch(url); if (!res.ok) throw new Error(); setReservations(await res.json())
    } catch { setError("Failed to load") }
  }, [filter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleStatus = async (id: string, status: ReservationStatus) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/admin/api/reservations/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error(); fetchData()
    } catch { toast("error", "Failed to update reservation") }
    finally { setUpdatingId(null) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try { await fetch(`/admin/api/reservations/${deleteTarget.id}`, { method: "DELETE" }); setDeleteTarget(null); fetchData() }
    catch { toast("error", "Failed to delete reservation") }
    finally { setDeleting(false) }
  }

  const filtered = reservations.filter(r => {
    const matchesSearch = r.guest_name.toLowerCase().includes(search.toLowerCase()) || r.guest_email.toLowerCase().includes(search.toLowerCase()) || r.guest_phone.includes(search)
    const matchesDate = !dateFilter || r.date === dateFilter
    return matchesSearch && matchesDate
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <>
      <PageHeader title="Reservations" description="Manage guest bookings" />

      <Tabs tabs={tabs} active={filter} onChange={v => { setFilter(v as ReservationStatus | "all"); setPage(1) }} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5E56]" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, email, or phone..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${showFilters ? "bg-[#C8A45C]/10 border-[#C8A45C]/30 text-[#C8A45C]" : "bg-white/5 border-white/10 text-[#6B5E56]"}`}><CalendarDays size={16} /> Date Filter</button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <label className="block text-xs text-[#D4C9C0] mb-1.5">Filter by date</label>
          <input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1) }} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#C8A45C]/40" />
          {dateFilter && <button onClick={() => setDateFilter("")} className="ml-2 text-xs text-[#C8A45C] hover:underline">Clear</button>}
        </div>
      )}

      <Modal open={!!selectedRes} onClose={() => setSelectedRes(null)} title="Reservation Details" size="lg">
        {selectedRes && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Guest Name" value={selectedRes.guest_name} />
              <Detail label="Status" value={<Badge variant={selectedRes.status === "pending" ? "yellow" : selectedRes.status === "confirmed" ? "green" : selectedRes.status === "cancelled" ? "red" : "blue"}>{selectedRes.status}</Badge>} />
              <Detail label="Email" value={selectedRes.guest_email} />
              <Detail label="Phone" value={selectedRes.guest_phone} />
              <Detail label="Date" value={new Date(selectedRes.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
              <Detail label="Time" value={selectedRes.time} />
              <Detail label="Guests" value={`${selectedRes.guests} ${selectedRes.guests === 1 ? "guest" : "guests"}`} />
              <Detail label="Booked" value={new Date(selectedRes.created_at).toLocaleDateString()} />
            </div>
            {selectedRes.special_requests && (
              <div>
                <h4 className="text-xs text-[#6B5E56] font-medium mb-1.5 uppercase tracking-wider">Special Requests</h4>
                <p className="text-sm text-[#D4C9C0] bg-white/[0.03] rounded-lg p-3">{selectedRes.special_requests}</p>
              </div>
            )}
            {selectedRes.status === "pending" && (
              <div className="flex gap-3 pt-2">
                <button onClick={() => { handleStatus(selectedRes.id, "confirmed"); setSelectedRes(null) }} className="flex-1 px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600">Confirm Reservation</button>
                <button onClick={() => { handleStatus(selectedRes.id, "cancelled"); setSelectedRes(null) }} className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/30">Cancel Reservation</button>
              </div>
            )}
            {selectedRes.status === "confirmed" && (
              <button onClick={() => { handleStatus(selectedRes.id, "completed"); setSelectedRes(null) }} className="w-full px-4 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600">Mark as Completed</button>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Reservation" message="Are you sure? This action cannot be undone." loading={deleting} />

      {paginated.length === 0 ? (
        <EmptyState icon={<CalendarCheck size={28} />} title="No reservations" description={search || dateFilter ? "No reservations match your filters" : "No reservations yet"} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-[#6B5E56] font-medium">Guest</th>
                  <th className="text-left p-3 text-[#6B5E56] font-medium hidden md:table-cell">Contact</th>
                  <th className="text-left p-3 text-[#6B5E56] font-medium">Date</th>
                  <th className="text-left p-3 text-[#6B5E56] font-medium hidden sm:table-cell">Time/Guests</th>
                  <th className="text-left p-3 text-[#6B5E56] font-medium">Status</th>
                  <th className="text-right p-3 text-[#6B5E56] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(r => (
                  <tr key={r.id} className="border-t border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="p-3">
                      <span className="text-[#F5F0EB] font-medium">{r.guest_name}</span>
                      <span className="text-[#6B5E56] text-xs block md:hidden">{r.guest_phone}</span>
                    </td>
                    <td className="p-3 text-[#6B5E56] hidden md:table-cell"><div>{r.guest_email}</div><div className="text-xs">{r.guest_phone}</div></td>
                    <td className="p-3 text-[#F5F0EB] whitespace-nowrap">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="p-3 text-[#D4C9C0] hidden sm:table-cell whitespace-nowrap">{r.time} · {r.guests} guests</td>
                    <td className="p-3"><Badge variant={r.status === "pending" ? "yellow" : r.status === "confirmed" ? "green" : r.status === "cancelled" ? "red" : "blue"}>{r.status}</Badge></td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelectedRes(r)} className="p-1.5 rounded-lg text-[#6B5E56] hover:text-[#C8A45C] hover:bg-white/5"><Eye size={14} /></button>
                        <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-lg text-[#6B5E56] hover:text-red-400 hover:bg-white/5"><X size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination current={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
        </>
      )}
    </>
  )
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs text-[#6B5E56] font-medium mb-1 uppercase tracking-wider">{label}</h4>
      <div className="text-sm text-[#D4C9C0]">{value}</div>
    </div>
  )
}
