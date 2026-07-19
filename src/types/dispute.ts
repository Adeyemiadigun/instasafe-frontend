export type DisputeStatus =
  | "Open"
  | "UnderReview"
  | "ResolvedRefund"
  | "ResolvedRelease"
  | "Closed";

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
  createdAt: string;
}

export interface RaiseDisputePayload {
  orderId: string;
  buyerId: string;
  reason: string;
  evidenceUrls?: string;
}

export interface ResolveDisputePayload {
  resolution: string;
  adminNotes?: string;
  resolvedByUserId: string;
}

export interface PayoutResponse {
  totalAmount: number;
  merchantAmount: number;
  platformCommission: number;
  payoutStatus: string;
}
