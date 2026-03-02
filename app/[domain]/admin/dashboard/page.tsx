import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createProductForTenant,
  getProductsByTenant,
  getTenantByDomain,
  updateProductForTenant,
} from "@/lib/dal";

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

async function handleCreateProduct(domain: string, formData: FormData) {
  "use server";

  const tenant = await requireAdminTenantForDomain(domain);

  const name = String(formData.get("name") || "").trim();
  const priceValue = String(formData.get("price") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const quantityValue = String(formData.get("quantity") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();

  const errors: string[] = [];
  if (!name) errors.push("Name is required.");
  if (!category) errors.push("Category is required.");
  if (!priceValue) errors.push("Price is required.");
  if (!quantityValue) errors.push("Quantity is required.");

  const productAmount = Number(priceValue);
  const quantityAvailable = Number(quantityValue);
  if (Number.isNaN(productAmount) || productAmount <= 0) {
    errors.push("Price must be a positive number.");
  }
  if (!Number.isInteger(quantityAvailable) || quantityAvailable < 0) {
    errors.push("Quantity must be a non-negative integer.");
  }

  const basePath = `/${domain.toLowerCase()}/admin/dashboard`;

  if (errors.length > 0) {
    redirect(
      `${basePath}?error=${encodeURIComponent(errors.join(" "))}#products`,
    );
  }

  await createProductForTenant({
    tenantId: tenant.tenantId,
    productName: name,
    productCategory: category,
    productAmount,
    quantityAvailable,
    shortDescription: description || name,
    fullDescription: description || name,
    imageUrl,
  });

  revalidatePath(basePath);
  redirect(
    `${basePath}?success=${encodeURIComponent(
      "Product created successfully",
    )}#products`,
  );
}

async function handleUpdateProduct(domain: string, formData: FormData) {
  "use server";

  const tenant = await requireAdminTenantForDomain(domain);

  const productId = String(formData.get("productId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const priceValue = String(formData.get("price") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const quantityValue = String(formData.get("quantity") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();

  const basePath = `/${domain.toLowerCase()}/admin/dashboard`;

  if (!productId) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "Missing product identifier",
      )}#products`,
    );
  }

  const productAmount = Number(priceValue);
  const quantityAvailable = Number(quantityValue);

  const updated = await updateProductForTenant({
    tenantId: tenant.tenantId,
    productId,
    productName: name || productId,
    productCategory: category || "Uncategorized",
    productAmount: Number.isNaN(productAmount) ? 0 : productAmount,
    quantityAvailable: Number.isNaN(quantityAvailable)
      ? 0
      : quantityAvailable,
    shortDescription: description || name || productId,
    fullDescription: description || name || productId,
    imageUrl,
  });

  if (!updated) {
    redirect(
      `${basePath}?error=${encodeURIComponent(
        "Unable to update product",
      )}#products`,
    );
  }

  revalidatePath(basePath);
  redirect(
    `${basePath}?success=${encodeURIComponent(
      "Product updated successfully",
    )}#products`,
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

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Products dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Managing products for{" "}
            <span className="font-medium text-slate-700">
              {tenant.businessName}
            </span>{" "}
            ({tenant.tenantId})
          </p>
        </div>

        <form action={handleLogout.bind(null, domain)}>
          <button
            type="submit"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Sign out
          </button>
        </form>
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

      <section
        id="products"
        className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Products
            </h2>
            <span className="text-xs text-slate-400">
              {products.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Promo</th>
                  <th className="px-3 py-2">Best</th>
                  <th className="px-3 py-2">ID</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.productId}
                    className="border-b border-slate-100 text-[11px] text-slate-700 hover:bg-slate-50"
                  >
                    <td className="px-3 py-2 max-w-[180px] truncate">
                      {product.productName}
                    </td>
                    <td className="px-3 py-2">{product.productCategory}</td>
                    <td className="px-3 py-2">
                      {product.currency ?? "₦"}
                      {product.productAmount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{product.quantityAvailable}</td>
                    <td className="px-3 py-2">
                      {product.isPromo ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">
                          Promo
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {product.isBestSelling ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">
                          Best
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2 max-w-[180px] truncate text-[10px] text-slate-400">
                      {product.productId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Add product
            </h2>

            <form
              action={handleCreateProduct.bind(null, domain)}
              className="mt-4 space-y-3"
            >
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-slate-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="price"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="quantity"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="category"
                  className="block text-xs font-medium text-slate-700"
                >
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  placeholder="e.g. Accessories"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="imageUrl"
                  className="block text-xs font-medium text-slate-700"
                >
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="Optional – leave blank to use default image"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
              >
                Create product
              </button>
            </form>
          </div>

          <section
            id="account"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Account settings
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Logged in as{" "}
              <span className="font-medium text-slate-700">
                {tenant.businessEmail}
              </span>{" "}
              for tenant{" "}
              <span className="font-medium text-slate-700">
                {tenant.tenantId}
              </span>
              .
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Use the &ldquo;Forgot password&rdquo; flow on the login screen to
              rotate your admin password securely.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}

