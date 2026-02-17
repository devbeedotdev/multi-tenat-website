import type { ReactNode } from "react";
import "./globals.css";

import { getTenantByDomain } from "@/lib/mock-db";
import { headers } from "next/headers";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") ?? "localhost";

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
