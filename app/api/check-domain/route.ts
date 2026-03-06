import { NextRequest, NextResponse } from "next/server";

/**
 * Caddy On-Demand TLS verification endpoint.
 * GET /api/check-domain?domain=example.com
 * Returns 200 if the domain is allowed (main domain or valid tenant), 404 if not.
 */
// export async function GET(request: NextRequest) {
//   const domain = request.nextUrl.searchParams.get("domain");
//   if (!domain) {
//     return NextResponse.json(
//       { error: "Missing domain query parameter" },
//       { status: 400 }
//     );
//   }

//   const normalized = domain.split(":")[0].toLowerCase().trim();
//   const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? "getcheapecommerce.com";

//   const allowed =
//     normalized === mainDomain || tenantExists(normalized);

//   return new NextResponse(null, {
//     status: allowed ? 200 : 404,
//   });
// }

// app/api/check-domain/route.ts
export async function GET(request: NextRequest) {
  // If we get here, the API is ALIVE
  return new NextResponse("API IS WORKING", { status: 200 });
}
