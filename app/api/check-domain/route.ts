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


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  // Hardcode your main domain for now to test the handshake
  const allowedDomains = ['getcheapecommerce.com', 'localhost'];

  if (domain && allowedDomains.includes(domain)) {
    return new NextResponse('OK', { status: 200 });
  }

  // Once this works, you'll swap this with a Prisma check:
  // const tenant = await prisma.tenant.findUnique({ where: { domain } });
  // if (tenant) return new NextResponse('OK', { status: 200 });

  return new NextResponse('Not Allowed', { status: 404 });
}
