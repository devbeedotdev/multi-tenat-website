import type { CartItem } from "@/types/cart";

export type OrderStatus = "pending" | "paid" | "failed";

export interface Order {
  orderId: string;
  tenantId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paystackReference?: string;
}

