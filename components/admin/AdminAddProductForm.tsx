"use client";

import {
  uploadProductMedia,
  type MediaUploadProgress,
} from "@/lib/services/media";
import type { DetailRow } from "@/lib/utils";
import { rowsToProductDetails } from "@/lib/utils";
import type { ProductDetailItem } from "@/types/product-detail";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

type AdminAddProductFormProps = {
  formId: string;
  payloadInputId: string;
  defaultCurrency: string;
  primaryColor: string;
  tenantId: string;
  onCreateOptimistic?: (payload: AdminNewProductPayload) => void;
  isSaving?: boolean;
};

export type AdminNewProductPayload = {
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
  productDetails: ProductDetailItem[];
};

const HARDCODED_AI_PRODUCT_JSON =
  '{"productName":"Iphone 15","productCategory":"Smartphone","productAmount":900000,"discountPrice":90000,"isDetailsTabular":false,"quantityAvailable":30,"isNegotiable":false,"isPromo":true,"productDetails":[{"Specification1":"6.1-inch Super Retina XDR Display"},{"Specification2":"128GB Internal Storage"},{"Specification3":"48MP Dual Rear Camera System"},{"Key Features":["A16 Bionic chip for fast performance","Advanced 5G connectivity","All-day battery life","Durable aluminum and glass design"]}],"shortDescription":"Iphone 15 is a premium smartphone offering powerful performance, advanced camera capabilities, and sleek modern design.","fullDescription":"The Iphone 15 delivers exceptional performance powered by the advanced A16 Bionic chip, ensuring smooth multitasking and efficient energy use. Featuring a vibrant 6.1-inch Super Retina XDR display and a high-resolution 48MP dual camera system, it captures stunning photos and videos with remarkable clarity. With 5G connectivity, durable build quality, and long-lasting battery life, this smartphone is designed to meet the demands of modern users while providing a seamless mobile experience."}';

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

function extractJsonFromMaybeMarkdown(input: string): string {
  let trimmed = input.trim();
  if (trimmed.startsWith("```")) {
    const firstNewline = trimmed.indexOf("\n");
    const lastFence = trimmed.lastIndexOf("```");
    if (firstNewline !== -1 && lastFence !== -1 && lastFence > firstNewline) {
      trimmed = trimmed.substring(firstNewline + 1, lastFence).trim();
    }
  }
  if (trimmed.startsWith("json")) {
    trimmed = trimmed.slice(4).trim();
  }
  return trimmed;
}

export function AdminAddProductForm({
  formId,
  payloadInputId,
  defaultCurrency,
  primaryColor,
  tenantId,
  onCreateOptimistic,
  isSaving,
}: AdminAddProductFormProps) {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState(0);
  const [productAmount, setProductAmount] = useState(0);
  const [currency] = useState(defaultCurrency || "₦");
  const [isPromo, setIsPromo] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [isBestSelling, setIsBestSelling] = useState(false);
  const [isDetailsTabular, setIsDetailsTabular] = useState(true);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [detailRows, setDetailRows] = useState<DetailRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] =
    useState<MediaUploadProgress | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const applyAiProductToForm = (rawJson: string) => {
    const cleaned = extractJsonFromMaybeMarkdown(rawJson);
    const parsed = JSON.parse(cleaned) as {
      productName?: string;
      productCategory?: string;
      productAmount?: number;
      shortDescription?: string;
      fullDescription?: string;
      productDetails?: ProductDetailItem[];
      isPromo?: boolean;
      quantityAvailable?: number;
      isNegotiable?: boolean;
    };

    if (parsed.productName) setProductName(parsed.productName);
    if (parsed.productCategory) setProductCategory(parsed.productCategory);
    if (typeof parsed.productAmount === "number") {
      setProductAmount(parsed.productAmount);
    }
    if (typeof parsed.quantityAvailable === "number") {
      setQuantityAvailable(parsed.quantityAvailable);
    }
    if (typeof parsed.isPromo === "boolean") {
      setIsPromo(parsed.isPromo);
    }
    if (typeof parsed.isNegotiable === "boolean") {
      setIsNegotiable(parsed.isNegotiable);
    }
    if (parsed.shortDescription) setShortDescription(parsed.shortDescription);
    if (parsed.fullDescription) setFullDescription(parsed.fullDescription);
    if (Array.isArray(parsed.productDetails)) {
      const rows: DetailRow[] = [];
      parsed.productDetails.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
          if (value == null) return;
          if (Array.isArray(value)) {
            rows.push({ key, value: value.join(", ") });
          } else if (typeof value === "number") {
            rows.push({
              key,
              value: value.toLocaleString("en-NG"),
            });
          } else {
            rows.push({ key, value: String(value) });
          }
        });
      });
      setDetailRows(rows);
    }

    setDetailsVisible(true);
  };

  const handleGenerateDetails = () => {
    if (quantityAvailable <= 0 || productAmount <= 0) {
      // eslint-disable-next-line no-alert
      alert(
        "Please enter a quantity and price greater than 0 before generating details.",
      );
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      try {
        // Dummy AI implementation – in production this will be replaced
        // by a real API call that uses the seed data.
        const _seed = {
          productName,
          quantityAvailable,
          productAmount,
          isNegotiable,
        };
        void _seed; // avoid unused for now
        applyAiProductToForm(HARDCODED_AI_PRODUCT_JSON);
      } finally {
        setIsGenerating(false);
      }
    }, 3000);
  };

  const handleOpenMediaPicker = () => {
    fileInputRef.current?.click();
  };

  const handleMediaFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const hasExistingVideo = mediaUrls.some((url) => isVideoUrl(url));
    const hasVideoInSelection = files.some((file) =>
      file.type.startsWith("video/"),
    );
    if (hasExistingVideo && hasVideoInSelection) {
      // eslint-disable-next-line no-alert
      alert("Only one video is allowed per product.");
      return;
    }

    setIsUploadingMedia(true);
    setUploadProgress(null);
    try {
      const uploadedUrls = await uploadProductMedia(
        files,
        tenantId,
        (progress) => {
          setUploadProgress(progress);
        },
      );
      const next = [...mediaUrls, ...uploadedUrls].slice(0, 4);
      setMediaUrls(next);
    } finally {
      setIsUploadingMedia(false);
      setUploadProgress(null);
    }
  };

  const handleAddDetailRow = () => {
    setDetailRows((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleSubmitPrepare = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    const input = document.getElementById(
      payloadInputId,
    ) as HTMLInputElement | null;
    if (!form || !input) return;

    const normalizedMedia = normalizeMediaUrls(mediaUrls);
    let videoUrl: string | undefined = undefined;
    const imageUrls: string[] = [];
    normalizedMedia.forEach((url) => {
      if (isVideoUrl(url) && !videoUrl) {
        videoUrl = url;
      } else {
        imageUrls.push(url);
      }
    });

    const productDetails = rowsToProductDetails(detailRows);

    if (imageUrls.length === 0) {
      // Require at least one image for every product.
      // This mirrors the stricter Zod schema on the server.
      // eslint-disable-next-line no-alert
      alert("Please add at least one product image before saving.");
      return;
    }

    const payload: AdminNewProductPayload = {
      productName,
      productCategory,
      productAmount,
      quantityAvailable,
      currency,
      isPromo,
      isNegotiable,
      isBestSelling,
      isDetailsTabular,
      mediaUrls: imageUrls,
      videoUrl,
      shortDescription,
      fullDescription,
      productDetails,
    };

    onCreateOptimistic?.(payload);

    input.value = JSON.stringify(payload);

    // Reset form state after kicking off optimistic create.
    setProductName("");
    setProductCategory("");
    setQuantityAvailable(0);
    setProductAmount(0);
    setIsPromo(false);
    setIsNegotiable(false);
    setIsBestSelling(false);
    setIsDetailsTabular(true);
    setMediaUrls([]);
    setShortDescription("");
    setFullDescription("");
    setDetailRows([]);
    setDetailsVisible(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      id="add-product"
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Add new product
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Use the AI-assisted generator, then review and adjust the details
            below.
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          AI-assisted (simulated)
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Product name
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Quantity
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              value={quantityAvailable.toLocaleString("en-NG")}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/[^\d]/g, "");
                const sanitized = digitsOnly.replace(/^0+(?=\d)/, "");
                const next = parseInt(sanitized || "0", 10);
                setQuantityAvailable(Number.isNaN(next) ? 0 : next);
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Price {currency ? `(${currency})` : ""}
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              value={productAmount.toLocaleString("en-NG")}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/[^\d]/g, "");
                const sanitized = digitsOnly.replace(/^0+(?=\d)/, "");
                const next = Number(sanitized || "0");
                setProductAmount(Number.isNaN(next) ? 0 : next);
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Negotiable
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              value={isNegotiable ? "yes" : "no"}
              onChange={(e) => setIsNegotiable(e.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateDetails}
          disabled={isGenerating}
          className="mt-2 inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
          style={{ backgroundColor: primaryColor }}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate product details"
          )}
        </button>
      </div>

      {detailsVisible && (
        <div
          className="mt-4 space-y-4 rounded-2xl border-2 bg-slate-50/70 p-4 shadow-md"
          style={{ borderColor: primaryColor }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                Generated product details
              </p>
              <p className="text-[11px] text-slate-500">
                Review and fine-tune the AI-filled fields before saving.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Product name
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Category
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                    value={quantityAvailable}
                    onChange={(e) =>
                      setQuantityAvailable(
                        parseInt(e.target.value || "0", 10) || 0,
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Price
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                    value={productAmount}
                    onChange={(e) =>
                      setProductAmount(Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Promo
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                    value={isPromo ? "yes" : "no"}
                    onChange={(e) => setIsPromo(e.target.value === "yes")}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Negotiable
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                    value={isNegotiable ? "yes" : "no"}
                    onChange={(e) => setIsNegotiable(e.target.value === "yes")}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Best selling
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                    value={isBestSelling ? "yes" : "no"}
                    onChange={(e) => setIsBestSelling(e.target.value === "yes")}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Details tabular
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                    value={isDetailsTabular ? "yes" : "no"}
                    onChange={(e) =>
                      setIsDetailsTabular(e.target.value === "yes")
                    }
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleMediaFilesSelected}
                />
                <label className="block text-[11px] font-medium text-slate-700">
                  Media (max 4, max 1 video)
                </label>
                <button
                  type="button"
                  onClick={handleOpenMediaPicker}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isUploadingMedia || mediaUrls.length >= 4}
                >
                  {isUploadingMedia
                    ? uploadProgress?.phase === "compressing"
                      ? "Optimizing video..."
                      : "Uploading media..."
                    : mediaUrls.length > 0
                      ? "Open gallery and add more media"
                      : "Open gallery & pick media"}
                </button>

                {uploadProgress && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-600">
                      <span>
                        {uploadProgress.phase === "compressing"
                          ? "Optimizing video..."
                          : "Uploading media..."}
                      </span>
                      <span>{uploadProgress.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${uploadProgress.percent}%`,
                          backgroundColor: primaryColor,
                        }}
                      />
                    </div>
                  </div>
                )}

                {mediaUrls.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-[10px] font-medium text-slate-600">
                      Selected media
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {mediaUrls.map((url, idx) => {
                        const video = isVideoUrl(url);
                        return (
                          <div
                            key={idx}
                            className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                          >
                            <button
                              type="button"
                              aria-label="Remove media"
                              className="absolute right-1 top-1 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-slate-100 opacity-0 transition group-hover:opacity-100"
                              onClick={() =>
                                setMediaUrls((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                )
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                            <div className="aspect-video w-full bg-slate-200">
                              {video ? (
                                <video
                                  src={url}
                                  className="h-full w-full object-cover"
                                  controls
                                />
                              ) : (
                                <Image
                                  src={url}
                                  alt=""
                                  width={200}
                                  height={100}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="truncate px-2 py-1 text-[9px] text-slate-600">
                              {url}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-slate-500">
                  Media are uploaded to Cloudinary and stored as permanent URLs
                  that your storefront can render instantly.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Short description
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Full description
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {detailsVisible && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Attributes (key / value)
            </span>
            <button
              type="button"
              onClick={handleAddDetailRow}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
            >
              + Add attribute
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
            <table className="min-w-[320px] text-left text-[10px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-slate-500">
                  <th className="px-2 py-1 w-[140px]">Attribute</th>
                  <th className="px-2 py-1">Value</th>
                </tr>
              </thead>
              <tbody>
                {detailRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-2 py-2 text-[10px] text-slate-400"
                    >
                      No attributes yet. Start with something like "RAM",
                      "Battery Capacity", or "Key Features".
                    </td>
                  </tr>
                )}
                {detailRows.map((row, idx) => (
                  <tr key={idx} className="border-t border-slate-100">
                    <td className="px-2 py-1 align-top">
                      <input
                        className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                        placeholder="e.g. RAM or Key Features"
                        value={row.key}
                        onChange={(e) => {
                          const next = [...detailRows];
                          next[idx] = { ...next[idx], key: e.target.value };
                          setDetailRows(next);
                        }}
                      />
                    </td>
                    <td className="px-2 py-1 align-top">
                      <textarea
                        rows={2}
                        className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                        placeholder={
                          row.key.toLowerCase() === "key features"
                            ? "Comma-separated list, e.g. Fast charge, Dual SIM"
                            : "Value"
                        }
                        value={row.value}
                        onChange={(e) => {
                          const next = [...detailRows];
                          next[idx] = { ...next[idx], value: e.target.value };
                          setDetailRows(next);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detailsVisible && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSubmitPrepare}
            disabled={isSaving}
            className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            style={{ backgroundColor: primaryColor }}
          >
            {isSaving ? "Saving..." : "Save product"}
          </button>
        </div>
      )}
    </div>
  );
}
