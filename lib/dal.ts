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
import type { Tenant } from "@/types/tenant";
import type { Result } from "@/types/result";
import {
  cloudCartPasswords,
  cloudCarts,
  products,
  superAdmin,
  tenants,
} from "./mock-db";

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
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Get tenant configuration by domain
 * @param domain - The domain/hostname (e.g., "localhost", "client-a.com")
 */
export async function getTenantConfig(
  domain: string,
): Promise<Result<Tenant>> {
  const normalized = domain.split(":")[0].toLowerCase();

  try {
    const record = await prisma.tenant.findUnique({
      where: { domain: normalized },
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
      where: { domain: normalized },
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
    const record = await prisma.superAdmin.findFirst({
      orderBy: { id: "asc" },
    });

    if (!record) {
      return {
        ok: true,
        data: {
          domain: superAdmin.domain,
          email: superAdmin.email,
          phoneNumber: superAdmin.phoneNumber,
          landingSeoTitle: superAdmin.landingSeoTitle,
          landingSeoDescription: superAdmin.landingSeoDescription,
          landingSeoKeywords: superAdmin.landingSeoKeywords,
          createdAt: undefined,
        },
      };
    }

    return {
      ok: true,
      data: {
        domain: record.domain,
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
    const existing = await prisma.superAdmin.findFirst({
      orderBy: { id: "asc" },
    });

    const data = {
      domain: existing?.domain ?? superAdmin.domain,
      email: existing?.email ?? superAdmin.email,
      password: existing?.password ?? superAdmin.password,
      phoneNumber:
        updates.phoneNumber ?? existing?.phoneNumber ?? superAdmin.phoneNumber,
      landingSeoTitle:
        updates.landingSeoTitle ??
        existing?.landingSeoTitle ??
        superAdmin.landingSeoTitle,
      landingSeoDescription:
        updates.landingSeoDescription ??
        existing?.landingSeoDescription ??
        superAdmin.landingSeoDescription,
      landingSeoKeywords:
        updates.landingSeoKeywords ??
        existing?.landingSeoKeywords ??
        superAdmin.landingSeoKeywords,
    };

    const saved = await prisma.superAdmin.upsert({
      where: { id: existing?.id ?? 1 },
      create: data,
      update: data,
    });

    return {
      ok: true,
      data: {
        domain: saved.domain,
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
      title:
        "Build an Online Store in Nigeria (₦50,000) | GetCheapEcommerce",
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
    const record = await prisma.superAdmin.findFirst({
      orderBy: { id: "asc" },
    });
    const storedPassword = record?.password ?? superAdmin.password;
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
  return Object.keys(tenants);
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
  const { tenantId: _ignoredTenantId, createdAt, updatedAt, ...rest } = updates;

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
      select: { domain: true },
    });
    return rows.map((row: { domain: string }) => row.domain);
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
  const tenantProducts = await getProductsByTenant(tenantId);

  const categorySet = new Set<string>();
  for (const product of tenantProducts) {
    if (product.productCategory?.trim()) {
      categorySet.add(product.productCategory.trim());
    }
  }

  const categories = Array.from(categorySet).sort((a, b) => a.localeCompare(b));

  return ["All", ...categories];
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
  return products.filter((p) => p.tenantId === tenantId);
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

  const productId = `admin-${tenantId}-${Date.now()}-${products.length + 1}`;
  const mediaUrl = imageUrl?.trim();

  const newProduct: Product = {
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
  };

  products.push(newProduct);
  return newProduct;
}

/**
 * Add a fully constructed product for a tenant.
 * Used by the admin add-product flow when all fields are prepared on the server.
 */
export async function addProductForTenant(product: Product): Promise<void> {
  products.push(product);
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

  const product = products.find(
    (p) => p.productId === productId && p.tenantId === tenantId,
  );

  if (!product) {
    return null;
  }

  product.productName = productName;
  product.productCategory = productCategory;
  product.productAmount = productAmount;
  product.quantityAvailable = quantityAvailable;
  product.shortDescription = shortDescription;
  product.fullDescription = fullDescription;

  const mediaUrl = imageUrl?.trim();
  if (mediaUrl) {
    product.mediaUrls = [mediaUrl];
  }

  return product;
}

/**
 * Bulk update a collection of products for a tenant.
 * Only products matching both tenantId and productId will be updated.
 */
export async function updateProductCollection(
  tenantId: string,
  updates: Product[],
): Promise<void> {
  for (const updated of updates) {
    const existing = products.find(
      (p) => p.productId === updated.productId && p.tenantId === tenantId,
    );
    if (!existing) continue;

    existing.productName = updated.productName;
    existing.productCategory = updated.productCategory;
    existing.productAmount = updated.productAmount;
    existing.quantityAvailable = updated.quantityAvailable;
    existing.isPromo = updated.isPromo;
    existing.isNegotiable = updated.isNegotiable;
    existing.shortDescription = updated.shortDescription;
    existing.fullDescription = updated.fullDescription;
    existing.mediaUrls = [...updated.mediaUrls];
    existing.productDetails = [...updated.productDetails];
  }
}

export async function getProductById(
  tenantId: string,
  productId: string,
): Promise<Product | null> {
  const tenantProducts = await getProductsByTenant(tenantId);

  const product = tenantProducts.find((p) => p.productId === productId);

  return product || null;
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

  const tenantProducts = await getProductsByTenant(tenantId);

  return tenantProducts.filter(
    (product) =>
      product.productCategory.trim().toLowerCase() === normalizedCategory,
  );
}

export async function getProductsBySearchAndTenant(
  tenantId: string,
  search?: string,
): Promise<Product[]> {
  const tenantProducts = await getProductsByTenant(tenantId);

  const normalizedSearch = search?.trim().toLowerCase();

  if (!normalizedSearch) {
    return tenantProducts;
  }

  return tenantProducts.filter((product) => {
    return (
      product.productName.toLowerCase().includes(normalizedSearch) ||
      product.shortDescription.toLowerCase().includes(normalizedSearch) ||
      product.fullDescription.toLowerCase().includes(normalizedSearch) ||
      product.productCategory.toLowerCase().includes(normalizedSearch)
    );
  });
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
  if (tenant.adminPassword !== password) return null;
  return tenant;
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
    const record = await prisma.tenant.update({
      where: { tenantId: tenant.tenantId },
      data: { adminPassword: newPassword },
    });
    return mapTenantRecord(record);
  } catch (error) {
    console.error("updateAdminPassword failed:", error);
    return null;
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
