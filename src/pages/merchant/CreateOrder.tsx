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
        itemName: data.itemName,
        itemDescription: data.itemDescription || undefined,
        price: data.price,
        deliveryAddress: data.deliveryAddress || undefined,
      })
      toast.success("Order created!")
      navigate(`/dashboard/orders/${res.data.orderId}`)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-6">Create New Order</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="itemName" className="text-sm font-medium">Item Name *</Label>
              <Input id="itemName" {...register("itemName")} className="h-10" />
              {errors.itemName && <p className="text-sm text-destructive">{errors.itemName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemDescription" className="text-sm font-medium">Description</Label>
              <Textarea id="itemDescription" {...register("itemDescription")} rows={3} />
              {errors.itemDescription && <p className="text-sm text-destructive">{errors.itemDescription.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Price (NGN) *</Label>
              <Input id="price" type="number" step="0.01" {...register("price")} className="h-10" />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress" className="text-sm font-medium">Delivery Address</Label>
              <Input id="deliveryAddress" {...register("deliveryAddress")} className="h-10" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/orders")} className="h-10">Cancel</Button>
              <Button type="submit" disabled={createOrder.isPending} className="h-10">
                {createOrder.isPending ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
