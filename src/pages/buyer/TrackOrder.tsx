import { useParams, Link } from "react-router-dom"
import { useOrder, useOrderTimeline } from "@/hooks/useOrders"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import OrderStatusBadge from "@/components/orders/OrderStatusBadge"
import CurrencyDisplay from "@/components/shared/CurrencyDisplay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { OrderStatus } from "@/types"

export default function TrackOrder() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data: order, isLoading } = useOrder(orderId || "")
  const { data: timeline } = useOrderTimeline(orderId || "")

  if (isLoading) return <LoadingSpinner message="Loading..." />
  if (!order) return <p className="text-center py-8 text-muted-foreground">Order not found.</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Track Order</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{order.itemName}</CardTitle>
            <OrderStatusBadge status={order.status as OrderStatus} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Price</span><CurrencyDisplay amount={order.price} /></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Seller</span><span className="font-medium">{order.merchant.businessName}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Timeline</CardTitle></CardHeader>
        <CardContent>
          {!timeline || timeline.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No events yet.</p>
          ) : (
            <div className="space-y-0">
              {timeline.map((entry, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full mt-1.5 shrink-0 ${i === 0 ? "bg-primary ring-4 ring-primary/10" : "bg-border"}`} />
                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-border/60" />}
                  </div>
                  <div className="pb-6 flex-1">
                    <p className="font-semibold text-sm">{entry.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(entry.timestamp)}</p>
                    {entry.detail && <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{entry.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {order.status === "Delivered" && (
        <Link to={`/order/${orderId}/scan`}>
          <Button className="w-full h-11" size="lg">Confirm Delivery</Button>
        </Link>
      )}
    </div>
  )
}
