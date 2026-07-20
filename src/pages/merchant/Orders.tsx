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
import { Plus, Package, ChevronLeft, ChevronRight } from "lucide-react"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Orders</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1) }}>
            <SelectTrigger className="w-full sm:w-48 h-10">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link to="/dashboard/orders/new" className="w-full sm:w-auto">
            <Button className="w-full h-10">
              <Plus className="h-4 w-4 mr-2" /> Create Order
            </Button>
          </Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders"
          description="Create your first escrow order to start selling."
          action={{ label: "Create Order", onClick: () => window.location.href = "/dashboard/orders/new" }}
        />
      ) : (
        <>
          <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Reference</TableHead>
                  <TableHead className="font-semibold">Item</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Buyer</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, i) => (
                  <TableRow key={order.id} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <TableCell className="font-medium">
                      <Link to={`/dashboard/orders/${order.id}`} className="text-primary hover:text-primary/80 font-semibold transition-colors">
                        {order.orderReference}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.itemName}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.price)}</TableCell>
                    <TableCell className="text-muted-foreground">{order.buyerName || "—"}</TableCell>
                    <TableCell><OrderStatusBadge status={order.status as OrderStatus} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDateShort(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
