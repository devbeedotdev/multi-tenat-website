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

export interface LandingOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
  productType: string;
  amount: number;
  status: OrderStatus;
  paystackReference?: string;
  createdAt: string;
}

