// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { tenantExists, getTenantByDomain } from "./lib/dal";

// export function middleware(request: NextRequest) {
//   const url = request.nextUrl;
//   const { pathname } = url;

//   // Extract hostname from headers (and strip port if present)
//   const hostHeader = request.headers.get("host") ?? "";
//   const hostname = hostHeader.split(":")[0].toLowerCase();

//   // If the path is already prefixed with a known tenant domain, let it through
//   const pathSegments = pathname.split("/").filter(Boolean);
//   const firstSegment = pathSegments[0];

//   if (firstSegment && tenantExists(firstSegment)) {
//     return NextResponse.next();
//   }

//   // If we recognize this hostname as a tenant, rewrite internally to /[domain]${pathname}
//   if (tenantExists(hostname)) {
//     const rewrittenPath = `/${hostname}${pathname === "/" ? "" : pathname}`;
//     return NextResponse.rewrite(new URL(rewrittenPath || "/", request.url));
//   }

//   // Unknown host: fall back to default behavior (root app route)
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
// };

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { tenantExists } from "./lib/dal";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;

  // Skip API routes and static assets
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();
  const mainDomain =
    process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? "getcheapecommerce.com";

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
