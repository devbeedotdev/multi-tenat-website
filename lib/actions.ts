"use server";

import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import {
  getCartById as getCartByIdFromDal,
  getProductsByCategoryAndTenant,
  setCartPassword as setCartPasswordDal,
  syncCartToCloud as syncCartToCloudDal,
  verifyCartPassword as verifyCartPasswordDal,
} from "./dal";

/**
 * Server action: get products by tenant and category.
 */
export async function getProductsAction(
  tenantId: string,
  category?: string,
): Promise<Product[]> {
  return getProductsByCategoryAndTenant(tenantId, category);
}

/**
 * Server action: get cloud cart by phone number.
 * Used when user submits identity to check for existing cart (conflict resolution).
 */
export async function getCartById(phone: string): Promise<CartItem[] | null> {
  return getCartByIdFromDal(phone);
}

/**
 * Server action: sync local cart to cloud for cross-device persistence.
 */
export async function syncCartToCloud(
  cartId: string,
  items: CartItem[],
): Promise<void> {
  await syncCartToCloudDal(cartId, items);
}

/**
 * Server action: verify cart password. Returns boolean; password never sent to client.
 */
export async function verifyCartPassword(
  phone: string,
  password: string,
): Promise<boolean> {
  return verifyCartPasswordDal(phone, password);
}

/**
 * Server action: set cart password (sign up).
 */
export async function setCartPassword(
  phone: string,
  password: string,
): Promise<void> {
  await setCartPasswordDal(phone, password);
}
