import type { ProductDetailItem } from "@/types/product-detail";

export type DetailRow = {
  key: string;
  value: string;
};

export function rowsToProductDetails(rows: DetailRow[]): ProductDetailItem[] {
  const details: ProductDetailItem[] = [];

  rows.forEach((row) => {
    const key = row.key.trim();
    if (!key) return;

    const rawValue = row.value.trim();
    if (!rawValue) return;

    if (key.toLowerCase() === "key features") {
      const items = rawValue
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

      details.push({ [key]: items });
    } else {
      details.push({ [key]: rawValue });
    }
  });

  return details;
}

