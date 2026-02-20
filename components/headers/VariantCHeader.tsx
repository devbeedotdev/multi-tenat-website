"use client";

import VariantCBody from "@/components/body/VariantCBody";
import VariantCSidebar from "@/components/headers/VariantCSideBar";
import VariantCTopBar from "@/components/headers/VariantCTopBar";
import { TenantPageProps } from "@/types/tenant";
import { useState } from "react";


export default function VariantCHeader({ tenant }: TenantPageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <VariantCTopBar tenant={tenant} onOpenSidebar={() => setIsOpen(true)} />

      <VariantCSidebar
        tenant={tenant}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      
    </div>
  );
}
