import type { OrderStatus, DisputeStatus, ChatbotState } from "@/types";

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
  Draft: "bg-stone-100 text-stone-600",
  PendingPayment: "bg-amber-50 text-amber-700 border-amber-200",
  FundedInEscrow: "bg-sky-50 text-sky-700 border-sky-200",
  Dispatched: "bg-violet-50 text-violet-700 border-violet-200",
  Delivered: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Disputed: "bg-red-50 text-red-700 border-red-200",
  CompletedReleased: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Refunded: "bg-orange-50 text-orange-700 border-orange-200",
  Expired: "bg-stone-100 text-stone-500",
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
