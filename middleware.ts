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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. NEVER apply tenant logic to API routes — pass through immediately
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Pass through static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();
  const mainDomain =
    process.env.NEXT_PUBLIC_MAIN_DOMAIN ??
    process.env.MAIN_DOMAIN ??
    "getcheapecommerce.com";

  // 3. Never apply tenant rewrite to localhost or server IP
  if (isBypassHost(hostname)) {
    return NextResponse.next();
  }

  // Main domain: serve root landing page / admin dashboard (no rewrite)
  if (hostname === mainDomain) {
    return NextResponse.next();
  }

  // Path already prefixed with a known tenant domain
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  if (firstSegment && tenantExists(firstSegment) && !isBypassHost(firstSegment)) {
    return NextResponse.next();
  }

  // 4. Tenant domain: rewrite ONLY for real tenant domains (never localhost/server IP)
  if (tenantExists(hostname) && !isBypassHost(hostname)) {
    const clonedUrl = request.nextUrl.clone();
    clonedUrl.pathname = `/${hostname}${pathname === "/" ? "" : pathname}`;
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
