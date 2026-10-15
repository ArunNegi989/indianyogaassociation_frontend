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

  if (
    pathname.startsWith(
      "/yoga-teacher-training/yoga-teacher-training-"
    )
  ) {
    return NextResponse.next();
  }

  const redirectUrl = url.clone();
  redirectUrl.pathname = `${pathname}.html`;

  return NextResponse.redirect(redirectUrl, 301);
}

export const config = {
  matcher: ["/:path*"],
};