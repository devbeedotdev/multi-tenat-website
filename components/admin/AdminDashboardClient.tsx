"use client";

import { useOptimistic, useRef, useTransition } from "react";
import type { Product } from "@/types/product";
import type { Tenant } from "@/types/tenant";
import { AdminProductPowerTable } from "@/components/admin/AdminProductPowerTable";
import { AdminAddProductForm } from "@/components/admin/AdminAddProductForm";
import {
  handleBulkUpdate,
  handleCreateProduct,
  handleDeleteProduct,
} from "@/app/[domain]/admin/actions";

type AdminDashboardClientProps = {
  initialProducts: Product[];
  tenant: Tenant;
  domain: string;
  bulkFormId: string;
  bulkPayloadInputId: string;
  addFormId: string;
  addPayloadInputId: string;
  deleteFormId: string;
};

type NewProductPayload = {
  productName: string;
  productCategory: string;
  productAmount: number;
  quantityAvailable: number;
  currency: string;
  isPromo: boolean;
  isNegotiable: boolean;
  isBestSelling: boolean;
  isDetailsTabular: boolean;
  mediaUrls: string[];
  videoUrl?: string;
  shortDescription: string;
  fullDescription: string;
  productDetails: Product["productDetails"];
};

export function AdminDashboardClient({
  initialProducts,
  tenant,
  domain,
  bulkFormId,
  bulkPayloadInputId,
  addFormId,
  addPayloadInputId,
  deleteFormId,
}: AdminDashboardClientProps) {
  const [optimisticProducts, addOptimisticProduct] = useOptimistic<
    Product[],
    Product
  >(initialProducts, (state, newProduct) => [...state, newProduct]);

  const [isSavingProduct, startSavingProduct] = useTransition();
  const [isSyncingTable, startSyncingTable] = useTransition();

  const addFormRef = useRef<HTMLFormElement | null>(null);

  const handleCreateOptimisticProduct = (payload: NewProductPayload) => {
    const optimisticProduct: Product = {
      productId: `temp-${Date.now()}`,
      tenantId: tenant.tenantId,
      productName: payload.productName,
      productCategory: payload.productCategory,
      productAmount: payload.productAmount,
      discountPrice: 0,
      isDetailsTabular: payload.isDetailsTabular,
      quantityAvailable: payload.quantityAvailable,
      isNegotiable: payload.isNegotiable,
      isPromo: payload.isPromo,
      isBestSelling: payload.isBestSelling,
      productDetails: payload.productDetails ?? [],
      mediaUrls: payload.mediaUrls ?? [],
      shortDescription: payload.shortDescription,
      fullDescription: payload.fullDescription,
      currency: payload.currency,
    };

    addOptimisticProduct(optimisticProduct);

    const form = addFormRef.current;
    if (!form) return;

    startSavingProduct(() => {
      form.requestSubmit();
    });
  };

  const handleConfirmBulkUpdate = (rows: Product[]) => {
    const form = document.getElementById(bulkFormId) as HTMLFormElement | null;
    const input = document.getElementById(
      bulkPayloadInputId,
    ) as HTMLInputElement | null;
    if (!form || !input) return;
    input.value = JSON.stringify(rows);
    startSyncingTable(() => {
      form.requestSubmit();
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const form = document.getElementById(
      deleteFormId,
    ) as HTMLFormElement | null;
    const input = form?.querySelector<HTMLInputElement>(
      'input[name="productId"]',
    );
    if (!form || !input) return;
    input.value = productId;
    form.requestSubmit();
  };

  return (
    <>
      <div id="products-table">
        <form id={bulkFormId} action={handleBulkUpdate.bind(null, domain)}>
          <input type="hidden" name="payload" id={bulkPayloadInputId} />
          <AdminProductPowerTable
            initialProducts={optimisticProducts}
            formId={bulkFormId}
            payloadInputId={bulkPayloadInputId}
            currency={tenant.currency}
            tenantId={tenant.tenantId}
            isSaving={isSyncingTable}
            deleteFormId={deleteFormId}
            onConfirm={handleConfirmBulkUpdate}
            onDelete={handleDeleteProduct}
          />
        </form>
      </div>

      <form
        id={addFormId}
        ref={addFormRef}
        action={handleCreateProduct.bind(null, domain)}
      >
        <input type="hidden" name="payload" id={addPayloadInputId} />
        <AdminAddProductForm
          formId={addFormId}
          payloadInputId={addPayloadInputId}
          defaultCurrency={tenant.currency}
          primaryColor={tenant.primaryColor}
          tenantId={tenant.tenantId}
          onCreateOptimistic={handleCreateOptimisticProduct}
          isSaving={isSavingProduct}
        />
      </form>
    </>
  );
}

