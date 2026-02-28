import type { CartItem } from "@/types/cart";

/**
 * Merge local and cloud cart items by productId; sum quantities, cap by quantityAvailable.
 */
export function mergeCartItems(local: CartItem[], cloud: CartItem[]): CartItem[] {
  const byId = new Map<string, CartItem>();
  for (const item of local) {
    byId.set(item.productId, { ...item });
  }
  for (const item of cloud) {
    const existing = byId.get(item.productId);
    if (existing) {
      existing.selectedQuantity = Math.min(
        existing.quantityAvailable,
        existing.selectedQuantity + item.selectedQuantity,
      );
    } else {
      byId.set(item.productId, { ...item });
    }
  }
  return Array.from(byId.values());
}
