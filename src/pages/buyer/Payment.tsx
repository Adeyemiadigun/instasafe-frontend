import { useState } from "react"
import { useParams } from "react-router-dom"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>()
  const [form, setForm] = useState({ buyerFirstName: "", buyerLastName: "", buyerEmail: "", buyerPhone: "" })
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post(`/buyers/orders/${orderId}/bank-debit/initiate`, form)
      const data = res.data
      if (data.succeeded) {
        setResult(data.data?.otpMessage || "Payment initiated. Check your phone for OTP.")
      } else {
        setResult(data.errors?.[0] || "Payment failed.")
      }
    } catch {
      setResult("Payment initiation failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Payment</h1>
      {result ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-emerald-600 font-medium">{result}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-base">Buyer Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>First Name *</Label><Input value={form.buyerFirstName} onChange={update("buyerFirstName")} required /></div>
                <div className="space-y-1"><Label>Last Name *</Label><Input value={form.buyerLastName} onChange={update("buyerLastName")} required /></div>
              </div>
              <div className="space-y-1"><Label>Email *</Label><Input type="email" value={form.buyerEmail} onChange={update("buyerEmail")} required /></div>
              <div className="space-y-1"><Label>Phone *</Label><Input value={form.buyerPhone} onChange={update("buyerPhone")} required /></div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Processing..." : "Initiate Payment"}</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
