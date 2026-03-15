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
  const currentPlan = String(formData.get("currentPlan") || "Starter").trim();
  const imageSizeLimitMbRaw = String(
    formData.get("imageSizeLimitMb") || "5",
  ).trim();
  const videoSizeLimitMbRaw = String(
    formData.get("videoSizeLimitMb") || "10",
  ).trim();
  const cloudinaryName = String(formData.get("cloudinaryName") || "").trim();
  const cloudinaryKey = String(formData.get("cloudinaryKey") || "").trim();
  const cloudinarySecret = String(
    formData.get("cloudinarySecret") || "",
  ).trim();

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/95122c88-1964-458a-a916-5e32205c060c", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "1a2a77",
    },
    body: JSON.stringify({
      sessionId: "1a2a77",
      runId: "tenant-create-1",
      hypothesisId: "H1",
      location: "lib/actions.ts:createTenantAction:entry",
      message: "createTenantAction called",
      data: {
        tenantId,
        hasBusinessName: !!businessName,
        hasBusinessEmail: !!businessEmail,
        hasAdminPassword: !!adminPassword,
        plan: currentPlan,
        imageSizeLimitMbRaw,
        videoSizeLimitMbRaw,
        hasCloudinaryName: !!cloudinaryName,
        hasCloudinaryKey: !!cloudinaryKey,
        hasCloudinarySecret: !!cloudinarySecret,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  if (
    !tenantId ||
    !businessName ||
    !businessEmail ||
    !adminPassword ||
    !cloudinaryName ||
    !cloudinaryKey ||
    !cloudinarySecret
  ) {
    redirect(
      `/super-admin?error=${encodeURIComponent(
        "All fields are required to create a tenant, including Cloudinary credentials.",
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

  const imageSizeLimitMb = Number(imageSizeLimitMbRaw);
  const videoSizeLimitMb = Number(videoSizeLimitMbRaw);

  if (
    !Number.isFinite(imageSizeLimitMb) ||
    imageSizeLimitMb <= 0 ||
    !Number.isFinite(videoSizeLimitMb) ||
    videoSizeLimitMb <= 0
  ) {
    redirect(
      `/super-admin?error=${encodeURIComponent(
        "Image and video size limits must be positive numbers (in MB).",
      )}`,
    );
  }

  const imageSizeLimitBytes = Math.round(imageSizeLimitMb * 1024 * 1024);
  const videoSizeLimitBytes = Math.round(videoSizeLimitMb * 1024 * 1024);

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
    currentPlan,
    imageSizeLimit: imageSizeLimitBytes,
    videoSizeLimit: videoSizeLimitBytes,
    cloudinaryName,
    cloudinaryKey,
    cloudinarySecret,
  });

  if (!result.ok) {
    redirect(`/super-admin?error=${encodeURIComponent(result.error)}`);
  }

  revalidatePath("/super-admin");
  redirect(
    `/super-admin?created=${encodeURIComponent(result.data.tenantId)}`,
  );
}
