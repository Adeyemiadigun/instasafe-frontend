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
import type { ApiResult, PaginatedList } from "@/types"
import type { MerchantOrderResponse } from "@/types/merchant"
import { DISPUTE_STATUS_LABELS } from "@/lib/constants"

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-red-100 text-red-700",
  UnderReview: "bg-yellow-100 text-yellow-700",
  ResolvedRefund: "bg-orange-100 text-orange-700",
  ResolvedRelease: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-700",
}

export default function MerchantDisputes() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: orders, isLoading } = useQuery({
    queryKey: ["merchantDisputes"],
    queryFn: () => api.get(`/merchants/${user?.userId}/orders`, { params: { statusFilter: "Disputed", pageSize: 50 } }),
    select: (res: { data: ApiResult<PaginatedList<MerchantOrderResponse>> }) => res.data.data?.items ?? [],
    enabled: !!user?.userId,
  })

  if (isLoading) return <LoadingSpinner message="Loading disputes..." />

  const disputedOrders = orders ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disputes</h1>
      {disputedOrders.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No disputes"
          description="No disputes have been raised on your orders."
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Ref</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
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
