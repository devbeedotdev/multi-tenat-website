"use server";

import { getProductsByCategoryAndTenant } from "@/lib/dal";

export async function getProductsAction(tenantId: string, category?: string) {
  return await getProductsByCategoryAndTenant(tenantId, category);
}
