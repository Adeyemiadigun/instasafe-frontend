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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] tracking-tight">
          Welcome back, {user?.firstName}
        </h1>
        <Link to="/dashboard/orders/new">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Manually
          </Button>
        </Link>
      </div>

      {/* Chatbot Banner */}
      <div className="bg-[#128C7E]/10 border border-[#128C7E]/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="bg-[#128C7E]/20 p-3 rounded-full flex-shrink-0">
          <svg className="w-8 h-8 text-[#128C7E]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold font-[family-name:var(--font-display)] text-foreground">Create Orders via WhatsApp!</h3>
          <p className="text-sm text-muted-foreground mt-1">Our AI Bot is the fastest way to create orders. Simply message <strong className="text-foreground">"Create Order"</strong> to our verified Bot to generate escrow links instantly.</p>
        </div>
        <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_BOT_NUMBER || "2340000000000"}?text=Create%20Order`} target="_blank" rel="noopener noreferrer">
          <Button className="bg-[#128C7E] hover:bg-[#128C7E]/90 text-white whitespace-nowrap">
            Message Bot
          </Button>
        </a>
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
          <div className="text-center py-12 bg-card rounded-xl border border-border/50">
            <ShoppingCart className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No orders yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Create your first escrow order to get started.</p>
            <Link to="/dashboard/orders/new" className="inline-flex mt-4">
              <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" /> Create Order</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
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
                        <Link to={`/dashboard/orders/${order.id}`} className="text-primary hover:text-primary/80 font-semibold transition-colors">
                          {order.orderReference}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.itemName}</TableCell>
                      <TableCell className="font-medium tabular-nums">{formatCurrency(order.price)}</TableCell>
                      <TableCell><OrderStatusBadge status={order.status as OrderStatus} /></TableCell>
                      <TableCell className="text-muted-foreground text-sm tabular-nums">{formatDateShort(order.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
