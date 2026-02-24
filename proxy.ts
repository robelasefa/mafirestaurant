import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Protect staff routes but exclude the login page itself
  if (path.startsWith("/staff") && !path.startsWith("/staff/login")) {
    if (!token || (token.role !== "admin" && token.role !== "staff")) {
      const url = new URL("/staff/login", req.url);
      return NextResponse.redirect(url);
    }

    // Force password change protocol
    if (token.needsPasswordChange && !path.startsWith("/staff/setup-password") && !path.startsWith("/api/staff/setup-password")) {
      const url = new URL("/staff/setup-password", req.url);
      return NextResponse.redirect(url);
    }
  }

  // Redirect baseline /staff to appropriate dashboard per role
  if (path === "/staff") {
    if (token?.role === "admin") {
      return NextResponse.redirect(new URL("/staff/admin/dashboard", req.url));
    } else if (token?.role === "staff") {
      return NextResponse.redirect(new URL("/staff/manage-bookings", req.url));
    }
  }

  // Add Admin protection layer
  if (path.startsWith("/staff/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/staff/manage-bookings", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*", "/api/staff/admin/:path*"],
};
