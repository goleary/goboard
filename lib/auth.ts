import { cookies } from "next/headers";
import { createHmac } from "crypto";

function getSecret(): string {
  return process.env.AUTH_SECRET || process.env.AUTH_PASSWORD || "fallback";
}

function computeToken(): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update("authenticated");
  return hmac.digest("hex");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return false;
  return token === computeToken();
}
