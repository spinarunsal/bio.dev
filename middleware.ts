/**
 * Middleware — Route Guard.
 *
 * Next.js middleware runs BEFORE every HTTP request.
 * This middleware protects /dashboard/* routes:
 * 1. When a request arrives, the session cookie is checked
 * 2. If no cookie → redirects to /login page
 * 3. If cookie exists → request continues normally
 *
 * NextAuth uses two types of cookies:
 * - `authjs.session-token` (HTTP)
 * - `__Secure-authjs.session-token` (HTTPS/production)
 *
 * Only runs on /dashboard/* routes via the `matcher` config.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /dashboard routes — require auth session
  if (pathname.startsWith("/dashboard")) {
    const token =
      req.cookies.get("authjs.session-token")?.value ||
      req.cookies.get("__Secure-authjs.session-token")?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
