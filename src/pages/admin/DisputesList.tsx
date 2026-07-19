import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import EmptyState from "@/components/shared/EmptyState"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Dispute } from "@/types/dispute"
import { DISPUTE_STATUS_LABELS } from "@/lib/constants"

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-red-100 text-red-700",
  UnderReview: "bg-yellow-100 text-yellow-700",
  ResolvedRefund: "bg-orange-100 text-orange-700",
  ResolvedRelease: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-700",
}

export default function DisputesList() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data: disputes, isLoading } = useQuery({
    queryKey: ["adminDisputes"],
    queryFn: () => api.get("/disputes"),
    select: (res: { data: Dispute[] }) => res.data ?? [],
  })

  const all = useMemo(() => disputes ?? [], [disputes])
  const filtered = useMemo(() => statusFilter === "all" ? all : all.filter((d) => d.status === statusFilter), [all, statusFilter])

  if (isLoading) return <LoadingSpinner message="Loading disputes..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Disputes</h1>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Statuses</option>
          {Object.entries(DISPUTE_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No disputes" description="No disputes match your filter." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow
                  key={d.id}
                  className="cursor-pointer hover:bg-muted/50"
                  tabIndex={0}
                  onClick={() => navigate(`/admin/disputes/${d.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/admin/disputes/${d.id}`) } }}
                >
                  <TableCell className="font-medium">{d.orderReference}</TableCell>
                  <TableCell>{d.buyerName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{d.reason}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_COLORS[d.status]}>
                      {DISPUTE_STATUS_LABELS[d.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(d.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
