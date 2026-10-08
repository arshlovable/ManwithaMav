"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  OWNER_COOKIE,
  ownerAccessConfigured,
  ownerCookieOptions,
  secretsMatch,
  signOwnerSession,
} from "@/lib/owner-auth";

export async function ownerLogin(formData: FormData): Promise<{ error: string } | void> {
  if (!ownerAccessConfigured()) {
    return { error: "Owner access is not configured on this server." };
  }
  const password = String(formData.get("password") ?? "");
  if (!secretsMatch(password, process.env.OWNER_ACCESS_SECRET ?? "")) {
    return { error: "That access key is not valid." };
  }
  const jar = await cookies();
  jar.set(OWNER_COOKIE, signOwnerSession(), ownerCookieOptions());
  redirect("/owner/calculator");
}

export async function ownerLogout(): Promise<void> {
  const jar = await cookies();
  jar.delete(OWNER_COOKIE);
  redirect("/owner/calculator");
}
