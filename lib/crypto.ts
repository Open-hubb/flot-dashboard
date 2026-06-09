import { timingSafeEqual } from "crypto"

/**
 * Constant-time string comparison. Avoids leaking how many characters
 * matched (and avoids early-return on length) — used for comparing
 * secrets like the admin password and webhook Basic-Auth header.
 */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    // Run a same-length compare to keep timing roughly constant, then fail.
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
}
