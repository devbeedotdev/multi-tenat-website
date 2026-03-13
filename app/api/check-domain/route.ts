import { NextRequest, NextResponse } from "next/server";
import { tenantExists } from "@/lib/dal";



export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { error: "Missing domain query parameter" },
      { status: 400 }
    );
  }

  const normalized = domain.split(":")[0].toLowerCase().trim();
  const mainDomain =
    process.env.NEXT_PUBLIC_MAIN_DOMAIN ??
    process.env.MAIN_DOMAIN ??
    "getcheapecommerce.com";

  const existsResult = await tenantExists(normalized);
  const exists = existsResult.ok && existsResult.data;
  const allowed = normalized === mainDomain || exists;

  return new NextResponse(allowed ? "OK" : null, {
    status: allowed ? 200 : 404,
  });
}
