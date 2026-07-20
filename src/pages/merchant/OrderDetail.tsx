import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useOrder, useOrderTimeline, useGenerateEscrowLink, useDeleteOrder } from "@/hooks/useOrders"
import { useGenerateQrCodes } from "@/hooks/useDelivery"
import OrderStatusBadge from "@/components/orders/OrderStatusBadge"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import CurrencyDisplay from "@/components/shared/CurrencyDisplay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Link as LinkIcon, QrCode, Clock } from "lucide-react"
import { getApiErrorMessage } from "@/lib/errorHandler"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import type { OrderStatus } from "@/types"
import type { EscrowLinkResponse, QrCodesResponse } from "@/types"

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(id || "")
  const { data: timeline } = useOrderTimeline(id || "")
  const generateLink = useGenerateEscrowLink(id || "")
  const generateQr = useGenerateQrCodes(id || "")

  const [buyerForm, setBuyerForm] = useState({ buyerFirstName: "", buyerLastName: "", buyerEmail: "", buyerPhone: "" })
  const [escrowResult, setEscrowResult] = useState<EscrowLinkResponse | null>(null)
  const [qrResult, setQrResult] = useState<QrCodesResponse | null>(null)

  const deleteOrder = useDeleteOrder()
  const navigate = useNavigate()

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await generateLink.mutateAsync(buyerForm)
      setEscrowResult(res.data)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleGenerateQr = async () => {
    try {
      const res = await generateQr.mutateAsync()
      setQrResult(res.data)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleDeleteOrder = async () => {
    if (!confirm("Are you sure you want to delete this order? If a dispatcher was assigned, they will be notified.")) return;
    try {
      await deleteOrder.mutateAsync(order!.id)
      toast.success("Order deleted successfully")
      navigate("/dashboard/orders")
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  if (isLoading) return <LoadingSpinner message="Loading order..." />
  if (!order) return <p className="text-center py-8 text-muted-foreground">Order not found.</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link to="/dashboard/orders" className="p-2 hover:bg-muted rounded-md shrink-0"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{order.itemName}</h1>
            <p className="text-muted-foreground text-sm truncate">Order {order.orderReference}</p>
          </div>
        </div>
        <div className="sm:ml-auto flex items-center gap-4">
          <OrderStatusBadge status={order.status as OrderStatus} />
          {(order.status === "Draft" || order.status === "PendingPayment") && (
            <Button variant="destructive" size="sm" onClick={handleDeleteOrder} disabled={deleteOrder.isPending}>
              {deleteOrder.isPending ? "Deleting..." : "Delete Order"}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Item Details</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-medium"><CurrencyDisplay amount={order.price} /></span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span>{order.currency}</span></div>
                {order.itemDescription && <p className="pt-2 border-t">{order.itemDescription}</p>}
                {order.deliveryAddress && <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{order.deliveryAddress}</span></div>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Buyer Info</CardTitle></CardHeader>
              <CardContent className="text-sm">
                {order.buyer ? (
                  <div className="space-y-1">
                    <p>{order.buyer.firstName} {order.buyer.lastName}</p>
                    <p className="text-muted-foreground">{order.buyer.email}</p>
                    <p className="text-muted-foreground">{order.buyer.phone}</p>
                  </div>
                ) : <p className="text-muted-foreground">No buyer linked yet</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          {order.status === "Draft" && !escrowResult && (
            <Card>
              <CardHeader><CardTitle className="text-base">Generate Escrow Link</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateLink} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>First Name *</Label><Input value={buyerForm.buyerFirstName} onChange={(e) => setBuyerForm((p) => ({ ...p, buyerFirstName: e.target.value }))} required /></div>
                    <div className="space-y-1"><Label>Last Name *</Label><Input value={buyerForm.buyerLastName} onChange={(e) => setBuyerForm((p) => ({ ...p, buyerLastName: e.target.value }))} required /></div>
                  </div>
                  <div className="space-y-1"><Label>Email *</Label><Input type="email" value={buyerForm.buyerEmail} onChange={(e) => setBuyerForm((p) => ({ ...p, buyerEmail: e.target.value }))} required /></div>
                  <div className="space-y-1"><Label>Phone *</Label><Input value={buyerForm.buyerPhone} onChange={(e) => setBuyerForm((p) => ({ ...p, buyerPhone: e.target.value }))} required /></div>
                  <Button type="submit" disabled={generateLink.isPending}>{generateLink.isPending ? "Generating..." : "Generate Link"}</Button>
                </form>
              </CardContent>
            </Card>
          )}
          {escrowResult && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Escrow Link Generated</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Virtual Account</span><span className="font-mono font-medium">{escrowResult.virtualAccountNumber}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Bank Code</span><span>{escrowResult.virtualBankCode}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Expires</span><span>{formatDate(escrowResult.expiresAt)}</span></div>
                <p className="pt-2 text-muted-foreground">Share the checkout link with the buyer to complete payment.</p>
              </CardContent>
            </Card>
          )}
          {order.escrowTransaction && (
            <Card>
              <CardHeader><CardTitle className="text-base">Payment Status</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge>{order.escrowTransaction.status}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Channel</span><span>{order.escrowTransaction.channel}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span><CurrencyDisplay amount={order.escrowTransaction.amount} /></span></div>
                {order.escrowTransaction.virtualAccountNumber && <div className="flex justify-between"><span className="text-muted-foreground">Account</span><span className="font-mono">{order.escrowTransaction.virtualAccountNumber}</span></div>}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><QrCode className="h-4 w-4" /> QR Codes</CardTitle></CardHeader>
            <CardContent>
              {order.status === "FundedInEscrow" && !qrResult && (
                <Button onClick={handleGenerateQr} disabled={generateQr.isPending}>{generateQr.isPending ? "Generating..." : "Generate QR Codes"}</Button>
              )}
              {qrResult && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Merchant Token</span><code className="bg-muted px-2 py-1 rounded text-xs break-all">{qrResult.merchantQrToken}</code></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Buyer Token</span><code className="bg-muted px-2 py-1 rounded text-xs break-all">{qrResult.buyerQrToken}</code></div>
                </div>
              )}
              {order.deliverySession && (
                <div className="space-y-2 text-sm mt-4 pt-4 border-t">
                  <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge>{order.deliverySession.status}</Badge></div>
                  {order.deliverySession.pickupTimestamp && <div className="flex justify-between"><span className="text-muted-foreground">Picked Up</span><span>{formatDate(order.deliverySession.pickupTimestamp)}</span></div>}
                  {order.deliverySession.deliveryTimestamp && <div className="flex justify-between"><span className="text-muted-foreground">Delivered</span><span>{formatDate(order.deliverySession.deliveryTimestamp)}</span></div>}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Timeline</CardTitle></CardHeader>
            <CardContent>
              {!timeline || timeline.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events yet.</p>
              ) : (
                <div className="space-y-4">
                  {timeline.map((entry, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 mt-1" />
                        {i < timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-sm">{entry.event}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</p>
                        {entry.detail && <p className="text-sm text-muted-foreground mt-1">{entry.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
