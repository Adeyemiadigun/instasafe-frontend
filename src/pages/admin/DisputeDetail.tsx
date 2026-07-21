import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"
import { useDispute, useResolveDispute, useExecutePayout } from "@/hooks/useDisputes"
import DisputeDetailCard from "@/components/disputes/DisputeDetailCard"
import DisputeEvidence from "@/components/disputes/DisputeEvidence"
import AiSuggestion from "@/components/disputes/AiSuggestion"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/errorHandler"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

export default function DisputeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: dispute, isLoading } = useDispute(id || "")
  const resolveDispute = useResolveDispute(id || "")
  const executePayout = useExecutePayout(dispute?.orderId || "")
  const [adminNotes, setAdminNotes] = useState("")

  if (isLoading) return <LoadingSpinner message="Loading dispute..." />
  if (!dispute) return <div className="text-center py-12 text-muted-foreground">Dispute not found.</div>

  const handleResolve = async (resolution: "refund" | "release") => {
    try {
      await resolveDispute.mutateAsync({
        resolution,
        adminNotes: adminNotes || undefined,
        resolvedByUserId: user?.userId || "",
      })
      toast.success("Dispute resolved!")
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handlePayout = async () => {
    try {
      await executePayout.mutateAsync()
      toast.success("Payout executed successfully!")
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/admin/disputes")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Disputes
      </Button>

      <DisputeDetailCard dispute={dispute} />
      <DisputeEvidence evidenceUrls={dispute.evidenceUrls} />
      <AiSuggestion suggestion={null} />

      {dispute.status === "Open" || dispute.status === "UnderReview" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resolution Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminNotes">Admin Notes (optional)</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Add notes about your decision..."
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={() => handleResolve("refund")}
                disabled={resolveDispute.isPending}
              >
                {resolveDispute.isPending ? "Processing..." : "Refund Buyer"}
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => handleResolve("release")}
                disabled={resolveDispute.isPending}
              >
                {resolveDispute.isPending ? "Processing..." : "Release to Merchant"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : dispute.status === "ResolvedRelease" ? (
        <Card>
          <CardContent className="py-4">
            <Button
              onClick={handlePayout}
              disabled={executePayout.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {executePayout.isPending ? "Executing..." : "Execute Split Payout"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
