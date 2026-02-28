import type { Product } from "./product";

/**
 * Cart item: product plus selected quantity for checkout.
 * Used by CartContext and cart UI; all product interactions use this type.
 */
export type CartItem = Product & {
  selectedQuantity: number;
};

/**
 * Soft-identity: user identified by phone (cartId) and name (cartName).
 * Persisted in localStorage; password is never stored locally and is only
 * used during sign-up/login and verified via DAL (verifyCartPassword).
 */
export type UserIdentity = {
  cartId: string;
  cartName: string;
};
