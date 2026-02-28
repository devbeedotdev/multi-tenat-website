/**
 * Data Access Layer (DAL)
 *
 * This is the ONLY file allowed to import from mock-db.ts or (later) Prisma.
 * All UI components and Page files must fetch data through this layer.
 */

import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { Tenant } from "@/types/tenant";
import {
  cloudCarts,
  cloudCartPasswords,
  getTenantByDomain as getTenantByDomainFromMock,
  products,
  tenants,
} from "./mock-db";

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Get tenant configuration by domain
 * @param domain - The domain/hostname (e.g., "localhost", "client-a.com")
 * @returns Tenant configuration or null if not found
 */
export async function getTenantConfig(domain: string): Promise<Tenant | null> {
  const tenant = getTenantByDomainFromMock(domain);
  return tenant || null;
}

/**
 * Get tenant by domain (synchronous version for compatibility)
 * @param domain - The domain/hostname
 * @returns Tenant or undefined if not found
 */
export function getTenantByDomain(domain: string): Tenant | undefined {
  return getTenantByDomainFromMock(domain);
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
  // TODO: When migrating to real DB, filter products by tenantId
  // For now, return all products as they're not tenant-specific in mock data
  return products;
}

export async function getProductById(
  tenantId: string,
  productId: string,
): Promise<Product | null> {
  const tenantProducts = await getProductsByTenant(tenantId);

  const product = tenantProducts.find(
    (p) => p.productId === productId,
  );

  return product || null;
}

export async function getProductsByCategoryAndTenant(
  tenantId: string,
  category?: string,
): Promise<Product[]> {
  const normalizedCategory = (category ?? "all").trim().toLowerCase();
  console.log(`This category - ${category}`);

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
