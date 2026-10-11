import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "hbs_session_token";
const ADMIN_ONLY_PATHS = [
  "/admin/users",
  "/admin/settings",
  "/admin/audit-logs",
  "/admin/services",
  "/admin/news",
  "/admin/testimonials",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Decode session payload for client role check in middleware
    try {
      const [base64Payload] = token.split(".");
      if (base64Payload) {
        const payloadText = Buffer.from(base64Payload, "base64url").toString("utf-8");
        const payload = JSON.parse(payloadText);

        // Enforce Admin vs Staff role restrictions
        if (payload.role === "staff" && ADMIN_ONLY_PATHS.some((path) => pathname.startsWith(path))) {
          const forbiddenUrl = new URL("/admin/overview", request.url);
          forbiddenUrl.searchParams.set("error", "forbidden");
          return NextResponse.redirect(forbiddenUrl);
        }
      }
    } catch (err) {
      console.error("Middleware token parse error:", err);
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
