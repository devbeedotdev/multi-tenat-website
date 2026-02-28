/**
 * Paystack integration placeholder.
 * Use for card/bank payments via Paystack.
 */

export type PaystackMetadata = Record<string, string | number | undefined>;

/**
 * Initialize Paystack checkout (inline or redirect).
 * @param amount - Amount in minor units (e.g. kobo for NGN)
 * @param email - Customer email
 * @param metadata - Optional metadata (e.g. orderId, cartId)
 */
export function initializePaystackCheckout(
  amount: number,
  email: string,
  metadata?: PaystackMetadata,
): void {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    console.warn("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set");
  }
  // TODO: Replace with real Paystack Inline JS or Redirect URL logic.
  // See https://paystack.com/docs/payments/accept-payments/
  void amount;
  void email;
  void metadata;
}
