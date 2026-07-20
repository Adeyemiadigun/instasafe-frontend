import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
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
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={AlertTriangle} label="Total Disputes" value={all.length} />
        <StatCard icon={Clock} label="Open" value={open.length} />
        <StatCard icon={CheckCircle} label="Resolved" value={resolved.length} />
        <StatCard icon={MessageSquare} label="WhatsApp Sessions" value="—" />
      </div>

      <Card>
        <CardContent className="py-4">
          <h2 className="text-lg font-semibold mb-4">Recent Disputes</h2>
          {recent.length === 0 ? (
            <EmptyState icon={CheckCircle} title="No disputes" description="No disputes have been raised yet." />
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
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
                  {recent.map((d) => (
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
        </CardContent>
      </Card>
    </div>
  )
}
