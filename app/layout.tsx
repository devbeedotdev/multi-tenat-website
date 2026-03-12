import type { ReactNode } from "react";
import "./globals.css";

import { MAIN_DOMAIN, PLATFORM_FAVICON_URL } from "@/lib/config/platform";
import {
  getPlatformSeoConfig,
  getSuperAdminSettings,
  getTenantByDomain,
  isMainPlatformDomain,
} from "@/lib/dal";
import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get("host") ?? "localhost";

  if (isMainPlatformDomain(host)) {
    const seo = await getPlatformSeoConfig();
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords.length ? seo.keywords : undefined,
      icons: {
        icon: [{ url: PLATFORM_FAVICON_URL }],
      },
    };
  }

  const tenantResult = await getTenantByDomain(host);
  const tenant = tenantResult.ok ? tenantResult.data : null;

  return {
    title: tenant?.websiteDisplayName ?? "Shopping Platform",
    description:
      tenant?.businessDescription ?? "An E-commerce Platform for your business",
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headersList = headers();
  const host = headersList.get("host") ?? "localhost";
  const isMain = isMainPlatformDomain(host);

  let jsonLd: Record<string, unknown> | null = null;

  if (isMain) {
    const settingsResult = await getSuperAdminSettings();
    const settings = settingsResult.ok ? settingsResult.data : { phoneNumber: "" };
    const digits = (settings.phoneNumber ?? "").replace(/\D/g, "");
    const whatsappUrl = digits ? `https://wa.me/${digits}` : undefined;
    const baseUrl = `https://${MAIN_DOMAIN}/`;

    const product = {
      "@type": "Product",
      name: "GetCheapEcommerce Website Builder",
      description: "Professional ecommerce website setup for Nigerian vendors.",
      offers: {
        "@type": "Offer",
        price: "50000",
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
        url: baseUrl,
      },
    };

    const localBusiness: Record<string, unknown> = {
      "@type": "LocalBusiness",
      name: "GetCheapEcommerce Website Builder",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lagos",
        addressCountry: "NG",
      },
      telephone: settings.phoneNumber ?? "",
      url: baseUrl,
    };

    if (whatsappUrl) {
      localBusiness.sameAs = [whatsappUrl];
    }

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [product, localBusiness],
    };
  }

  return (
    <html lang="en">
      <body>
        {children}
        {jsonLd && (
          <script
            // Structured data for rich results
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </body>
    </html>
  );
}






