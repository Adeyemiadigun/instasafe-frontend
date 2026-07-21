import type { OrderStatus, DisputeStatus, ChatbotState } from "@/types";

export const DISPUTE_STATUS_COLORS: Record<DisputeStatus, string> = {
  Open: "bg-muted text-muted-foreground",
  UnderReview: "bg-muted text-muted-foreground",
  ResolvedRefund: "bg-muted text-muted-foreground",
  ResolvedRelease: "bg-muted text-muted-foreground",
  Closed: "bg-muted text-muted-foreground",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Draft: "Draft",
  PendingPayment: "Pending Payment",
  FundedInEscrow: "Funded in Escrow",
  Dispatched: "Dispatched",
  Delivered: "Delivered",
  Disputed: "Disputed",
  CompletedReleased: "Completed",
  Refunded: "Refunded",
  Expired: "Expired",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  PendingPayment: "bg-muted text-muted-foreground",
  FundedInEscrow: "bg-muted text-muted-foreground",
  Dispatched: "bg-muted text-muted-foreground",
  Delivered: "bg-muted text-muted-foreground",
  Disputed: "bg-muted text-muted-foreground",
  CompletedReleased: "bg-muted text-muted-foreground",
  Refunded: "bg-muted text-muted-foreground",
  Expired: "bg-muted text-muted-foreground",
};

export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  Open: "Open",
  UnderReview: "Under Review",
  ResolvedRefund: "Resolved (Refund)",
  ResolvedRelease: "Resolved (Release)",
  Closed: "Closed",
};

export const CHATBOT_STATE_LABELS: Record<ChatbotState, string> = {
  Idle: "Idle",
  AwaitingOrderAmount: "Awaiting Amount",
  AwaitingOrderDescription: "Awaiting Description",
  AwaitingOrderBuyerEmail: "Awaiting Buyer Email",
  ConfirmingOrder: "Confirming Order",
  AwaitingOrderStatusReference: "Checking Status",
};
