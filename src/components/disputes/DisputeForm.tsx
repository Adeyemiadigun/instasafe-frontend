import { useState } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { useRaiseDispute } from "@/hooks/useDisputes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"

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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-semibold">Raise a Dispute</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Only raise a dispute if there is an issue with the order. You have 24 hours after delivery to raise a dispute.
      </p>
      <div className="space-y-2">
        <Label htmlFor="reason">Reason *</Label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Describe the issue with this order..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="evidence">Evidence URLs (optional)</Label>
        <input
          id="evidence"
          type="text"
          value={evidenceUrls}
          onChange={(e) => setEvidenceUrls(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Comma-separated links to evidence"
        />
      </div>
      <Button type="submit" variant="destructive" disabled={raiseDispute.isPending}>
        {raiseDispute.isPending ? "Submitting..." : "Raise Dispute"}
      </Button>
    </form>
  )
}
