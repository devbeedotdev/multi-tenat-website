"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createProduct,
  deleteProductForTenant,
  getTenantByDomain,
  updateProductCollection,
  updateTenantInDB,
} from "@/lib/dal";
import { generateProductDetails } from "@/lib/services/ai";
import {
  zAdminProductPayload,
  zProductCollection,
} from "@/lib/validation/product";
import type { Product } from "@/types/product";
import type { ProductDetailItem } from "@/types/product-detail";
import type { Result } from "@/types/result";
import type { Tenant } from "@/types/tenant";
import { normalizeNigerianPhone } from "@/lib/validation/phone";
import type { AiProductDetails } from "@/lib/services/ai";

export async function generateProductDetailsAction(params: {
  productName: string;
  category: string;
  features?: string[];
}): Promise<Result<AiProductDetails>> {
  return generateProductDetails(params);
}

export async function requireAdminTenantForDomain(domain: string) {
  const normalizedDomain = domain.toLowerCase();
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session || session !== normalizedDomain) {
    redirect(`/${normalizedDomain}/admin/login`);
  }

  const tenantResult = await getTenantByDomain(session);
  if (!tenantResult.ok || !tenantResult.data) {
    redirect(`/${normalizedDomain}/admin/login`);
  }

  return tenantResult.data;
}

export async function handleBulkUpdate(domain: string, formData: FormData) {
  const tenant = await requireAdminTenantForDomain(domain);
  const payload = String(formData.get("payload") || "");
  const basePath = `/${domain.toLowerCase()}/admin/dashboard`;

  if (!payload) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "No changes detected in payload",
      )}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload) as Product[];
  } catch {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "Unable to parse changes payload",
      )}`,
    );
  }

  const result = zProductCollection.safeParse(parsed);
  if (!result.success) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "One or more products are invalid. Please review your changes.",
      )}`,
    );
  }

  await updateProductCollection(tenant.tenantId, result.data);
  revalidatePath(basePath);
  redirect(
    `${basePath}?success=${encodeURIComponent(
      "Products updated successfully",
    )}`,
  );
}

export async function handleCreateProduct(domain: string, formData: FormData) {
  const tenant = await requireAdminTenantForDomain(domain);
  const basePath = `/${domain.toLowerCase()}/admin/dashboard`;

  const payload = String(formData.get("payload") || "");
  if (!payload) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "No product data provided",
      )}#add-product`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload) as {
      productName: string;
      productCategory: string;
      productAmount: number;
      quantityAvailable: number;
      currency?: string;
      isPromo: boolean;
      isNegotiable: boolean;
      isBestSelling: boolean;
      isDetailsTabular: boolean;
      mediaUrls: string[];

      shortDescription: string;
      fullDescription: string;
      productDetails: ProductDetailItem[];
    };
  } catch {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "Unable to parse product payload",
      )}#add-product`,
    );
  }

  const result = zAdminProductPayload.safeParse(parsed);
  if (!result.success) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "Product data is invalid. Please check required fields.",
      )}#add-product`,
    );
  }

  const {
    productName,
    productCategory,
    productAmount,
    quantityAvailable,
    currency,
    isPromo,
    isNegotiable,
    isBestSelling,
    isDetailsTabular,
    mediaUrls,
    shortDescription,
    fullDescription,
    productDetails,
  } = result.data;

  await createProduct({
    tenantId: tenant.tenantId,
    productName,
    productCategory,
    productAmount,
    discountPrice: 0,
    isDetailsTabular,
    quantityAvailable,
    isNegotiable,
    isPromo,
    isBestSelling,
    productDetails: productDetails ?? [],
    mediaUrls: mediaUrls ?? [],
    shortDescription,
    fullDescription,
    currency: currency || "₦",
  });
  revalidatePath(basePath);
  redirect(
    `${basePath}?success=${encodeURIComponent(
      "Product created successfully",
    )}#products-table`,
  );
}

export async function handleDeleteProduct(
  domain: string,
  formData: FormData,
) {
  const tenant = await requireAdminTenantForDomain(domain);
  const basePath = `/${domain.toLowerCase()}/admin/dashboard`;

  const productId = String(formData.get("productId") || "").trim();
  if (!productId) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "No product selected for deletion",
      )}`,
    );
  }

  const ok = await deleteProductForTenant(tenant.tenantId, productId);
  revalidatePath(basePath);

  if (!ok) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "Unable to delete product. It may have already been removed.",
      )}`,
    );
  }

  redirect(
    `${basePath}?success=${encodeURIComponent("Product deleted successfully")}`,
  );
}

type TenantSettingsInput = Pick<
  Tenant,
  | "businessName"
  | "websiteDisplayName"
  | "businessEmail"
  | "businessPhoneNumber"
  | "businessDescription"
  | "variant"
  | "primaryColor"
  | "logoUrl"
  | "favIcon"
  | "isLogoHorizontal"
  | "accountName"
  | "bankAccountNumber"
  | "bankName"
  | "currentPlan"
  | "imageSizeLimit"
  | "videoSizeLimit"
  | "cloudinaryName"
  | "cloudinaryKey"
  | "cloudinarySecret"
>;

export async function updateTenantSettings(
  domain: string,
  formData: FormData,
) {
  const tenant = await requireAdminTenantForDomain(domain);
  const normalizedDomain = domain.toLowerCase();
  const basePath = `/${normalizedDomain}/admin/settings`;

  const get = (key: string, fallback: string): string =>
    String(formData.get(key) ?? fallback).trim();

  const variantRaw = get("variant", tenant.variant);
  const variant: Tenant["variant"] =
    variantRaw === "B" || variantRaw === "C" ? variantRaw : "A";

  const isLogoHorizontalRaw = formData.get("isLogoHorizontal");
  const isLogoHorizontal =
    isLogoHorizontalRaw === "yes" || isLogoHorizontalRaw === "true";

  const rawBusinessPhone = get(
    "businessPhoneNumber",
    tenant.businessPhoneNumber,
  );

  let normalizedBusinessPhone = tenant.businessPhoneNumber;
  if (rawBusinessPhone) {
    try {
      normalizedBusinessPhone = normalizeNigerianPhone(rawBusinessPhone);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Business phone must be an 11-digit Nigerian number.";
      redirect(
        `${basePath}?error=${encodeURIComponent(message)}&settingsSaved=0`,
      );
    }
  }

  // Limits in MB (only present for super admin store settings UI).
  const imageSizeLimitMbRaw = get(
    "imageSizeLimitMb",
    tenant.imageSizeLimit
      ? String(Math.round(tenant.imageSizeLimit / (1024 * 1024)))
      : "5",
  );
  const videoSizeLimitMbRaw = get(
    "videoSizeLimitMb",
    tenant.videoSizeLimit
      ? String(Math.round(tenant.videoSizeLimit / (1024 * 1024)))
      : "10",
  );

  let imageSizeLimit: number | undefined;
  let videoSizeLimit: number | undefined;

  if (imageSizeLimitMbRaw) {
    const mb = Number(imageSizeLimitMbRaw);
    if (!Number.isFinite(mb) || mb <= 0) {
      redirect(
        `${basePath}?error=${encodeURIComponent(
          "Image size limit must be a positive number (in MB).",
        )}&settingsSaved=0`,
      );
    }
    imageSizeLimit = Math.round(mb * 1024 * 1024);
  }

  if (videoSizeLimitMbRaw) {
    const mb = Number(videoSizeLimitMbRaw);
    if (!Number.isFinite(mb) || mb <= 0) {
      redirect(
        `${basePath}?error=${encodeURIComponent(
          "Video size limit must be a positive number (in MB).",
        )}&settingsSaved=0`,
      );
    }
    videoSizeLimit = Math.round(mb * 1024 * 1024);
  }

  const updates: TenantSettingsInput = {
    businessName: get("businessName", tenant.businessName),
    websiteDisplayName: get("websiteDisplayName", tenant.websiteDisplayName),
    businessEmail: get("businessEmail", tenant.businessEmail),
    businessPhoneNumber: normalizedBusinessPhone,
    businessDescription: get(
      "businessDescription",
      tenant.businessDescription,
    ),
    variant,
    primaryColor: get("primaryColor", tenant.primaryColor),
    logoUrl: get("logoUrl", tenant.logoUrl ?? ""),
    favIcon: get("favIcon", tenant.favIcon),
    isLogoHorizontal,
    accountName: get("accountName", tenant.accountName),
    bankAccountNumber: get("bankAccountNumber", tenant.bankAccountNumber),
    bankName: get("bankName", tenant.bankName),
    currentPlan: get("currentPlan", tenant.currentPlan ?? "Starter") as
      | "Starter"
      | "Advanced",
    imageSizeLimit,
    videoSizeLimit,
    cloudinaryName: get("cloudinaryName", tenant.cloudinaryName ?? ""),
    cloudinaryKey: get("cloudinaryKey", tenant.cloudinaryKey ?? ""),
    cloudinarySecret: get(
      "cloudinarySecret",
      tenant.cloudinarySecret ?? "",
    ),
  };

  await updateTenantInDB(tenant.tenantId, updates);

  // Revalidate key paths affected by branding and payment settings.
  revalidatePath(`/${normalizedDomain}`);
  revalidatePath(`/${normalizedDomain}/admin/dashboard`);
  revalidatePath(basePath);

  redirect(`${basePath}?settingsSaved=1`);
}
