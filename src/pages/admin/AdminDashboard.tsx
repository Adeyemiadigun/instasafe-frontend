import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StatCard from "@/components/shared/StatCard"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import EmptyState from "@/components/shared/EmptyState"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Dispute } from "@/types/dispute"
import { DISPUTE_STATUS_LABELS } from "@/lib/constants"
import { useMemo } from "react"

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-red-100 text-red-700",
  UnderReview: "bg-yellow-100 text-yellow-700",
  ResolvedRefund: "bg-orange-100 text-orange-700",
  ResolvedRelease: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-700",
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { data: disputes, isLoading } = useQuery({
    queryKey: ["adminDisputes"],
    queryFn: () => api.get("/disputes"),
    select: (res: { data: Dispute[] }) => res.data ?? [],
  })

  const all = useMemo(() => disputes ?? [], [disputes])
  const open = useMemo(() => all.filter((d) => d.status === "Open" || d.status === "UnderReview"), [all])
  const resolved = useMemo(() => all.filter((d) => d.status.startsWith("Resolved")), [all])
  const recent = useMemo(() => all.slice(0, 5), [all])

  if (isLoading) return <LoadingSpinner message="Loading dashboard..." />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={AlertTriangle} label="Total Disputes" value={all.length} />
        <StatCard icon={Clock} label="Open" value={open.length} />
        <StatCard icon={CheckCircle} label="Resolved" value={resolved.length} />
        <StatCard icon={MessageSquare} label="WhatsApp Sessions" value="—" />
      </div>

      <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">Recent Disputes</h2>
        </div>
        <div className="px-6 pb-6">
          {recent.length === 0 ? (
            <EmptyState icon={CheckCircle} title="No disputes" description="No disputes have been raised yet." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Order</TableHead>
                  <TableHead className="font-semibold">Buyer</TableHead>
                  <TableHead className="font-semibold">Reason</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((d, i) => (
                  <TableRow
                    key={d.id}
                    className={`cursor-pointer hover:bg-muted/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}
                    tabIndex={0}
                    onClick={() => navigate(`/admin/disputes/${d.id}`)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/admin/disputes/${d.id}`) } }}
                  >
                    <TableCell className="font-semibold text-primary">{d.orderReference}</TableCell>
                    <TableCell>{d.buyerName}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{d.reason}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_COLORS[d.status]}>
                        {DISPUTE_STATUS_LABELS[d.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(d.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
