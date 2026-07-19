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
  Draft: "bg-gray-100 text-gray-700",
  PendingPayment: "bg-yellow-100 text-yellow-700",
  FundedInEscrow: "bg-blue-100 text-blue-700",
  Dispatched: "bg-purple-100 text-purple-700",
  Delivered: "bg-indigo-100 text-indigo-700",
  Disputed: "bg-red-100 text-red-700",
  CompletedReleased: "bg-green-100 text-green-700",
  Refunded: "bg-orange-100 text-orange-700",
  Expired: "bg-gray-100 text-gray-500",
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
