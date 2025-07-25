import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  // Protected routes that require authentication
  const protectedRoutes = ["/tickets", "/payments", "/profile", "/booking"]
  const adminRoutes = ["/admin"]

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // For admin routes, we'll let the client-side handle the role check
  // since we can't decode JWT in middleware without additional setup
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/tickets/:path*", "/payments/:path*", "/profile/:path*", "/booking/:path*", "/admin/:path*"],
}
