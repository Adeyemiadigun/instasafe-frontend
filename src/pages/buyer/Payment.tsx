import { useState } from "react"
import { useParams } from "react-router-dom"
import api from "@/lib/api"
import { getApiErrorMessage } from "@/lib/errorHandler"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>()
  const [form, setForm] = useState({ buyerFirstName: "", buyerLastName: "", buyerEmail: "", buyerPhone: "" })
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post(`/buyers/orders/${orderId}/bank-debit/initiate`, form)
      const data = res.data
      setResult({ type: "success", message: data.otpMessage || "Payment initiated. Check your phone for OTP." })
    } catch (err) {
      setResult({ type: "error", message: getApiErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold font-[family-name:var(--font-display)]">InstaSafe</span>
      </div>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Payment</h1>
      {result ? (
        <Card className={result.type === "error" ? "border-red-200 bg-red-50/50" : "border-emerald-200 bg-emerald-50/50"}>
          <CardContent className="py-6 text-center space-y-3">
            {result.type === "success" ? (
              <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
            ) : (
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            )}
            <p className={`font-medium ${result.type === "success" ? "text-emerald-700" : "text-red-600"}`}>
              {result.message}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-base">Buyer Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label htmlFor="buyerFirstName" className="text-sm font-medium">First Name *</Label><Input id="buyerFirstName" value={form.buyerFirstName} onChange={update("buyerFirstName")} required className="h-10" /></div>
                <div className="space-y-2"><Label htmlFor="buyerLastName" className="text-sm font-medium">Last Name *</Label><Input id="buyerLastName" value={form.buyerLastName} onChange={update("buyerLastName")} required className="h-10" /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="buyerEmail" className="text-sm font-medium">Email *</Label><Input id="buyerEmail" type="email" value={form.buyerEmail} onChange={update("buyerEmail")} required className="h-10" /></div>
              <div className="space-y-2"><Label htmlFor="buyerPhone" className="text-sm font-medium">Phone *</Label><Input id="buyerPhone" value={form.buyerPhone} onChange={update("buyerPhone")} required className="h-10" /></div>
              <Button type="submit" className="w-full h-11" disabled={loading}>{loading ? "Processing..." : "Initiate Payment"}</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
