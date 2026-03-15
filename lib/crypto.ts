import crypto from "crypto";

if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length < 32) {
  throw new Error(
    "CRITICAL: ENCRYPTION_KEY must be at least 32 characters.",
  );
}

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

// Derive a 32-byte key from ENCRYPTION_KEY using SHA-256.
function getKey(): Buffer {
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // recommended IV length for AES-GCM

export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;

  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Store as base64(iv).base64(ciphertext).base64(tag)
  return [
    iv.toString("base64"),
    encrypted.toString("base64"),
    authTag.toString("base64"),
  ].join(".");
}

export function decrypt(ciphertext: string | null | undefined): string | null {
  if (!ciphertext) return null;

  try {
    const [ivB64, dataB64, tagB64] = ciphertext.split(".");
    if (!ivB64 || !dataB64 || !tagB64) return null;

    const iv = Buffer.from(ivB64, "base64");
    const data = Buffer.from(dataB64, "base64");
    const authTag = Buffer.from(tagB64, "base64");

    const key = getKey();
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString("utf8");
  } catch {
    // Silently treat invalid/legacy values as missing.
    return null;
  }
}

