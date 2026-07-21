import { useState } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api from "@/lib/api"
import { getApiErrorMessage } from "@/lib/errorHandler"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, ShieldCheck } from "lucide-react"

const paymentSchema = z.object({
  buyerFirstName: z.string().min(1, "First name is required"),
  buyerLastName: z.string().min(1, "Last name is required"),
  buyerEmail: z.string().min(1, "Email is required").email("Invalid email address"),
  buyerPhone: z.string().min(10, "Valid phone number required"),
})

type PaymentFormData = z.infer<typeof paymentSchema>

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>()
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  })

  const onSubmit = async (data: PaymentFormData) => {
    setLoading(true)
    try {
      const res = await api.post(`/buyers/orders/${orderId}/bank-debit/initiate`, data)
      const resData = res.data
      setResult({ type: "success", message: resData.otpMessage || "Payment initiated. Check your phone for OTP." })
    } catch (err) {
      setResult({ type: "error", message: getApiErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">InstaSafe</span>
        </div>

        {result ? (
          <Card>
            <CardContent className="py-10 text-center space-y-4">
              {result.type === "success" ? (
                <CheckCircle className="h-8 w-8 text-primary mx-auto" />
              ) : (
                <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
              )}
              <p className={`font-medium text-lg ${result.type === "success" ? "text-foreground" : "text-destructive"}`}>
                {result.message}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Buyer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="buyerFirstName" className="text-sm font-medium">First Name *</Label>
                    <Input id="buyerFirstName" {...register("buyerFirstName")} />
                    {errors.buyerFirstName && <p className="text-xs text-destructive">{errors.buyerFirstName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="buyerLastName" className="text-sm font-medium">Last Name *</Label>
                    <Input id="buyerLastName" {...register("buyerLastName")} />
                    {errors.buyerLastName && <p className="text-xs text-destructive">{errors.buyerLastName.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buyerEmail" className="text-sm font-medium">Email *</Label>
                  <Input id="buyerEmail" type="email" {...register("buyerEmail")} />
                  {errors.buyerEmail && <p className="text-xs text-destructive">{errors.buyerEmail.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buyerPhone" className="text-sm font-medium">Phone *</Label>
                  <Input id="buyerPhone" {...register("buyerPhone")} />
                  {errors.buyerPhone && <p className="text-xs text-destructive">{errors.buyerPhone.message}</p>}
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                  {loading ? "Processing..." : "Initiate Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
