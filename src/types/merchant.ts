import type { OrderStatus } from "./order";

export interface MerchantOrderResponse {
  id: string;
  orderReference: string;
  itemName: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
  buyerName: string | null;
}
