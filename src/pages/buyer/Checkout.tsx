import { useParams } from "react-router-dom"
import { useOrder } from "@/hooks/useOrders"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import OrderStatusBadge from "@/components/orders/OrderStatusBadge"
import CurrencyDisplay from "@/components/shared/CurrencyDisplay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { ShieldCheck } from "lucide-react"
import Logo from "@/components/shared/Logo"
import type { OrderStatus } from "@/types"

export default function Checkout() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data: order, isLoading } = useOrder(orderId || "")

  if (isLoading) return <LoadingSpinner message="Loading order..." />
  if (!order) return <p className="text-center py-8 text-muted-foreground">Order not found.</p>

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-lg mx-auto py-12 px-4">
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{order.itemName}</CardTitle>
              <OrderStatusBadge status={order.status as OrderStatus} />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {order.itemImageUrl && <img src={order.itemImageUrl} alt={order.itemName} className="w-full h-56 object-cover rounded-xl" />}
            {order.itemDescription && <p className="text-sm text-muted-foreground leading-relaxed">{order.itemDescription}</p>}

            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount to Pay</p>
              <p className="text-3xl font-[family-name:var(--font-display)] font-bold text-primary tracking-tight">
                <CurrencyDisplay amount={order.price} />
              </p>
            </div>

            <div className="flex justify-between text-sm py-2 border-t border-border/40">
              <span className="text-muted-foreground">Seller</span>
              <span className="font-medium">{order.merchant.businessName}</span>
            </div>

            {order.status === "PendingPayment" && (
              <Link to={`/order/${orderId}/pay`} className="block">
                <Button className="w-full h-12 text-base font-semibold" size="lg">
                  Proceed to Payment
                </Button>
              </Link>
            )}
            {order.status !== "PendingPayment" && order.status !== "Draft" && (
              <Link to={`/order/${orderId}/track`} className="block">
                <Button variant="outline" className="w-full h-12 text-base">Track Order</Button>
              </Link>
            )}

            <p className="text-center text-xs text-muted-foreground pt-2">
              <ShieldCheck className="inline h-3 w-3 mr-1 -mt-0.5" />
              Payment is held in escrow until delivery is confirmed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
