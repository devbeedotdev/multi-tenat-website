import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { tenants } from "./lib/mock-db";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;

  // Extract hostname from headers (and strip port if present)
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();

  // If the path is already prefixed with a known tenant domain, let it through
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  if (firstSegment && tenants[firstSegment]) {
    return NextResponse.next();
  }

  // If we recognize this hostname as a tenant, rewrite internally to /[domain]${pathname}
  if (tenants[hostname]) {
    const rewrittenPath = `/${hostname}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(new URL(rewrittenPath || "/", request.url));
  }

  // Unknown host: fall back to default behavior (root app route)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
