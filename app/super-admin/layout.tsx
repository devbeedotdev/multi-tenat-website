import { PLATFORM_FAVICON_URL, PLATFORM_BRAND_NAME } from "@/lib/config/platform";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: `${PLATFORM_BRAND_NAME} – Super Admin`,
  icons: {
    icon: [{ url: PLATFORM_FAVICON_URL }],
  },
};

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

