/**
 * Lightweight DAL for middleware only.
 * Does NOT import lib/crypto.ts, so ENCRYPTION_KEY is not required.
 * Use this in middleware.ts to avoid loading crypto in Edge/worker contexts.
 */

import { MAIN_DOMAIN } from "@/lib/config/platform";
import { prisma } from "@/lib/prisma";
import type { Result } from "@/types/result";

const ROUTING_RESERVED_HOSTS = ["localhost", "127.0.0.1", "::1"];

function toCanonicalHost(hostname: string): string {
  const lower = hostname.toLowerCase();
  return lower.startsWith("www.") ? lower.slice(4) : lower;
}

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

export function isMainPlatformDomain(domain: string): boolean {
  const main = toCanonicalHost(MAIN_DOMAIN);
  const candidate = toCanonicalHost(domain.split(":")[0]);
  return candidate === main;
}
