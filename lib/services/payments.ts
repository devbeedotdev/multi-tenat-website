import type { CartItem } from "@/types/cart";
import type { Tenant } from "@/types/tenant";

/**
 * Simulated Paystack checkout.
 *
 * For now this lives as a client-safe utility that simply waits for
 * a short period and resolves successfully. In production, this
 * module can be refactored to delegate to a server-side order +
 * Paystack orchestration flow while keeping the UI call site stable.
 */
export async function processCheckout(
  _tenant: Tenant,
  _items: CartItem[],
  _totalAmount: number,
): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { success: true };
}

