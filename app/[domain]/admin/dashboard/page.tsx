import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addProductForTenant,
  getProductsByTenant,
  getTenantByDomain,
  updateProductCollection,
} from "@/lib/dal";
import type { Product } from "@/types/product";
import type { ProductDetailItem } from "@/types/product-detail";
import { AdminProductPowerTable } from "@/components/admin/AdminProductPowerTable";
import { AdminAddProductForm } from "@/components/admin/AdminAddProductForm";

async function requireAdminTenantForDomain(domain: string) {
  const normalizedDomain = domain.toLowerCase();
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session || session !== normalizedDomain) {
    cookieStore.delete("admin_session");
    redirect(`/${normalizedDomain}/admin/login`);
  }

  const tenant = getTenantByDomain(session);
  if (!tenant) {
    cookieStore.delete("admin_session");
    redirect(`/${normalizedDomain}/admin/login`);
  }

  return tenant;
}

async function handleBulkUpdate(domain: string, formData: FormData) {
  "use server";

  const tenant = await requireAdminTenantForDomain(domain);
  const payload = String(formData.get("payload") || "");
  const basePath = `/${domain.toLowerCase()}/admin/dashboard`;

  if (!payload) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "No changes detected in payload",
      )}`,
    );
  }

  let parsed: Product[];
  try {
    parsed = JSON.parse(payload) as Product[];
  } catch {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "Unable to parse changes payload",
      )}`,
    );
  }

  await updateProductCollection(tenant.tenantId, parsed);
  revalidatePath(basePath);
  redirect(
    `${basePath}?success=${encodeURIComponent(
      "Products updated successfully",
    )}`,
  );
}

async function handleCreateProduct(domain: string, formData: FormData) {
  "use server";

  const tenant = await requireAdminTenantForDomain(domain);
  const basePath = `/${domain.toLowerCase()}/admin/dashboard`;

  const payload = String(formData.get("payload") || "");
  if (!payload) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "No product data provided",
      )}#add-product`,
    );
  }

  let parsed: {
    productName: string;
    productCategory: string;
    productAmount: number;
    quantityAvailable: number;
    currency?: string;
    isPromo: boolean;
    isNegotiable: boolean;
    isBestSelling: boolean;
    isDetailsTabular: boolean;
    mediaUrls: string[];
    videoUrl?: string;
    shortDescription: string;
    fullDescription: string;
    productDetails: ProductDetailItem[];
  };

  try {
    parsed = JSON.parse(payload);
  } catch {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "Unable to parse product payload",
      )}#add-product`,
    );
  }

  const {
    productName,
    productCategory,
    productAmount,
    quantityAvailable,
    currency,
    isPromo,
    isNegotiable,
    isBestSelling,
    isDetailsTabular,
    mediaUrls,
    shortDescription,
    fullDescription,
    productDetails,
  } = parsed;

  const productId = `admin-${tenant.tenantId}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const newProduct: Product = {
    productId,
    tenantId: tenant.tenantId,
    productName,
    productCategory,
    productAmount,
    discountPrice: 0,
    isDetailsTabular,
    quantityAvailable,
    isNegotiable,
    isPromo,
    isBestSelling,
    productDetails: productDetails ?? [],
    mediaUrls: mediaUrls ?? [],
    shortDescription,
    fullDescription,
    currency: currency || "₦",
  };

  await addProductForTenant(newProduct);
  revalidatePath(basePath);
  redirect(
    `${basePath}?success=${encodeURIComponent(
      "Product created successfully",
    )}`,
  );
}

async function handleLogout(domain: string) {
  "use server";

  const normalizedDomain = domain.toLowerCase();
  const cookieStore = cookies();
  cookieStore.delete("admin_session");
  redirect(`/${normalizedDomain}/admin/login`);
}

export default async function AdminDashboardPage({
  params,
  searchParams,
}: {
  params: { domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const domain = params.domain.toLowerCase();
  const tenant = await requireAdminTenantForDomain(domain);
  const products = await getProductsByTenant(tenant.tenantId);

  const error = searchParams.error as string | undefined;
  const success = searchParams.success as string | undefined;

  const basePath = `/${domain}/admin/dashboard`;
  const formId = "bulk-update-form";
  const payloadInputId = "bulk-update-payload";
  const addFormId = "add-product-form";
  const addPayloadInputId = "add-product-payload";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            Products Power-Table
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Managing products for{" "}
            <span className="font-medium text-slate-700">
              {tenant.businessName}
            </span>{" "}
            (<span className="font-mono text-xs">{tenant.tenantId}</span>)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#add-product"
            className="inline-flex items-center rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            + Add new product
          </a>
          <form action={handleLogout.bind(null, domain)}>
            <button
              type="submit"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {(error || success) && (
        <div id="alerts" className="space-y-2">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {success}
            </div>
          )}
        </div>
      )}

      <form id={formId} action={handleBulkUpdate.bind(null, domain)}>
        <input type="hidden" name="payload" id={payloadInputId} />
        <AdminProductPowerTable
          initialProducts={products}
          formId={formId}
          payloadInputId={payloadInputId}
        />
      </form>

      <form id={addFormId} action={handleCreateProduct.bind(null, domain)}>
        <input type="hidden" name="payload" id={addPayloadInputId} />
        <AdminAddProductForm
          formId={addFormId}
          payloadInputId={addPayloadInputId}
          defaultCurrency="₦"
          primaryColor={tenant.primaryColor}
        />
      </form>
    </div>
  );
}

