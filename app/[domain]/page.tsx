import Image from "next/image";
import { getTenantByDomain } from "@/lib/mock-db";

type DomainPageProps = {
  params: {
    domain: string;
  };
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

export default function DomainHomePage({ params }: DomainPageProps) {
  const tenant = getTenantByDomain(params.domain);

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-8">
        <Image
          src={PLACEHOLDER_IMAGE}
          alt={`${tenant.businessName} logo`}
          width={128}
          height={128}
          className="rounded-full object-cover shadow-md"
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        {tenant.businessName}
      </h1>

      <p className="text-lg text-gray-600 mb-6 text-center max-w-xl">
        {tenant.businessDescription}
      </p>

      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-500">
        Variant: <span className="font-semibold">{tenant.variant}</span>
      </p>

      <button className="bg-primary text-white p-4 rounded shadow hover:opacity-90 transition">
        Themed Primary Button
      </button>
    </main>
  );
}

