import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Redirect old ?sauna= query param URLs to new /s/ path format
  const saunaSlug = searchParams.get("sauna");
  if (saunaSlug && pathname.startsWith("/tools/saunas")) {
    // Don't redirect if already using /s/ path format
    if (!pathname.includes("/s/")) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("sauna");
      url.pathname = `${pathname}/s/${saunaSlug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/tools/saunas/:path*",
};
