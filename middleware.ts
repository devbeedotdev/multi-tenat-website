//[THIS CODE IS VERY IMPORTANT]
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { tenantExists } from "./lib/dal";

/**
 * Domains that must NEVER be rewritten as tenants (Caddy check-domain, local dev, health checks).
 * Even if they exist in the tenants DB, they bypass tenant rewrite logic.
 */
const ROUTING_BYPASS_HOSTS = ["localhost", "127.0.0.1", "::1"];

function isBypassHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return (
    ROUTING_BYPASS_HOSTS.includes(normalized) ||
    normalized === (process.env.SERVER_IP ?? "").toLowerCase()
  );
}

/**
 * Extracts the effective hostname from the request, handling:
 * - Proxy: uses X-Forwarded-Host when Host is localhost (app behind Caddy, etc.)
 * - Port stripping: host:3000 → host
 * - Normalization: lowercase
 */
function getEffectiveHost(request: NextRequest): string {
  // 1. Try X-Forwarded-Host first (Standard for proxies)
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    return forwardedHost.split(",")[0].trim().split(":")[0].toLowerCase();
  }

  // 2. Fallback to standard Host header
  const host = request.headers.get("host") ?? "";
  return host.split(":")[0].toLowerCase();
}

/**
 * Normalizes hostname for tenant lookup and path rewriting.
 * Strips www. prefix so www.clientA.com and clientA.com resolve to the same tenant.
 */
function toCanonicalTenantHost(hostname: string): string {
  const lower = hostname.toLowerCase();
  return lower.startsWith("www.") ? lower.slice(4) : lower;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. NEVER apply tenant logic to API routes — pass through immediately
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Explicitly bypass super-admin console on all hosts.
  //    This must always route directly to app/super-admin without
  //    being treated as a tenant path or rewritten.
  if (pathname === "/super-admin" || pathname.startsWith("/super-admin/")) {
    return NextResponse.next();
  }

  // 3. Pass through static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const hostname = getEffectiveHost(request);
  const canonicalHost = toCanonicalTenantHost(hostname);
  console.log(
    `[Middleware Debug] Path: ${pathname} | Host: ${hostname} | Canonical: ${canonicalHost}`,
  );
  const mainDomain =
    process.env.NEXT_PUBLIC_MAIN_DOMAIN ??
    process.env.MAIN_DOMAIN ??
    "getcheapecommerce.com";
  const mainCanonical = toCanonicalTenantHost(mainDomain);

  // 4. Never apply tenant rewrite to localhost or server IP
  if (isBypassHost(hostname)) {
    return NextResponse.next();
  }

  // Main domain (e.g. getcheapecommerce.com): serve landing pages and
  // platform-level routes (including /super-admin) without tenant rewrites.
  if (canonicalHost === mainCanonical) {
    return NextResponse.next();
  }

  // Path already prefixed with a known tenant domain
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  if (
    firstSegment &&
    tenantExists(firstSegment) &&
    !isBypassHost(firstSegment)
  ) {
    return NextResponse.next();
  }

  // 4. Tenant domain: rewrite to /{canonicalHost}/[path] — no localhost, no www in path
  if (tenantExists(canonicalHost) && !isBypassHost(canonicalHost)) {
    const clonedUrl = request.nextUrl.clone();
    clonedUrl.pathname =
      pathname === "/" ? `/${canonicalHost}` : `/${canonicalHost}${pathname}`;
    return NextResponse.rewrite(clonedUrl);
  }

  // Unknown domain: redirect to main site
  const protocol = request.nextUrl.protocol;
  const redirectUrl = `${protocol}//${mainDomain}/`;
  return NextResponse.redirect(redirectUrl, 302);
}

export const config = {
  // Official Next.js matcher: exclude /api, static assets, favicon — middleware must NOT run on these
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
