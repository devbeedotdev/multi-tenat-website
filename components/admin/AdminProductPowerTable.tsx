"use client";

import type { Product } from "@/types/product";
import type { ProductDetailItem } from "@/types/product-detail";
import { useMemo, useState } from "react";

type AdminProductPowerTableProps = {
  initialProducts: Product[];
  formId: string;
  payloadInputId: string;
  isSaving?: boolean;
};

type EditableProduct = Product;

const HIGH_WATER_MARK = 50;

const isVideoUrl = (url: string) => {
  const lower = url.toLowerCase();
  return (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".ogg") ||
    lower.includes("sample-5s.mp4")
  );
};

function normalizeMediaUrls(urls: string[]): string[] {
  const cleaned = urls
    .map((u) => u.trim())
    .filter((u) => u.length > 0)
    .slice(0, 4);

  const videos = cleaned.filter(isVideoUrl);
  if (videos.length <= 1) return cleaned;

  const firstVideo = videos[0];
  return cleaned.filter((u) => !isVideoUrl(u)).concat(firstVideo);
}

function detailEntries(details: ProductDetailItem[]): [string, any, number][] {
  const entries: [string, any, number][] = [];
  details.forEach((item, idx) => {
    Object.entries(item).forEach(([key, value]) => {
      if (value === undefined) return;
      entries.push([key, value, idx]);
    });
  });
  return entries;
}

function applyDetailChange(
  details: ProductDetailItem[],
  index: number,
  key: string,
  rawValue: string,
): ProductDetailItem[] {
  const next = [...details];
  const base: ProductDetailItem = { ...(next[index] || {}) };

  if (key.toLowerCase() === "key features") {
    const items = rawValue
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    base[key] = items.length ? items : undefined;
  } else {
    base[key] = rawValue || undefined;
  }

  next[index] = base;
  return next;
}

export function AdminProductPowerTable({
  initialProducts,
  formId,
  payloadInputId,
  isSaving,
}: AdminProductPowerTableProps) {
  const [rows, setRows] = useState<EditableProduct[]>(() =>
    initialProducts.map((p) => ({ ...p })),
  );
  const [openMediaFor, setOpenMediaFor] = useState<string | null>(null);
  const [openDetailsFor, setOpenDetailsFor] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    return JSON.stringify(rows) !== JSON.stringify(initialProducts);
  }, [rows, initialProducts]);

  const updateRow = (id: string, updater: (row: EditableProduct) => void) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.productId !== id) return row;
        const next = { ...row };
        updater(next);
        return next;
      }),
    );
  };

  const handleRefillQuantities = () => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.quantityAvailable >= HIGH_WATER_MARK) return row;
        return { ...row, quantityAvailable: HIGH_WATER_MARK };
      }),
    );
  };

  const handleConfirm = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    const input = document.getElementById(
      payloadInputId,
    ) as HTMLInputElement | null;
    if (!form || !input) return;
    input.value = JSON.stringify(rows);
    form.requestSubmit();
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[1350px] text-left text-[11px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 w-[180px]">Name</th>
              <th className="px-3 py-2 w-[140px]">Category</th>
              <th className="px-3 py-2 w-[120px]">Price</th>
              <th className="px-3 py-2 w-[120px]">
                <div className="flex items-center justify-between gap-2">
                  <span>Qty</span>
                  <button
                    type="button"
                    onClick={handleRefillQuantities}
                    className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Refill
                  </button>
                </div>
              </th>
              <th className="px-3 py-2 w-[120px]">Promo</th>
              <th className="px-3 py-2 w-[120px]">Discount</th>
              <th className="px-3 py-2 w-[120px]">Details tabular</th>
              <th className="px-3 py-2 w-[140px]">Negotiable</th>
              <th className="px-3 py-2 w-[160px]">Media</th>
              <th className="px-3 py-2 w-[160px]">Details</th>
              <th className="px-3 py-2 w-[220px]">Short description</th>
              <th className="px-3 py-2 w-[260px]">Full description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => {
              const primaryMedia = product.mediaUrls[0];
              const isPromo = product.isPromo;
              const isNegotiable = product.isNegotiable;
              const isDetailsTabular = product.isDetailsTabular;

              return (
                <tr
                  key={product.productId}
                  className="border-b border-slate-100 align-top hover:bg-slate-50"
                >
                  <td className="px-3 py-2 align-top">
                    <input
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      value={product.productName}
                      onChange={(e) =>
                        updateRow(product.productId, (row) => {
                          row.productName = e.target.value;
                        })
                      }
                    />
                  </td>

                  <td className="px-3 py-2 align-top">
                    <input
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      value={product.productCategory}
                      onChange={(e) =>
                        updateRow(product.productId, (row) => {
                          row.productCategory = e.target.value;
                        })
                      }
                    />
                  </td>

                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      value={product.productAmount.toLocaleString("en-NG")}
                      onChange={(e) =>
                        updateRow(product.productId, (row) => {
                          const raw = e.target.value.replace(/,/g, "");
                          const next = Number(raw);
                          row.productAmount = Number.isNaN(next) ? 0 : next;
                        })
                      }
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      value={product.quantityAvailable}
                      onChange={(e) =>
                        updateRow(product.productId, (row) => {
                          const next = parseInt(e.target.value || "0", 10);
                          row.quantityAvailable = Number.isNaN(next) ? 0 : next;
                        })
                      }
                    />
                  </td>

                  <td className="px-3 py-2 align-top">
                    <select
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      value={isPromo ? "yes" : "no"}
                      onChange={(e) =>
                        updateRow(product.productId, (row) => {
                          row.isPromo = e.target.value === "yes";
                        })
                      }
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </td>

                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      value={(product.discountPrice ?? 0).toLocaleString(
                        "en-NG",
                      )}
                      onChange={(e) =>
                        updateRow(product.productId, (row) => {
                          const raw = e.target.value.replace(/,/g, "");
                          const next = Number(raw);
                          const value = Number.isNaN(next) ? 0 : next;
                          row.discountPrice = value > 0 ? value : 0;
                        })
                      }
                    />
                  </td>

                  <td className="px-3 py-2 align-top">
                    <select
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      value={isDetailsTabular ? "yes" : "no"}
                      onChange={(e) =>
                        updateRow(product.productId, (row) => {
                          row.isDetailsTabular = e.target.value === "yes";
                        })
                      }
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1">
                      <select
                        className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                        value={isNegotiable ? "yes" : "no"}
                        onChange={(e) =>
                          updateRow(product.productId, (row) => {
                            row.isNegotiable = e.target.value === "yes";
                          })
                        }
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isNegotiable
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isNegotiable ? "NEGOTIABLE" : "Fixed price"}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-100"
                      onClick={() =>
                        setOpenMediaFor(
                          openMediaFor === product.productId
                            ? null
                            : product.productId,
                        )
                      }
                    >
                      <span className="inline-block h-6 w-6 overflow-hidden rounded bg-slate-200">
                        {primaryMedia && !isVideoUrl(primaryMedia) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={primaryMedia}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[9px] text-slate-500">
                            {primaryMedia ? "Video" : "No media"}
                          </span>
                        )}
                      </span>
                      <span>Media ({product.mediaUrls.length})</span>
                    </button>

                    {openMediaFor === product.productId && (
                      <div className="mt-2 w-[420px] max-w-[90vw] space-y-1 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                        <p className="text-[10px] text-slate-500">
                          Up to 4 URLs. At most one can be a video (.mp4, .webm,
                          .ogg).
                        </p>
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <input
                            key={idx}
                            className="mt-1 w-full rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            placeholder={`Media URL ${idx + 1}`}
                            value={product.mediaUrls[idx] ?? ""}
                            onChange={(e) => {
                              const urls = [...product.mediaUrls];
                              urls[idx] = e.target.value;
                              const normalized = normalizeMediaUrls(urls);
                              updateRow(product.productId, (row) => {
                                row.mediaUrls = normalized;
                              });
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="px-3 py-2 align-top">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-100"
                      onClick={() =>
                        setOpenDetailsFor(
                          openDetailsFor === product.productId
                            ? null
                            : product.productId,
                        )
                      }
                    >
                      Configure details
                    </button>

                    {openDetailsFor === product.productId && (
                      <div className="mt-2 max-h-80 w-[520px] max-w-[95vw] space-y-2 overflow-auto rounded-xl border border-slate-200 bg-white p-4 text-[10px] shadow-xl">
                        <p className="mb-1 text-[10px] text-slate-500">
                          Edit attribute/value pairs. For{" "}
                          <strong>Key Features</strong>, use a comma-separated
                          list.
                        </p>
                        <table className="min-w-full border-collapse text-left text-[10px]">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                              <th className="px-2 py-1 w-[120px]">Attribute</th>
                              <th className="px-2 py-1">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailEntries(product.productDetails).map(
                              ([key, value, idx]) => (
                                <tr key={`${key}-${idx}`}>
                                  <td className="px-2 py-1 align-top">
                                    <input
                                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                                      value={key}
                                      disabled
                                    />
                                  </td>
                                  <td className="px-2 py-1 align-top">
                                    <textarea
                                      rows={2}
                                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                                      value={
                                        Array.isArray(value)
                                          ? value.join(", ")
                                          : String(value)
                                      }
                                      onChange={(e) => {
                                        const nextDetails = applyDetailChange(
                                          product.productDetails,
                                          idx,
                                          key,
                                          e.target.value,
                                        );
                                        updateRow(product.productId, (row) => {
                                          row.productDetails = nextDetails;
                                        });
                                      }}
                                    />
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </td>

                  <td className="px-3 py-2 align-top">
                    <textarea
                      rows={2}
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:min-h-[80px]"
                      value={product.shortDescription}
                      onChange={(e) =>
                        updateRow(product.productId, (row) => {
                          row.shortDescription = e.target.value;
                        })
                      }
                    />
                  </td>

                  <td className="px-3 py-2 align-top">
                    <textarea
                      rows={3}
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:min-h-[120px]"
                      value={product.fullDescription}
                      onChange={(e) =>
                        updateRow(product.productId, (row) => {
                          row.fullDescription = e.target.value;
                        })
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sticky bottom-0 left-0 right-0 mt-4 border-t border-slate-200 bg-slate-50/95 px-3 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            {hasChanges
              ? "You have unsaved changes. Confirm to sync with the server."
              : "No local changes."}
          </div>
          <button
            type="button"
            disabled={!hasChanges || isSaving}
            onClick={handleConfirm}
            className={`inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition ${
              !hasChanges || isSaving
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {isSaving ? "Syncing..." : "Confirm update"}
          </button>
        </div>
      </div>
    </div>
  );
}
