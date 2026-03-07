//[THIS CODE IS VERY IMPORTANT]
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { tenantExists } from "./lib/dal";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("DEBUG: Middleware checking path:", pathname);

  // 1. NEVER apply tenant logic to API routes — pass through immediately
  if (pathname.startsWith("/api")) {
    console.log("DEBUG: Allowing API route through...");
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

  // 3. Never apply tenant rewrite to localhost or server IP (Caddy check-domain, local dev, health checks)
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === process.env.SERVER_IP
  ) {
    return NextResponse.next();
  }

  // Main domain: serve root landing page / admin dashboard (no rewrite)
  if (hostname === mainDomain) {
    return NextResponse.next();
  }

  // Path already prefixed with a known tenant domain
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  if (firstSegment && tenantExists(firstSegment)) {
    return NextResponse.next();
  }

  // Tenant domain: rewrite internally to /[domain]/...
  if (tenantExists(hostname)) {
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
  // Exclude /api*, static assets, favicon — middleware must NOT run on these
  matcher: [
    "/((?!api/)(?!api$)(?!_next/static)(?!_next/image)(?!favicon\\.ico)(?!images/).*)",
  ],
};
