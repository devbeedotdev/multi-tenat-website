import CartProviderWithSync from "@/components/cart/CartProviderWithSync";
import { getTenantByDomain } from "@/lib/dal";
import { MAIN_DOMAIN } from "@/lib/config/platform";
import { sanitizeColor } from "../../lib/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";

type DomainLayoutProps = {
  children: ReactNode;
  params: {
    domain: string;
  };
};

function toCanonicalHost(hostname: string): string {
  const lower = hostname.toLowerCase();
  return lower.startsWith("www.") ? lower.slice(4) : lower;
}

function isMainDomainParam(domain: string): boolean {
  const main = toCanonicalHost(MAIN_DOMAIN);
  const candidate = toCanonicalHost(domain);
  return candidate === main;
}

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata> {
  // Guard: never attempt tenant lookup for the platform main domain.
  if (isMainDomainParam(params.domain)) {
    return {
      title: "Platform",
      description: "Multi-tenant ecommerce platform",
    };
  }

  const tenantResult = await getTenantByDomain(params.domain);
  const tenant = tenantResult.ok ? tenantResult.data : null;

  if (!tenant) {
    return {
      title: "Tenant not found",
    };
  }

  const keywords =
    tenant.seoKeywords
      ?.split(",")
      .map((k) => k.trim())
      .filter(Boolean) ?? [];

  return {
    title: tenant.seoTitle || tenant.websiteDisplayName,
    description: tenant.seoDescription || tenant.businessDescription,
    keywords: keywords.length ? keywords : undefined,
    icons: {
      icon: [{ url: tenant.favIcon }],
    },
  };
}

export default async function DomainLayout({ children, params }: DomainLayoutProps) {
  // Guard: if someone accidentally routes the main platform domain
  // through this layout, render children without tenant styling instead
  // of throwing a "Tenant not found" error.
  if (isMainDomainParam(params.domain)) {
    return <>{children}</>;
  }

  const tenantResult = await getTenantByDomain(params.domain);
  const tenant = tenantResult.ok ? tenantResult.data : null;

  if (!tenant) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Tenant not found</h1>
          <p className="text-gray-500">
            No configuration was found for domain: <code>{params.domain}</code>
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `body { --primary: ${sanitizeColor(tenant.primaryColor)}; }`,
        }}
      />
      <CartProviderWithSync domain={params.domain} variant={tenant.variant}>
        {children}
      </CartProviderWithSync>
    </>
  );
}
