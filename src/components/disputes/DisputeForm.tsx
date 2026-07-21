import { useState } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { useRaiseDispute } from "@/hooks/useDisputes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface DisputeFormProps {
  orderId: string
  onSuccess?: () => void
}

export default function DisputeForm({ orderId, onSuccess }: DisputeFormProps) {
  const { user } = useAuth()
  const raiseDispute = useRaiseDispute()
  const [reason, setReason] = useState("")
  const [evidenceUrls, setEvidenceUrls] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      toast.error("Please provide a reason for the dispute.")
      return
    }
    try {
      const res = await raiseDispute.mutateAsync({
        orderId,
        buyerId: user?.userId || "",
        reason: reason.trim(),
        evidenceUrls: evidenceUrls.trim() || undefined,
      })
      const data = res.data
      if (data.succeeded) {
        toast.success("Dispute raised successfully.")
        setReason("")
        setEvidenceUrls("")
        onSuccess?.()
      } else {
        toast.error(data.errors?.[0] || "Failed to raise dispute.")
      }
    } catch (err) {
      toast.error("Failed to raise dispute. Please try again.")
      console.error("Dispute submission error:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold font-[family-name:var(--font-display)] tracking-tight">Raise a Dispute</h3>
      <p className="text-sm text-muted-foreground">
        Only raise a dispute if there is an issue with the order. You have 24 hours after delivery to raise a dispute.
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="reason" className="text-sm font-medium">Reason *</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="min-h-[80px]"
          placeholder="Describe the issue with this order..."
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="evidence" className="text-sm font-medium">Evidence URLs <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input
          id="evidence"
          value={evidenceUrls}
          onChange={(e) => setEvidenceUrls(e.target.value)}
          placeholder="Comma-separated links to evidence"
        />
      </div>
      <Button type="submit" variant="destructive" disabled={raiseDispute.isPending}>
        {raiseDispute.isPending ? "Submitting..." : "Raise Dispute"}
      </Button>
    </form>
  )
}
