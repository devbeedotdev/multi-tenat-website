// import { ProductCardA } from "@/components/cards/ProductCardA";
// import VariantAHeader from "@/components/headers/VariantAHeader";
// import { products } from "@/lib/mock-db";
// import { TenantPageProps } from "@/types/tenant";

// export default function VariantAPage({ tenant }: TenantPageProps) {
//   return (
//     <main className="min-h-screen bg-white px-4 py-3">
//       <section className="mx-auto max-w-6xl space-y-6">
//         <header className="space-y-2">
//           <VariantAHeader tenant={tenant} />
//         </header>

//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {products.map((product) => (
//             <ProductCardA key={product.productId} product={product} />
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }

import { ProductCardA } from "@/components/cards/ProductCardA";
import VariantAHeader from "@/components/headers/VariantAHeader";
import { products } from "@/lib/mock-db";
import { TenantPageProps } from "@/types/tenant";

export default function VariantAPage({ tenant }: TenantPageProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl py-1">
          <VariantAHeader tenant={tenant} />
        </div>
      </div>

      {/* Scrollable Content */}
      <section className="mx-auto max-w-6xl px-4 pb-10 py-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCardA key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
