export type ChatbotState =
  | "Idle"
  | "AwaitingOrderAmount"
  | "AwaitingOrderDescription"
  | "AwaitingOrderBuyerEmail"
  | "ConfirmingOrder"
  | "AwaitingOrderStatusReference";

export interface ChatbotSession {
  id: string;
  phoneNumber: string;
  currentState: ChatbotState;
  lastInteractionAt: string;
  temporaryData: string | null;
}
