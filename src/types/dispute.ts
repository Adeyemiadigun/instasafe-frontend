export type DisputeStatus =
  | "Open"
  | "UnderReview"
  | "ResolvedRefund"
  | "ResolvedRelease"
  | "Closed";

export type PayoutStatus = "Pending" | "Processing" | "Completed" | "Failed";

export interface Dispute {
  id: string;
  orderId: string;
  orderReference: string;
  raisedByBuyerId: string;
  buyerName: string;
  reason: string;
  evidenceUrls: string | null;
  status: DisputeStatus;
  resolution: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
  aiConfidenceScore: number | null;
  aiAnalysisSummary: string | null;
  createdAt: string;
}

export interface RaiseDisputePayload {
  orderId: string;
  buyerId: string;
  reason: string;
  evidenceUrls?: string;
}

export interface RaiseDisputeResponse {
  disputeId: string;
  status: DisputeStatus;
  message: string;
}

export interface ResolveDisputePayload {
  resolution: string;
  adminNotes?: string;
  resolvedByUserId: string;
}

export interface ResolveDisputeResponse {
  outcome: "Refunded" | "Released";
  message: string;
}

export interface PayoutResponse {
  totalAmount: number;
  merchantAmount: number;
  platformCommission: number;
  payoutStatus: PayoutStatus;
}
