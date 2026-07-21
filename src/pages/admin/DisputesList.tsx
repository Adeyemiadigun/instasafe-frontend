import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import EmptyState from "@/components/shared/EmptyState"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Dispute } from "@/types/dispute"
import { DISPUTE_STATUS_LABELS, DISPUTE_STATUS_COLORS } from "@/lib/constants"

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight">All Disputes</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-full sm:w-48 rounded-lg">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(DISPUTE_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No disputes" description="No disputes match your filter." />
      ) : (
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
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
                  <TableCell className="font-semibold text-primary">{d.orderReference}</TableCell>
                  <TableCell>{d.buyerName}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{d.reason}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={DISPUTE_STATUS_COLORS[d.status]}>
                      {DISPUTE_STATUS_LABELS[d.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(d.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      )}
    </div>
  )
}
