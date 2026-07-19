export type DeliverySessionStatusValue =
  | "PickedUp"
  | "Delivered"
  | "Failed"
  | "Expired";

export type DeliveryFailureReason =
  | "None"
  | "SessionMismatch"
  | "FingerprintMismatch"
  | "OrderMismatch"
  | "SessionExpired";

export interface QrCodesResponse {
  merchantQrToken: string;
  buyerQrToken: string;
}

export interface PickupSessionResponse {
  sessionId: string;
  status: DeliverySessionStatusValue;
  expiresAt: string;
}

export interface DeliveryConfirmResponse {
  status: DeliverySessionStatusValue;
  message: string;
}

export interface DeliverySessionStatus {
  sessionId: string;
  orderId: string;
  status: DeliverySessionStatusValue;
  pickupTimestamp: string | null;
  deliveryTimestamp: string | null;
  expiresAt: string | null;
  failureReason: DeliveryFailureReason | null;
}
