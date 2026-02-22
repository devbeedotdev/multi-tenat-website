import { Product } from "@/types/product";

export function toUpper(value: string): string {
  if (!value) return "";

  return value.toUpperCase();
}

export function capitalize(value: string): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function capitalizeFirstWords(value: string): string {
  if (!value) return "";

  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatPrice(
  value: number,
  locale: string = "en-US",
  currency?: string,
): string {
  if (isNaN(value)) return "0";

  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  }

  return new Intl.NumberFormat(locale).format(value);
}

export const getRandomProducts = (products: Array<Product>, count = 10) => {
  const shuffled = [...products]; // Copy the array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled.slice(0, count);
};
