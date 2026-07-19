import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/providers/AuthProvider"
import { useCreateOrder } from "@/hooks/useOrders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    const res = await createOrder.mutateAsync({
      merchantId: user.userId,
      itemName: data.itemName,
      itemDescription: data.itemDescription || undefined,
      price: data.price,
      deliveryAddress: data.deliveryAddress || undefined,
    })
    const result = res.data
    if (result.succeeded && result.data) {
      toast.success("Order created!")
      navigate(`/dashboard/orders/${result.data.orderId}`)
    } else {
      toast.error(result.errors?.[0] || "Failed to create order.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Order</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name *</Label>
              <Input id="itemName" {...register("itemName")} />
              {errors.itemName && <p className="text-sm text-destructive">{errors.itemName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemDescription">Description</Label>
              <textarea id="itemDescription" {...register("itemDescription")} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              {errors.itemDescription && <p className="text-sm text-destructive">{errors.itemDescription.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (NGN) *</Label>
              <Input id="price" type="number" step="0.01" {...register("price")} />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Input id="deliveryAddress" {...register("deliveryAddress")} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/orders")}>Cancel</Button>
              <Button type="submit" disabled={createOrder.isPending}>
                {createOrder.isPending ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
