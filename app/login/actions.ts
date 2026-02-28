"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac } from "crypto";

const COOKIE_NAME = "auth-token";

function getSecret(): string {
  return process.env.AUTH_SECRET || process.env.AUTH_PASSWORD || "fallback";
}

function computeToken(): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update("authenticated");
  return hmac.digest("hex");
}

export async function login(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password") as string;
  const expected = process.env.AUTH_PASSWORD;

  if (!expected) {
    return { error: "AUTH_PASSWORD environment variable is not set." };
  }

  if (password !== expected) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, computeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect("/private");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
