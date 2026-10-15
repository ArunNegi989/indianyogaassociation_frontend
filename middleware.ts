
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.next();
  }

  // Redirect clean URLs to .html permanently
  const redirectUrl = url.clone();
  redirectUrl.pathname = `${pathname}.html`;

  return NextResponse.redirect(redirectUrl, 301);
}
