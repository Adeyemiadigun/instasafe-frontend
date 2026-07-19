import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"
import { useMerchantOrders } from "@/hooks/useOrders"
import OrderStatusBadge from "@/components/orders/OrderStatusBadge"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import EmptyState from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Package } from "lucide-react"
import { formatCurrency, formatDateShort } from "@/lib/utils"
import { ORDER_STATUS_LABELS } from "@/lib/constants"
import type { OrderStatus } from "@/types"

export default function Orders() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const { data, isLoading } = useMerchantOrders(user?.userId || "", page, 10, statusFilter || undefined)

  if (isLoading) return <LoadingSpinner message="Loading orders..." />

  const orders = data?.items || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1) }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link to="/dashboard/orders/new">
            <Button><Plus className="h-4 w-4 mr-2" /> Create Order</Button>
          </Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders" description="Create your first escrow order." action={{ label: "Create Order", onClick: () => window.location.href = "/dashboard/orders/new" }} />
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link to={`/dashboard/orders/${order.id}`} className="hover:underline text-emerald-600">
                        {order.orderReference}
                      </Link>
                    </TableCell>
                    <TableCell>{order.itemName}</TableCell>
                    <TableCell>{formatCurrency(order.price)}</TableCell>
                    <TableCell>{order.buyerName || "—"}</TableCell>
                    <TableCell><OrderStatusBadge status={order.status as OrderStatus} /></TableCell>
                    <TableCell>{formatDateShort(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
