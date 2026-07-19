export type OrderStatus =
  | "Draft"
  | "PendingPayment"
  | "FundedInEscrow"
  | "Dispatched"
  | "Delivered"
  | "Disputed"
  | "CompletedReleased"
  | "Refunded"
  | "Expired";

export interface OrderDetail {
  id: string;
  orderReference: string;
  itemName: string;
  itemDescription: string | null;
  itemImageUrl: string | null;
  price: number;
  currency: string;
  deliveryAddress: string | null;
  status: OrderStatus;
  escrowLinkUrl: string | null;
  fundedAt: string | null;
  deliveredAt: string | null;
  validationWindowExpiresAt: string | null;
  completedAt: string | null;
  createdAt: string;
  merchant: { id: string; businessName: string };
  buyer: { id: string; firstName: string; lastName: string; email: string; phone: string } | null;
  escrowTransaction: {
    monnifyTransactionReference: string | null;
    channel: string;
    amount: number;
    status: string;
    virtualAccountNumber: string | null;
    virtualBankCode: string | null;
    fundedAt: string | null;
  } | null;
  deliverySession: {
    sessionId: string;
    status: string;
    pickupTimestamp: string | null;
    deliveryTimestamp: string | null;
  } | null;
  dispute: {
    id: string;
    reason: string;
    status: string;
    resolvedAt: string | null;
  } | null;
}

export interface CreateOrderPayload {
  merchantId: string;
  itemName: string;
  itemDescription?: string;
  itemImageUrl?: string;
  price: number;
  deliveryAddress?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  orderReference: string;
}

export interface EscrowLinkPayload {
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone: string;
}

export interface EscrowLinkResponse {
  orderId: string;
  virtualAccountNumber: string;
  virtualBankCode: string;
  expiresAt: string;
}
