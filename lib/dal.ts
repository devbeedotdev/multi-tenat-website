/**
 * Data Access Layer (DAL)
 *
 * This is the ONLY file allowed to import from mock-db.ts or (later) Prisma.
 * All UI components and Page files must fetch data through this layer.
 */

import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { Order, OrderStatus } from "@/types/order";
import type { Tenant } from "@/types/tenant";
import {
  cloudCartPasswords,
  cloudCarts,
  products,
  tenants,
} from "./mock-db";

type PasswordResetRecord = {
  tenantId: string;
  otpHash: string;
  createdAt: number;
};

const PASSWORD_RESET_TTL_MS = 10 * 60 * 1000;

const orders: Order[] = [];

// In-memory password reset store keyed by tenantId (domain)
const passwordResets: Record<string, PasswordResetRecord> = {};

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Get tenant configuration by domain
 * @param domain - The domain/hostname (e.g., "localhost", "client-a.com")
 * @returns Tenant configuration or null if not found
 */
export async function getTenantConfig(domain: string): Promise<Tenant | null> {
  const tenant = getTenantByDomain(domain);
  return tenant || null;
}

/**
 * Get tenant by domain (synchronous version for compatibility)
 * @param domain - The domain/hostname
 * @returns Tenant or undefined if not found
 */
export function getTenantByDomain(domain: string): Tenant | undefined {
  const normalized = domain.split(":")[0].toLowerCase();
  return tenants[normalized];
}

/**
 * Check if a tenant exists for the given domain
 * @param domain - The domain/hostname
 * @returns true if tenant exists, false otherwise
 *
 * This is a lightweight function for middleware and other edge cases
 * that need to check tenant existence without fetching full tenant data.
 */
export function tenantExists(domain: string): boolean {
  const normalized = domain.split(":")[0].toLowerCase();
  return normalized in tenants;
}

/**
 * Update a tenant record in the in-memory store.
 * Later, this will map to a real database update.
 */
export async function updateTenantInDB(
  tenantId: string,
  updates: Partial<Tenant>,
): Promise<Tenant | null> {
  const tenant = tenants[tenantId];
  if (!tenant) return null;

  // Never allow tenantId to be changed via this function.
  const { tenantId: _ignoredTenantId, ...rest } = updates;

  Object.assign(tenant, rest);
  return tenant;
}

/**
 * Get all active tenant domains.
 * In production, this would query the database for enabled tenants.
 */
export async function getAllActiveDomains(): Promise<string[]> {
  return Object.keys(tenants);
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
  const tenant = getTenantByDomain(domain);
  if (!tenant) return null;
  if (!password || tenant.adminPassword !== password) return null;
  return tenant;
}

export async function updateAdminPassword(
  domain: string,
  newPassword: string,
): Promise<Tenant | null> {
  const tenant = getTenantByDomain(domain);
  if (!tenant) return null;
  if (!newPassword) return null;
  tenant.adminPassword = newPassword;
  return tenant;
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
  const orderId = `order-${tenantId}-${Date.now()}-${orders.length + 1}`;

  const order: Order = {
    orderId,
    tenantId,
    items: [...items],
    totalAmount,
    status: "pending",
    paystackReference,
  };

  orders.push(order);
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paystackReference?: string,
): Promise<Order | null> {
  const order = orders.find((o) => o.orderId === orderId);
  if (!order) return null;

  order.status = status;
  if (paystackReference !== undefined) {
    order.paystackReference = paystackReference;
  }

  return order;
}
