import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the user is trying to access ANY admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    
    // Allow them to visit the login page without a cookie!
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for our secure VIP cookie
    const hasAdminSession = request.cookies.has("admin_session");

    // If they don't have the cookie, redirect them to the login page
    if (!hasAdminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Allow all other traffic (like your public shop) to pass through normally
  return NextResponse.next();
}

// This tells Next.js to only run this bouncer on certain paths for better performance
export const config = {
  matcher: ["/admin/:path*"],
};