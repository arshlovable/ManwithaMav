import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const OWNER_COOKIE = "mav_owner";
const MAX_AGE_SECONDS = 60 * 60 * 12;

export function ownerAccessConfigured(): boolean {
  return Boolean(process.env.OWNER_ACCESS_SECRET);
}

/** Production without a secret must not expose the calculator. */
export function ownerRouteEnabled(): boolean {
  if (ownerAccessConfigured()) return true;
  return process.env.NODE_ENV !== "production";
}

function secret(): string {
  const value = process.env.OWNER_ACCESS_SECRET;
  if (!value) throw new Error("Owner access is not configured.");
  return value;
}

export function secretsMatch(input: string, expected: string): boolean {
  const left = createHash("sha256").update(input).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export function signOwnerSession(): string {
  const payload = String(Date.now() + MAX_AGE_SECONDS * 1000);
  const mac = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function verifyOwnerSession(token: string | undefined): boolean {
  if (!token || !ownerAccessConfigured()) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export async function isOwnerAuthenticated(): Promise<boolean> {
  if (!ownerAccessConfigured()) return false;
  const jar = await cookies();
  return verifyOwnerSession(jar.get(OWNER_COOKIE)?.value);
}

export function ownerCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}
