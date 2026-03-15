/**
 * AI service for product description generation using OpenAI.
 * Prompts are centralized here so you only need to change them in one place.
 */

import OpenAI from "openai";
import type { Result } from "@/types/result";
import type { ProductDetailItem } from "@/types/product-detail";

const MODEL = "gpt-5-mini" as const;

/** Single place for system prompt – change here to update behavior. */
export const AI_SYSTEM_PROMPT =
  "You are an expert e-commerce copywriter for the Nigerian market. Create a compelling, conversion-focused product description and a list of key technical specifications.";

/**
 * Builds the user prompt. Change this template to update the request.
 * Available placeholders: productName, category, features (array).
 */
export function buildProductDetailsUserPrompt(params: {
  productName: string;
  category: string;
  features: string[];
}): string {
  const { productName, category, features } = params;
  const featuresText =
    features.length > 0 ? features.join(", ") : "general product features";
  return `Generate a description for a ${productName} in the ${category} category. Key features: ${featuresText}.`;
}

export type AiProductDetails = {
  shortDescription: string;
  fullDescription: string;
  productDetails: ProductDetailItem[];
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Calls OpenAI to generate product copy and specs.
 * Returns Result; on failure the UI should fall back to manual input.
 */
export async function generateProductDetails(params: {
  productName: string;
  category: string;
  features?: string[];
}): Promise<Result<AiProductDetails>> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY.length < 10) {
    return {
      ok: false,
      error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to .env",
    };
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const userPrompt = buildProductDetailsUserPrompt({
    productName: params.productName,
    category: params.category,
    features: params.features ?? [],
  });

  const responseFormat = `
Respond with a single JSON object (no markdown, no code fence) with exactly these keys:
- shortDescription: string (1–2 sentences for listings)
- fullDescription: string (full marketing description)
- productDetails: array of objects, each with one key (spec name) and value (string or array of strings). Example: [{"Display":"6.1-inch Super Retina XDR"},{"Key Features":["A16 Bionic","5G"]}]
`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: AI_SYSTEM_PROMPT + responseFormat },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      return {
        ok: false,
        error: "OpenAI returned an empty response.",
      };
    }

    const parsed = parseAiProductDetailsResponse(raw);
    if (!parsed) {
      return {
        ok: false,
        error: "Could not parse AI response as valid product details JSON.",
      };
    }

    return { ok: true, data: parsed };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "OpenAI API request failed.";
    return {
      ok: false,
      error: message,
    };
  }
}

/** Strip optional markdown/code fence and parse JSON into AiProductDetails. */
function parseAiProductDetailsResponse(raw: string): AiProductDetails | null {
  let text = raw.trim();
  if (text.startsWith("```")) {
    const start = text.indexOf("\n");
    const end = text.lastIndexOf("```");
    if (start !== -1 && end > start) {
      text = text.slice(start + 1, end).trim();
    }
  }
  if (text.toLowerCase().startsWith("json")) {
    text = text.slice(4).trim();
  }

  try {
    const obj = JSON.parse(text) as unknown;
    if (!obj || typeof obj !== "object") return null;

    const o = obj as Record<string, unknown>;
    const shortDescription =
      typeof o.shortDescription === "string" ? o.shortDescription : "";
    const fullDescription =
      typeof o.fullDescription === "string" ? o.fullDescription : "";
    const productDetails = normalizeProductDetails(o.productDetails);

    return {
      shortDescription,
      fullDescription,
      productDetails,
    };
  } catch {
    return null;
  }
}

function normalizeProductDetails(
  value: unknown,
): ProductDetailItem[] {
  if (!Array.isArray(value)) return [];
  const result: ProductDetailItem[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const entry: ProductDetailItem = {};
    for (const [k, v] of Object.entries(item)) {
      if (v === undefined) continue;
      if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
        entry[k] = v;
      } else if (Array.isArray(v)) {
        entry[k] = v.map(String);
      }
    }
    if (Object.keys(entry).length > 0) result.push(entry);
  }
  return result;
}
