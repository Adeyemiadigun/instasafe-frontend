import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { useAuth } from "@/providers/AuthProvider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import EmptyState from "@/components/shared/EmptyState"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { PaginatedList } from "@/types"
import type { MerchantOrderResponse } from "@/types/merchant"
import { DISPUTE_STATUS_LABELS } from "@/lib/constants"

export default function MerchantDisputes() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: orders, isLoading } = useQuery({
    queryKey: ["merchantDisputes"],
    queryFn: () => api.get(`/merchants/${user?.userId}/orders`, { params: { statusFilter: "Disputed", pageSize: 50 } }),
    select: (res: { data: PaginatedList<MerchantOrderResponse> }) => res.data?.items ?? [],
    enabled: !!user?.userId,
  })

  const disputedOrders = useMemo(() => orders ?? [], [orders])

  if (isLoading) return <LoadingSpinner message="Loading disputes..." />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Disputes</h1>
      {disputedOrders.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No disputes"
          description="No disputes have been raised on your orders."
        />
      ) : (
        <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Order Ref</TableHead>
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  tabIndex={0}
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/dashboard/orders/${order.id}`) } }}
                >
                  <TableCell className="font-medium">{order.orderReference}</TableCell>
                  <TableCell>{order.itemName}</TableCell>
                  <TableCell>₦{order.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-100 text-red-700">
                      {DISPUTE_STATUS_LABELS["Open"]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
