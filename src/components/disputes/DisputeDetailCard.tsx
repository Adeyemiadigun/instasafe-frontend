import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { DISPUTE_STATUS_LABELS } from "@/lib/constants"
import type { Dispute, DisputeStatus } from "@/types/dispute"

const STATUS_COLORS: Record<DisputeStatus, string> = {
  Open: "bg-red-100 text-red-700",
  UnderReview: "bg-yellow-100 text-yellow-700",
  ResolvedRefund: "bg-orange-100 text-orange-700",
  ResolvedRelease: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-700",
}

interface DisputeDetailCardProps {
  dispute: Dispute
}

export default function DisputeDetailCard({ dispute }: DisputeDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dispute Details</CardTitle>
          <Badge variant="outline" className={STATUS_COLORS[dispute.status]}>
            {DISPUTE_STATUS_LABELS[dispute.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Reference</span>
          <span className="font-medium">{dispute.orderReference}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Buyer</span>
          <span>{dispute.buyerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Raised</span>
          <span>{formatDate(dispute.createdAt)}</span>
        </div>
        {dispute.resolvedAt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Resolved</span>
            <span>{formatDate(dispute.resolvedAt)}</span>
          </div>
        )}
        <div className="pt-2 border-t">
          <p className="text-muted-foreground mb-1">Reason</p>
          <p>{dispute.reason}</p>
        </div>
        {dispute.resolution && (
          <div className="pt-2 border-t">
            <p className="text-muted-foreground mb-1">Resolution</p>
            <p>{dispute.resolution}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
