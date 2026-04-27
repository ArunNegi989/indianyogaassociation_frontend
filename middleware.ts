import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // skip static files & api
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // already .html hai to skip
  if (url.pathname.endsWith(".html")) {
    return NextResponse.next();
  }

  // redirect to .html
  return NextResponse.redirect(
    new URL(`${url.pathname}.html`, request.url)
  );
}