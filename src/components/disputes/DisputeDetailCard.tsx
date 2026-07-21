import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { DISPUTE_STATUS_LABELS, DISPUTE_STATUS_COLORS } from "@/lib/constants"
import type { Dispute } from "@/types/dispute"

interface DisputeDetailCardProps {
  dispute: Dispute
}

export default function DisputeDetailCard({ dispute }: DisputeDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dispute Details</CardTitle>
          <Badge variant="outline" className={DISPUTE_STATUS_COLORS[dispute.status]}>
            {DISPUTE_STATUS_LABELS[dispute.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-0 text-sm">
        <div className="flex justify-between py-2.5 border-b border-border/50">
          <span className="text-muted-foreground">Order Reference</span>
          <span className="font-medium">{dispute.orderReference}</span>
        </div>
        <div className="flex justify-between py-2.5 border-b border-border/50">
          <span className="text-muted-foreground">Buyer</span>
          <span className="font-medium">{dispute.buyerName}</span>
        </div>
        <div className="flex justify-between py-2.5 border-b border-border/50">
          <span className="text-muted-foreground">Raised</span>
          <span className="tabular-nums">{formatDate(dispute.createdAt)}</span>
        </div>
        {dispute.resolvedAt && (
          <div className="flex justify-between py-2.5 border-b border-border/50">
            <span className="text-muted-foreground">Resolved</span>
            <span className="tabular-nums">{formatDate(dispute.resolvedAt)}</span>
          </div>
        )}
        <div className="py-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Reason</p>
          <p className="leading-relaxed">{dispute.reason}</p>
        </div>
        {dispute.resolution && (
          <div className="py-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Resolution</p>
            <p className="leading-relaxed">{dispute.resolution}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
