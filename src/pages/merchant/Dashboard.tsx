import { Link } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"
import { useMerchantOrders } from "@/hooks/useOrders"
import StatCard from "@/components/shared/StatCard"
import OrderStatusBadge from "@/components/orders/OrderStatusBadge"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Clock, CheckCircle, DollarSign, Plus, ArrowRight, ShoppingCart } from "lucide-react"
import { formatCurrency, formatDateShort } from "@/lib/utils"
import type { OrderStatus } from "@/types"

export default function MerchantDashboard() {
  const { user } = useAuth()
  const { data, isLoading } = useMerchantOrders(user?.userId || "", 1, 5)

  if (isLoading) return <LoadingSpinner message="Loading dashboard..." />

  const orders = data?.items || []
  const totalOrders = data?.totalCount || 0
  const activeEscrows = orders.filter((o) => o.status === "FundedInEscrow" || o.status === "Dispatched").length
  const completed = orders.filter((o) => o.status === "CompletedReleased").length
  const revenue = orders.filter((o) => o.status === "CompletedReleased").reduce((sum, o) => sum + o.price, 0)

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-teal-600 to-teal-500 p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] mb-2">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-lg">
            Here's what's happening with your escrow transactions today.
          </p>
          <Link to="/dashboard/orders/new" className="inline-flex mt-5">
            <Button className="bg-white text-primary hover:bg-white/90 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Orders" value={totalOrders} />
        <StatCard icon={Clock} label="Active Escrows" value={activeEscrows} />
        <StatCard icon={CheckCircle} label="Completed" value={completed} />
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(revenue)} />
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">Recent Orders</h2>
          <Link
            to="/dashboard/orders"
            className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border/60">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No orders yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Create your first escrow order to get started.</p>
            <Link to="/dashboard/orders/new" className="inline-flex mt-4">
              <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" /> Create Order</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Reference</TableHead>
                  <TableHead className="font-semibold">Item</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, i) => (
                  <TableRow
                    key={order.id}
                    className={i % 2 === 0 ? "bg-muted/20" : ""}
                  >
                    <TableCell className="font-medium">
                      <Link to={`/dashboard/orders/${order.id}`} className="text-primary hover:text-primary/80 font-semibold transition-colors">
                        {order.orderReference}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.itemName}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.price)}</TableCell>
                    <TableCell><OrderStatusBadge status={order.status as OrderStatus} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDateShort(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
