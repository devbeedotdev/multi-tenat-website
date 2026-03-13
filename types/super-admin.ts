export interface SuperAdmin {
  /** Main platform domain that owns the super admin console */
  id: string;
  /** Login identifier for the super admin */
  email: string;
  /** Plain-text password for mock purposes only (will be replaced with hashes later) */
  password: string;
  /** Primary WhatsApp contact for the platform (format: 234...) */
  phoneNumber: string;
  /** SEO + marketing copy for the main landing page */
  landingSeoTitle?: string;
  landingSeoDescription?: string;
  landingSeoKeywords?: string;
  createdAt: string;
}
