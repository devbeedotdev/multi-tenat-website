/**
 * Data Access Layer (DAL)
 *
 * This is the ONLY file allowed to import from mock-db.ts or (later) Prisma.
 * All UI components and Page files must fetch data through this layer.
 */

import type { Product } from "@/types/product";
import type { Tenant } from "@/types/tenant";
import {
  getTenantByDomain as getTenantByDomainFromMock,
  products,
  tenants,
} from "./mock-db";

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
