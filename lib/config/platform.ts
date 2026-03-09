/**
 * Centralised platform identity & branding.
 *
 * These values are safe to use in both server and client modules.
 * Secrets (like RESEND_API_KEY) must remain in server-only code.
 */

export const MAIN_DOMAIN =
  process.env.NEXT_PUBLIC_MAIN_DOMAIN ??
  process.env.MAIN_DOMAIN ??
  "getcheapecommerce.com";

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? `support@${MAIN_DOMAIN}`;

export const FROM_EMAIL =
  process.env.NEXT_PUBLIC_FROM_EMAIL ?? `noreply@${MAIN_DOMAIN}`;

/**
 * High-level branding used across the marketing site and admin.
 * This keeps the platform feeling like a personal ecommerce service
 * instead of exposing the underlying multi-tenant architecture.
 */
export const PLATFORM_BRAND_NAME = "Devbee Ecommerce";

export const PLATFORM_MARKETING_LINE =
  "Done-for-you ecommerce websites launched in about 30 minutes.";

export const PLATFORM_LOGO_URL =
  "https://facementor.app/file/assets/images/profile-image/79872c60-d505-11f0-b8f7-45f322d2a226.png";

export const PLATFORM_FAVICON_URL = PLATFORM_LOGO_URL;
