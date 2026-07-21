import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/providers/AuthProvider"
import { useCreateOrder } from "@/hooks/useOrders"
import { getApiErrorMessage } from "@/lib/errorHandler"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const orderSchema = z.object({
  itemName: z.string().min(1, "Item name is required").max(500),
  itemDescription: z.string().max(2000).optional(),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  deliveryAddress: z.string().optional(),
  buyerFirstName: z.string().min(1, "Buyer first name is required"),
  buyerLastName: z.string().min(1, "Buyer last name is required"),
  buyerEmail: z.string().email("Invalid email address"),
  buyerPhone: z.string().min(10, "Valid phone number required"),
  dispatcherPhone: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

export default function CreateOrder() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const createOrder = useCreateOrder()

  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  })

  const onSubmit = async (data: OrderFormData) => {
    if (!user?.userId) return
    try {
      const res = await createOrder.mutateAsync({
        merchantId: user.userId,
        ...data
      })
      toast.success("Order & Escrow Link created!")
      navigate(`/dashboard/orders/${res.data.orderId}`)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-6 tracking-tight">Create Escrow Order</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order & Buyer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Item Information</h3>
              <div className="space-y-1.5">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input id="itemName" {...register("itemName")} />
                {errors.itemName && <p className="text-xs text-destructive">{errors.itemName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="itemDescription">Description</Label>
                <Textarea id="itemDescription" {...register("itemDescription")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (NGN) *</Label>
                <Input id="price" type="number" step="0.01" min="1" {...register("price")} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Buyer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="buyerFirstName">First Name *</Label>
                  <Input id="buyerFirstName" {...register("buyerFirstName")} />
                  {errors.buyerFirstName && <p className="text-xs text-destructive">{errors.buyerFirstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buyerLastName">Last Name *</Label>
                  <Input id="buyerLastName" {...register("buyerLastName")} />
                  {errors.buyerLastName && <p className="text-xs text-destructive">{errors.buyerLastName.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="buyerEmail">Email *</Label>
                  <Input id="buyerEmail" type="email" {...register("buyerEmail")} />
                  {errors.buyerEmail && <p className="text-xs text-destructive">{errors.buyerEmail.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buyerPhone">Phone *</Label>
                  <Input id="buyerPhone" {...register("buyerPhone")} />
                  {errors.buyerPhone && <p className="text-xs text-destructive">{errors.buyerPhone.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Input id="deliveryAddress" {...register("deliveryAddress")} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Dispatcher Automation (Optional)</h3>
              <p className="text-xs text-muted-foreground">If provided, we will automatically WhatsApp the pickup QR code to this number once the customer pays.</p>
              <div className="space-y-1.5">
                <Label htmlFor="dispatcherPhone">Dispatcher WhatsApp Number</Label>
                <Input id="dispatcherPhone" placeholder="+234..." {...register("dispatcherPhone")} />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/orders")}>Cancel</Button>
              <Button type="submit" disabled={createOrder.isPending}>
                {createOrder.isPending ? "Generating Secure Link..." : "Create Order & Get Link"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
