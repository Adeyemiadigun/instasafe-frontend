import { useParams } from "react-router-dom"
import { useOrder } from "@/hooks/useOrders"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import OrderStatusBadge from "@/components/orders/OrderStatusBadge"
import CurrencyDisplay from "@/components/shared/CurrencyDisplay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import type { OrderStatus } from "@/types"

export default function Checkout() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data: order, isLoading } = useOrder(orderId || "")

  if (isLoading) return <LoadingSpinner message="Loading order..." />
  if (!order) return <p className="text-center py-8 text-muted-foreground">Order not found.</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order Checkout</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{order.itemName}</CardTitle>
            <OrderStatusBadge status={order.status as OrderStatus} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.itemImageUrl && <img src={order.itemImageUrl} alt={order.itemName} className="w-full h-48 object-cover rounded-md" />}
          {order.itemDescription && <p className="text-muted-foreground">{order.itemDescription}</p>}
          <div className="flex justify-between text-lg font-semibold">
            <span>Price</span>
            <CurrencyDisplay amount={order.price} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seller</span>
            <span>{order.merchant.businessName}</span>
          </div>
          {order.status === "PendingPayment" && (
            <Link to={`/order/${orderId}/pay`}>
              <Button className="w-full" size="lg">Pay Now</Button>
            </Link>
          )}
          {order.status !== "PendingPayment" && order.status !== "Draft" && (
            <Link to={`/order/${orderId}/track`}>
              <Button variant="outline" className="w-full">Track Order</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
