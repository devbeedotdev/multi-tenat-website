"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { Tenant } from "@/types/tenant";
import type { Result } from "@/types/result";
import { normalizeNigerianPhone } from "@/lib/validation/phone";
import {
  createTenantInDB,
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
 * Server action: verify cart password. Returns boolean; password never sent to the client.
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

/**
 * Super admin: create a new tenant from the /super-admin dashboard.
 * Validates input, enforces super admin session, and redirects with feedback.
 */
export async function createTenantAction(
  formData: FormData,
): Promise<void> {
  const cookieStore = cookies();
  const superSession = cookieStore.get("super_admin_session")?.value;

  if (!superSession) {
    redirect(
      `/super-admin?error=${encodeURIComponent(
        "Super admin session required",
      )}`,
    );
  }

  const rawTenantId = String(formData.get("tenantId") || "").trim();
  const tenantId = rawTenantId.toLowerCase();
  const businessName = String(formData.get("businessName") || "").trim();
  const businessEmail = String(formData.get("businessEmail") || "").trim();
  const adminPassword = String(formData.get("adminPassword") || "").trim();
  const primaryColor = String(formData.get("primaryColor") || "").trim();
  const rawBusinessPhone = String(
    formData.get("businessPhoneNumber") || "",
  ).trim();

  if (!tenantId || !businessName || !businessEmail || !adminPassword) {
    redirect(
      `/super-admin?error=${encodeURIComponent(
        "All fields are required to create a tenant.",
      )}`,
    );
  }

  // Basic tenantId validation: lowercase slug / domain-style
  const tenantIdPattern = /^[a-z0-9.-]+$/;
  if (!tenantIdPattern.test(tenantId)) {
    redirect(
      `/super-admin?error=${encodeURIComponent(
        "Tenant ID can only contain letters, numbers, dots and hyphens.",
      )}`,
    );
  }

  let normalizedBusinessPhone = "";
  if (rawBusinessPhone) {
    try {
      normalizedBusinessPhone = normalizeNigerianPhone(rawBusinessPhone);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Business phone must be an 11-digit Nigerian number.";
      redirect(`/super-admin?error=${encodeURIComponent(message)}`);
    }
  }

  const result: Result<Tenant> = await createTenantInDB({
    tenantId,
    businessName,
    businessEmail,
    adminPassword,
    primaryColor,
    businessPhoneNumber: normalizedBusinessPhone,
  });

  if (!result.ok) {
    redirect(`/super-admin?error=${encodeURIComponent(result.error)}`);
  }

  revalidatePath("/super-admin");
  redirect(
    `/super-admin?created=${encodeURIComponent(result.data.tenantId)}`,
  );
}
