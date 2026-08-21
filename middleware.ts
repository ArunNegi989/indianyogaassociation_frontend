import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (url.pathname === "/") {
    return NextResponse.next();
  }

  if (url.pathname.endsWith(".html")) {
    return NextResponse.next();
  }

  // ✅ clone preserves the querystring; we only touch pathname
  const redirectUrl = url.clone();
  redirectUrl.pathname = `${url.pathname}.html`;

  return NextResponse.redirect(redirectUrl);
}