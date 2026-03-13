/**
 * Data Access Layer (DAL)
 *
 * This is the ONLY file allowed to import from mock-db.ts or (later) Prisma.
 * All UI components and Page files must fetch data through this layer.
 */

import { MAIN_DOMAIN } from "@/lib/config/platform";
import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/types/cart";
import type { LandingOrder, Order, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { Result } from "@/types/result";
import type { Tenant } from "@/types/tenant";
import { cloudCartPasswords, cloudCarts } from "./mock-db";

type PasswordResetRecord = {
  tenantId: string;
  otpHash: string;
  createdAt: number;
};

const PASSWORD_RESET_TTL_MS = 10 * 60 * 1000;

// In-memory password reset store keyed by tenantId (domain)
const passwordResets: Record<string, PasswordResetRecord> = {};

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function mapTenantRecord(record: any): Tenant {
  return {
    businessName: record.businessName,
    tenantId: record.tenantId,
    accountName: record.accountName,
    businessPhoneNumber: record.businessPhoneNumber,
    businessEmail: record.businessEmail,
    adminPassword: record.adminPassword,
    variant: record.variant as Tenant["variant"],
    primaryColor: record.primaryColor,
    businessDescription: record.businessDescription,
    websiteDisplayName: record.websiteDisplayName,
    bankAccountNumber: record.bankAccountNumber,
    bankName: record.bankName,
    favIcon: record.favIcon,
    logoUrl: record.logoUrl ?? undefined,
    isLogoHorizontal: record.isLogoHorizontal,
    currency: record.currency,
    seoTitle: record.seoTitle ?? undefined,
    seoDescription: record.seoDescription ?? undefined,
    seoKeywords: record.seoKeywords ?? undefined,
    createdAt: record.createdAt.toISOString(),
  };
}

function mapProductRecord(record: any): Product {
  return {
    productId: record.productId,
    tenantId: record.tenantId,
    productName: record.productName,
    productCategory: record.productCategory,
    productAmount: record.productAmount,
    discountPrice: record.discountPrice ?? undefined,
    isDetailsTabular: record.isDetailsTabular,
    quantityAvailable: record.quantityAvailable,
    isNegotiable: record.isNegotiable,
    isPromo: record.isPromo,
    isBestSelling: record.isBestSelling,
    productDetails: (record.productDetails as Product["productDetails"]) ?? [],
    mediaUrls: record.mediaUrls ?? [],
    shortDescription: record.shortDescription,
    fullDescription: record.fullDescription,
    currency: record.currency ?? undefined,
  };
}

/**
 * Get tenant configuration by domain
 * @param domain - The domain/hostname (e.g., "localhost", "client-a.com")
 */
export async function getTenantConfig(domain: string): Promise<Result<Tenant>> {
  const normalized = domain.split(":")[0].toLowerCase();

  try {
    const record = await prisma.tenant.findUnique({
      where: { tenantId: normalized },
    });

    if (!record) {
      return {
        ok: false,
        error: `Tenant not found for domain "${normalized}"`,
      };
    }

    return { ok: true, data: mapTenantRecord(record) };
  } catch (error) {
    console.error("getTenantConfig failed:", error);
    return {
      ok: false,
      error: "Failed to load tenant configuration.",
    };
  }
}

/**
 * Get tenant by domain (Result wrapper)
 */
export async function getTenantByDomain(
  domain: string,
): Promise<Result<Tenant>> {
  return getTenantConfig(domain);
}

/** Hosts that must never be treated as tenant domains for routing (Caddy, local dev) */
const ROUTING_RESERVED_HOSTS = ["localhost", "127.0.0.1", "::1"];

/**
 * Check if a tenant exists for the given domain.
 *
 * This is a lightweight function for middleware and other edge cases
 * that need to check tenant existence without fetching full tenant data.
 * Returns false for localhost/server IP to prevent them from being rewritten as tenants.
 */
export async function tenantExists(domain: string): Promise<Result<boolean>> {
  const normalized = domain.split(":")[0].toLowerCase();

  if (ROUTING_RESERVED_HOSTS.includes(normalized)) {
    return { ok: true, data: false };
  }

  try {
    const count = await prisma.tenant.count({
      where: { tenantId: normalized },
    });
    return { ok: true, data: count > 0 };
  } catch (error) {
    console.error("tenantExists failed:", error);
    return {
      ok: false,
      error: "Failed to check tenant existence.",
    };
  }
}

function toCanonicalHost(hostname: string): string {
  const lower = hostname.toLowerCase();
  return lower.startsWith("www.") ? lower.slice(4) : lower;
}

/**
 * Check if a given hostname belongs to the main platform domain.
 * Used to gate access to the super admin console.
 */
export function isMainPlatformDomain(domain: string): boolean {
  const main = toCanonicalHost(MAIN_DOMAIN);
  const candidate = toCanonicalHost(domain.split(":")[0]);
  return candidate === main;
}

export type SuperAdminSettings = {
  /** Domain of the main platform (now backed by SuperAdmin.id) */
  domain: string;
  email: string;
  phoneNumber?: string;
  landingSeoTitle?: string;
  landingSeoDescription?: string;
  landingSeoKeywords?: string;
  createdAt?: string;
};

export async function getSuperAdminSettings(): Promise<
  Result<SuperAdminSettings>
> {
  try {
    const record = await prisma.superAdmin.findFirst();

    if (!record) {
      return {
        ok: false,
        error: "Super admin record not found in the database.",
      };
    }

    return {
      ok: true,
      data: {
        domain: String(record.id),
        email: record.email,
        phoneNumber: record.phoneNumber,
        landingSeoTitle: record.landingSeoTitle ?? undefined,
        landingSeoDescription: record.landingSeoDescription ?? undefined,
        landingSeoKeywords: record.landingSeoKeywords ?? undefined,
        createdAt: record.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("getSuperAdminSettings failed:", error);
    return {
      ok: false,
      error: "Failed to load super admin settings.",
    };
  }
}

export async function updateSuperAdminSettings(
  updates: Partial<Omit<SuperAdminSettings, "domain">>,
): Promise<Result<SuperAdminSettings>> {
  try {
    const existing = await prisma.superAdmin.findFirst();

    if (!existing) {
      return {
        ok: false,
        error: "Super admin record not found in the database.",
      };
    }

    const id = existing.id;
    const data = {
      email: existing.email,
      // Keep existing password; not editable via this settings call.
      password: existing.password,
      phoneNumber: updates.phoneNumber ?? existing.phoneNumber,
      landingSeoTitle:
        updates.landingSeoTitle ?? existing.landingSeoTitle,
      landingSeoDescription:
        updates.landingSeoDescription ?? existing.landingSeoDescription,
      landingSeoKeywords:
        updates.landingSeoKeywords ?? existing.landingSeoKeywords,
    };

    const saved = await prisma.superAdmin.upsert({
      where: { id } as any,
      create: { id, ...data } as any,
      update: data,
    });

    return {
      ok: true,
      data: {
        domain: String(saved.id),
        email: saved.email,
        phoneNumber: saved.phoneNumber,
        landingSeoTitle: saved.landingSeoTitle ?? undefined,
        landingSeoDescription: saved.landingSeoDescription ?? undefined,
        landingSeoKeywords: saved.landingSeoKeywords ?? undefined,
        createdAt: saved.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("updateSuperAdminSettings failed:", error);
    return {
      ok: false,
      error: "Failed to update super admin settings.",
    };
  }
}

export async function getPlatformSeoConfig(): Promise<{
  title: string;
  description: string;
  keywords: string[];
}> {
  const result = await getSuperAdminSettings();

  if (!result.ok) {
    return {
      title: "Build an Online Store in Nigeria (₦50,000) | GetCheapEcommerce",
      description:
        "Launch a professional ecommerce website in minutes with GetCheapEcommerce. Affordable, mobile-ready online stores with WhatsApp checkout and easy order management.",
      keywords:
        "ecommerce website, online store,jumia, nigeria ecommerce, cheap ecommerce, affordable online shop, launch store fast, getcheapecommerce, price nigeria, ecommerce website cost lagos, sell on whatsapp nigeria, affordable web designer nigeria, paystack ecommerce website, getcheapecommerce, how to sell online nigeria"
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
    };
  }

  const settings = result.data;
  const title =
    settings.landingSeoTitle ||
    "Build an Online Store in Nigeria (₦50,000) | GetCheapEcommerce";
  const description =
    settings.landingSeoDescription ||
    "Launch a professional ecommerce website in minutes with GetCheapEcommerce. Affordable, mobile-ready online stores with WhatsApp checkout and easy order management.";
  const keywordsString =
    settings.landingSeoKeywords ||
    "ecommerce website, online store,jumia, nigeria ecommerce, cheap ecommerce, affordable online shop, launch store fast, getcheapecommerce, price nigeria, ecommerce website cost lagos, sell on whatsapp nigeria, affordable web designer nigeria, paystack ecommerce website, getcheapecommerce, how to sell online nigeria";

  const keywords = keywordsString
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return { title, description, keywords };
}

/**
 * Verify super admin credentials against the mock DB record.
 * Intended only for use on the main platform domain.
 */
export async function verifySuperAdminPassword(
  password: string,
): Promise<boolean> {
  if (!password) return false;
  try {
    const record = await prisma.superAdmin.findFirst();
    const storedPassword = record?.password;
    if (!storedPassword) return false;

    // Support both hashed (bcrypt) and legacy plain-text passwords.
    if (storedPassword.startsWith("$2")) {
      const bcrypt = await import("bcryptjs");
      return bcrypt.compare(password, storedPassword);
    }

    return password === storedPassword;
  } catch (error) {
    console.error("verifySuperAdminPassword failed:", error);
    return false;
  }
}

/**
 * Get all tenants as an array.
 * Only intended for super admin consoles or background tasks.
 */
export async function getAllTenants(): Promise<Tenant[]> {
  try {
    const rows = await prisma.tenant.findMany();
    return rows.map(mapTenantRecord);
  } catch (error) {
    console.error("getAllTenants failed:", error);
    return [];
  }
}

/**
 * Get all allowed tenant domains from the database.
 * Used for domain allowlisting (e.g. Caddy On-Demand TLS).
 * Add the main domain from env to get the full list of domains that should receive SSL.
 */
export function getAllowedDomains(): string[] {
  // This legacy helper is no longer backed by the in-memory tenants map.
  // Prefer getAllActiveDomains (Prisma-backed) instead.
  // Kept for backwards compatibility; returns an empty list by default.
  return [];
}

/**
 * Update a tenant record in the in-memory store.
 * Later, this will map to a real database update.
 */
export async function updateTenantInDB(
  tenantId: string,
  updates: Partial<Tenant>,
): Promise<Tenant | null> {
  // Never allow tenantId / timestamps to be changed via this function.
  const { tenantId: _ignoredTenantId, createdAt, ...rest } = updates;

  try {
    const record = await prisma.tenant.update({
      where: { tenantId },
      data: {
        businessName: rest.businessName,
        accountName: rest.accountName,
        businessPhoneNumber: rest.businessPhoneNumber,
        businessEmail: rest.businessEmail,
        adminPassword: rest.adminPassword,
        variant: rest.variant as Tenant["variant"] | undefined,
        primaryColor: rest.primaryColor,
        businessDescription: rest.businessDescription,
        websiteDisplayName: rest.websiteDisplayName,
        bankAccountNumber: rest.bankAccountNumber,
        bankName: rest.bankName,
        favIcon: rest.favIcon,
        logoUrl: rest.logoUrl,
        isLogoHorizontal: rest.isLogoHorizontal,
        currency: rest.currency,
        seoTitle: rest.seoTitle,
        seoDescription: rest.seoDescription,
        seoKeywords: rest.seoKeywords,
      },
    });

    return mapTenantRecord(record);
  } catch (error) {
    console.error("updateTenantInDB failed:", error);
    return null;
  }
}

/**
 * Get all active tenant domains.
 * In production, this would query the database for enabled tenants.
 */
export async function getAllActiveDomains(): Promise<string[]> {
  try {
    const rows = await prisma.tenant.findMany({
      select: { tenantId: true },
    });
    return rows.map((row: { tenantId: string }) => row.tenantId);
  } catch (error) {
    console.error("getAllActiveDomains failed:", error);
    return [];
  }
}

/**
 * Get unique, sorted list of categories for a tenant.
 * Always includes "All" as the first element.
 *
 * Note: Current mock data does not scope products by tenant,
 * but the signature is future-proofed for real multi-tenant storage.
 */
export async function getCategoriesByTenant(
  tenantId: string,
): Promise<string[]> {
  try {
    const rows = await (prisma as any).product.findMany({
      where: { tenantId },
      select: { productCategory: true },
    });

    const categorySet = new Set<string>();
    for (const row of rows) {
      const cat = row.productCategory?.trim();
      if (cat) categorySet.add(cat);
    }

    const categories = Array.from(categorySet).sort((a, b) =>
      a.localeCompare(b),
    );

    return ["All", ...categories];
  } catch (error) {
    console.error("getCategoriesByTenant failed:", error);
    return ["All"];
  }
}

/**
 * Get products for a specific tenant
 * @param tenantId - The tenant identifier (domain)
 * @returns Array of products for the tenant
 *
 * Note: Currently returns all products as mock data doesn't have tenant-specific products.
 * This will be updated when switching to a real database.
 */
export async function getProductsByTenant(
  tenantId: string,
): Promise<Product[]> {
  try {
    const rows = await (prisma as any).product.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapProductRecord);
  } catch (error) {
    console.error("getProductsByTenant failed:", error);
    return [];
  }
}

type CreateProductInput = {
  tenantId: string;
  productName: string;
  productCategory: string;
  productAmount: number;
  quantityAvailable: number;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
};

type UpdateProductInput = CreateProductInput & {
  productId: string;
};

// Structured input used by admin flows when all product fields
// are prepared on the server (e.g. from validated form payload).
export type ProductCreateInput = Omit<Product, "productId">;

export async function createProduct(
  input: ProductCreateInput,
): Promise<Product> {
  const productId = `admin-${input.tenantId}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  try {
    const record = await (prisma as any).product.create({
      data: {
        productId,
        tenantId: input.tenantId,
        productName: input.productName,
        productCategory: input.productCategory,
        productAmount: input.productAmount,
        discountPrice: input.discountPrice ?? 0,
        isDetailsTabular: input.isDetailsTabular,
        quantityAvailable: input.quantityAvailable,
        isNegotiable: input.isNegotiable,
        isPromo: input.isPromo,
        isBestSelling: input.isBestSelling,
        productDetails: input.productDetails as any,
        mediaUrls: input.mediaUrls,
        shortDescription: input.shortDescription,
        fullDescription: input.fullDescription,
        currency: input.currency,
      },
    });

    return mapProductRecord(record);
  } catch (error) {
    console.error("createProduct failed:", error);
    throw error;
  }
}

export async function createProductForTenant(
  input: CreateProductInput,
): Promise<Product> {
  const {
    tenantId,
    productName,
    productCategory,
    productAmount,
    quantityAvailable,
    shortDescription,
    fullDescription,
    imageUrl,
  } = input;

  const productId = `admin-${tenantId}-${Date.now()}`;
  const mediaUrl = imageUrl?.trim();

  try {
    const record = await (prisma as any).product.create({
      data: {
        productId,
        tenantId,
        productName,
        productCategory,
        productAmount,
        discountPrice: 0,
        isDetailsTabular: false,
        quantityAvailable,
        isNegotiable: false,
        isPromo: false,
        isBestSelling: false,
        productDetails: [],
        mediaUrls: mediaUrl ? [mediaUrl] : [],
        shortDescription,
        fullDescription,
      },
    });

    return mapProductRecord(record);
  } catch (error) {
    console.error("createProductForTenant failed:", error);
    throw error;
  }
}

/**
 * Add a fully constructed product for a tenant.
 * Used by the admin add-product flow when all fields are prepared on the server.
 */
export async function addProductForTenant(product: Product): Promise<void> {
  try {
    const { productId: _ignored, ...rest } = product;
    await createProduct(rest);
  } catch (error) {
    console.error("addProductForTenant failed:", error);
    throw error;
  }
}

export async function updateProductForTenant(
  input: UpdateProductInput,
): Promise<Product | null> {
  const {
    tenantId,
    productId,
    productName,
    productCategory,
    productAmount,
    quantityAvailable,
    shortDescription,
    fullDescription,
    imageUrl,
  } = input;

  try {
    const mediaUrl = imageUrl?.trim();

    const record = await (prisma as any).product.update({
      where: { productId },
      data: {
        productName,
        productCategory,
        productAmount,
        quantityAvailable,
        shortDescription,
        fullDescription,
        ...(mediaUrl ? { mediaUrls: [mediaUrl] } : {}),
      },
    });

    // Ensure the product still belongs to the tenant
    if (record.tenantId !== tenantId) {
      console.error(
        "updateProductForTenant: tenantId mismatch",
        record.tenantId,
        tenantId,
      );
      return null;
    }

    return mapProductRecord(record);
  } catch (error) {
    console.error("updateProductForTenant failed:", error);
    return null;
  }
}

/**
 * Bulk update a collection of products for a tenant.
 * Only products matching both tenantId and productId will be updated.
 */
export async function updateProductCollection(
  tenantId: string,
  updates: Product[],
): Promise<void> {
  try {
    for (const updated of updates) {
      await updateProductForTenant({
        tenantId,
        productId: updated.productId,
        productName: updated.productName,
        productCategory: updated.productCategory,
        productAmount: updated.productAmount,
        quantityAvailable: updated.quantityAvailable,
        shortDescription: updated.shortDescription,
        fullDescription: updated.fullDescription,
        imageUrl: updated.mediaUrls[0],
      });
    }
  } catch (error) {
    console.error("updateProductCollection failed:", error);
    throw error;
  }
}

export async function updateProductForTenantById(
  tenantId: string,
  productId: string,
  data: Partial<Product>,
): Promise<Product | null> {
  try {
    // Ensure the product belongs to the tenant before updating.
    const existing = await (prisma as any).product.findFirst({
      where: { productId, tenantId },
    });
    if (!existing) {
      return null;
    }

    const {
      productName,
      productCategory,
      productAmount,
      quantityAvailable,
      isPromo,
      isNegotiable,
      isBestSelling,
      isDetailsTabular,
      shortDescription,
      fullDescription,
      mediaUrls,
      productDetails,
      discountPrice,
      currency,
    } = data;

    const updateData: Record<string, unknown> = {};
    if (productName !== undefined) updateData.productName = productName;
    if (productCategory !== undefined) updateData.productCategory = productCategory;
    if (productAmount !== undefined) updateData.productAmount = productAmount;
    if (quantityAvailable !== undefined)
      updateData.quantityAvailable = quantityAvailable;
    if (isPromo !== undefined) updateData.isPromo = isPromo;
    if (isNegotiable !== undefined) updateData.isNegotiable = isNegotiable;
    if (isBestSelling !== undefined) updateData.isBestSelling = isBestSelling;
    if (isDetailsTabular !== undefined)
      updateData.isDetailsTabular = isDetailsTabular;
    if (shortDescription !== undefined)
      updateData.shortDescription = shortDescription;
    if (fullDescription !== undefined)
      updateData.fullDescription = fullDescription;
    if (mediaUrls !== undefined) updateData.mediaUrls = mediaUrls;
    if (productDetails !== undefined)
      updateData.productDetails = productDetails as any;
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
    if (currency !== undefined) updateData.currency = currency;

    const record = await (prisma as any).product.update({
      where: { productId },
      data: updateData,
    });

    return mapProductRecord(record);
  } catch (error) {
    console.error("updateProductForTenantById failed:", error);
    return null;
  }
}

export async function deleteProductForTenant(
  tenantId: string,
  productId: string,
): Promise<boolean> {
  try {
    const existing = await (prisma as any).product.findFirst({
      where: { productId, tenantId },
    });
    if (!existing) {
      return false;
    }

    await (prisma as any).product.delete({
      where: { productId },
    });

    return true;
  } catch (error) {
    console.error("deleteProductForTenant failed:", error);
    return false;
  }
}

// Convenience aliases matching the requested names, while still
// enforcing tenant scoping at call sites.
export { updateProductForTenantById as updateProduct, deleteProductForTenant as deleteProduct };

export async function getProductById(
  tenantId: string,
  productId: string,
): Promise<Product | null> {
  try {
    const record = await (prisma as any).product.findFirst({
      where: { productId, tenantId },
    });

    return record ? mapProductRecord(record) : null;
  } catch (error) {
    console.error("getProductById failed:", error);
    return null;
  }
}

export async function getProductsByCategoryAndTenant(
  tenantId: string,
  category?: string,
): Promise<Product[]> {
  const normalizedCategory = (category ?? "all").trim().toLowerCase();

  // If "All", return tenant products
  if (normalizedCategory === "all") {
    return getProductsByTenant(tenantId);
  }
  try {
    const rows = await (prisma as any).product.findMany({
      where: {
        tenantId,
        productCategory: {
          equals: normalizedCategory,
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapProductRecord);
  } catch (error) {
    console.error("getProductsByCategoryAndTenant failed:", error);
    return [];
  }
}

export async function getProductsBySearchAndTenant(
  tenantId: string,
  search?: string,
): Promise<Product[]> {
  const normalizedSearch = search?.trim().toLowerCase();

  if (!normalizedSearch) {
    return getProductsByTenant(tenantId);
  }

  try {
    const rows = await (prisma as any).product.findMany({
      where: {
        tenantId,
        OR: [
          {
            productName: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            shortDescription: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            fullDescription: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            productCategory: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map(mapProductRecord);
  } catch (error) {
    console.error("getProductsBySearchAndTenant failed:", error);
    return [];
  }
}

/**
 * Admin authentication helpers
 */
export async function verifyAdminCredentials(
  domain: string,
  password: string,
): Promise<Tenant | null> {
  if (!password) return null;
  const result = await getTenantByDomain(domain);
  if (!result.ok) return null;

  const tenant = result.data;
  const storedPassword = tenant.adminPassword;
  if (!storedPassword) return null;

  try {
    // Bcrypt-hashed password support (new records)
    if (storedPassword.startsWith("$2")) {
      const bcrypt = await import("bcryptjs");
      const ok = await bcrypt.compare(password, storedPassword);
      return ok ? tenant : null;
    }

    // Legacy plain-text fallback (old records)
    if (storedPassword === password) return tenant;
    return null;
  } catch (error) {
    console.error("verifyAdminCredentials failed:", error);
    return null;
  }
}

export async function updateAdminPassword(
  domain: string,
  newPassword: string,
): Promise<Tenant | null> {
  if (!newPassword) return null;

  const result = await getTenantByDomain(domain);
  if (!result.ok) return null;

  const tenant = result.data;

  try {
    const bcrypt = await import("bcryptjs");
    const hashed = await bcrypt.hash(newPassword, 10);

    const record = await prisma.tenant.update({
      where: { tenantId: tenant.tenantId },
      data: { adminPassword: hashed },
    });
    return mapTenantRecord(record);
  } catch (error) {
    console.error("updateAdminPassword failed:", error);
    return null;
  }
}

/**
 * Input shape for creating a new tenant from the super-admin console.
 * Only core fields are required; the DAL fills in sensible defaults.
 */
export type TenantCreateInput = {
  tenantId: string;
  businessName: string;
  businessEmail: string;
  adminPassword: string;
  primaryColor: string;
  businessPhoneNumber?: string;
};

export async function createTenantInDB(
  input: TenantCreateInput,
): Promise<Result<Tenant>> {
  const tenantId = input.tenantId.trim().toLowerCase();

  if (!tenantId) {
    return { ok: false, error: "Tenant ID is required." };
  }

  try {
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(input.adminPassword, 10);
    const businessPhoneNumber = input.businessPhoneNumber ?? "";

    const record = await prisma.tenant.create({
      data: {
        tenantId,
        businessName: input.businessName.trim(),
        accountName: input.businessName.trim(),
        businessPhoneNumber,
        businessEmail: input.businessEmail.trim(),
        adminPassword: hashedPassword,
        variant: "A",
        primaryColor: input.primaryColor.trim() || "#16A34A",
        businessDescription:
          "A new storefront created via the GetCheapEcommerce super admin console.",
        websiteDisplayName: input.businessName.trim(),
        bankAccountNumber: "",
        bankName: "",
        favIcon:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=64&h=64&q=80",
        logoUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        isLogoHorizontal: true,
        currency: "₦",
        seoTitle: `${input.businessName} – Online Store`,
        seoDescription:
          "A modern ecommerce storefront powered by GetCheapEcommerce.",
        seoKeywords:
          "ecommerce, online store, multi-tenant, getcheapecommerce, nigeria",
      } as any,
    });

    return { ok: true, data: mapTenantRecord(record) };
  } catch (error: any) {
    console.error("createTenantInDB failed:", error);

    if (error && typeof error === "object" && error.code === "P2002") {
      return {
        ok: false,
        error: "Tenant ID is already taken. Please choose another one.",
      };
    }

    return {
      ok: false,
      error: "Failed to create tenant. Please try again.",
    };
  }
}

export async function createPasswordReset(
  tenantId: string,
  otpHash: string,
): Promise<void> {
  passwordResets[tenantId] = {
    tenantId,
    otpHash,
    createdAt: Date.now(),
  };
}

export async function getValidPasswordReset(
  tenantId: string,
): Promise<PasswordResetRecord | null> {
  const record = passwordResets[tenantId];
  if (!record) return null;

  const isExpired = Date.now() - record.createdAt > PASSWORD_RESET_TTL_MS;
  if (isExpired) {
    delete passwordResets[tenantId];
    return null;
  }

  return record;
}

export async function clearPasswordReset(tenantId: string): Promise<void> {
  delete passwordResets[tenantId];
}

/**
 * Get cart from cloud (mock DB) by phone number.
 * Used for cross-device cart retrieval and conflict resolution.
 */
export async function getCartById(phone: string): Promise<CartItem[] | null> {
  const key = normalizePhone(phone);
  if (!key) return null;
  const items = cloudCarts[key];
  return items && items.length >= 0 ? [...items] : null;
}

/**
 * Sync cart to cloud (mock DB) for the given phone (cartId).
 * Replaces any existing cloud cart for that phone.
 */
export async function syncCartToCloud(
  cartId: string,
  items: CartItem[],
): Promise<void> {
  const key = normalizePhone(cartId);
  if (!key) return;
  cloudCarts[key] = items.length ? [...items] : [];
}

/**
 * Verify password for a cart (phone). Does not return the password to the client.
 * If no password is set yet (e.g. legacy cart), accepts and stores the first one.
 */
export async function verifyCartPassword(
  phone: string,
  password: string,
): Promise<boolean> {
  const key = normalizePhone(phone);
  if (!key || !password) return false;
  const stored = cloudCartPasswords[key];
  if (stored != null) return stored === password;
  cloudCartPasswords[key] = password;
  return true;
}

/**
 * Set or update the password for a cart (phone). Used on sign up.
 */
export async function setCartPassword(
  phone: string,
  password: string,
): Promise<void> {
  const key = normalizePhone(phone);
  if (!key || !password) return;
  cloudCartPasswords[key] = password;
}

export async function createOrder(
  tenantId: string,
  items: CartItem[],
  totalAmount: number,
  paystackReference?: string,
): Promise<Order> {
  const { tenantOrderRepository } = await import("./repositories/orders");
  return tenantOrderRepository.createOrder(tenantId, items, totalAmount, {
    paystackReference,
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paystackReference?: string,
): Promise<Order | null> {
  const { tenantOrderRepository } = await import("./repositories/orders");
  return tenantOrderRepository.updateOrderStatus(orderId, status, {
    paystackReference,
  });
}

type CreateLandingOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
  productType: string;
  amount: number;
};

export async function createLandingOrder(
  input: CreateLandingOrderInput,
): Promise<LandingOrder> {
  const { landingOrderRepository } = await import("./repositories/orders");
  return landingOrderRepository.createLandingOrder(input);
}

export async function updateLandingOrderStatus(
  orderId: string,
  status: OrderStatus,
  paystackReference?: string,
): Promise<LandingOrder | null> {
  const { landingOrderRepository } = await import("./repositories/orders");
  return landingOrderRepository.updateLandingOrderStatus(orderId, status, {
    paystackReference,
  });
}
