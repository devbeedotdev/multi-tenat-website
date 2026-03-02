import type { CartItem } from "@/types/cart";
import { getCartById, setCartPassword, verifyCartPassword } from "@/lib/actions";

export type IdentityResolutionResult =
  | { status: "new_cart" }
  | { status: "password_mismatch" }
  | { status: "existing_cart"; cloudCart: CartItem[] };

export async function resolveCartIdentity(
  phone: string,
  name: string,
  password: string,
  setIdentity: (id: string, name: string) => void,
  setAuthenticated: (value: boolean) => void,
): Promise<IdentityResolutionResult> {
  const cloudCart = await getCartById(phone);
  const cloudHasCart = cloudCart != null && cloudCart.length > 0;

  if (!cloudHasCart) {
    await setCartPassword(phone, password);
    setIdentity(phone, name);
    setAuthenticated(true);
    return { status: "new_cart" };
  }

  const ok = await verifyCartPassword(phone, password);
  if (!ok) {
    return { status: "password_mismatch" };
  }

  setIdentity(phone, name);
  setAuthenticated(true);
  return { status: "existing_cart", cloudCart: cloudCart ?? [] };
}

