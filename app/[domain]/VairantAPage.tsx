

import { ProductCardA } from "@/components/cards/ProductCardA";
import VariantAHeader from "@/components/headers/VariantAHeader";
import { products } from "@/lib/mock-db";
import { TenantPageProps } from "@/types/tenant";

// export default function VariantAPage({ tenant }: TenantPageProps) {
//   return (
//     <main className="min-h-screen bg-white">
//       {/* Sticky Header */}
//       <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
//       <div className="max-w-6xl mx-auto py-1 px-4">
//           <VariantAHeader tenant={tenant} />
//         </div>
//       </div>

//       {/* Scrollable Content */}
//       <section className="mx-auto max-w-6xl px-4 pb-10 py-3">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {products.map((product) => (
//             <ProductCardA key={product.productId} product={product} />
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }


export default function VariantAPage({ tenant }: TenantPageProps) {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Sticky Header - FULL WIDTH */}
      {/* <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <VariantAHeader tenant={tenant} />
        </div>
      </div> */}
      <VariantAHeader tenant={tenant}/>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCardA key={product.productId} product={product} />
          ))}
        </div>
      </section>

    </main>
  );
}