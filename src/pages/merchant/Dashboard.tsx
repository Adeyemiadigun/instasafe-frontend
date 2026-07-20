import { Link } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"
import { useMerchantOrders } from "@/hooks/useOrders"
import StatCard from "@/components/shared/StatCard"
import OrderStatusBadge from "@/components/orders/OrderStatusBadge"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Clock, CheckCircle, DollarSign, Plus } from "lucide-react"
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}</h1>
          <p className="text-muted-foreground">Here's your business overview</p>
        </div>
        <Link to="/dashboard/orders/new" className="w-full sm:w-auto">
          <Button className="w-full"><Plus className="h-4 w-4 mr-2" /> Create Order</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Orders" value={totalOrders} />
        <StatCard icon={Clock} label="Active Escrows" value={activeEscrows} />
        <StatCard icon={CheckCircle} label="Completed" value={completed} />
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(revenue)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-sm text-emerald-600 hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No orders yet. Create your first order to get started.</p>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
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
                    <TableCell><OrderStatusBadge status={order.status as OrderStatus} /></TableCell>
                    <TableCell>{formatDateShort(order.createdAt)}</TableCell>
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
