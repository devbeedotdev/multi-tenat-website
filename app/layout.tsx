import type { ReactNode } from "react";
import "./globals.css";

import { PLATFORM_FAVICON_URL } from "@/lib/config/platform";
import {
  getPlatformSeoConfig,
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

  const tenant = getTenantByDomain(host);

  return {
    title: tenant?.websiteDisplayName ?? "Shopping Platform",
    description:
      tenant?.businessDescription ?? "An E-commerce Platform for your business",
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}






