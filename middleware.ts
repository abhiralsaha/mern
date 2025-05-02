import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwtToken } from "@/lib/jwt"

// Define protected routes
const protectedRoutes = ["/admin", "/admin/create", "/admin/assign"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (isProtectedRoute) {
    // Get the token from the cookies
    const token = request.cookies.get("token")?.value

    // If there's no token, redirect to login
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Verify the token
      const payload = await verifyJwtToken(token)

      // Check if the user is an admin
      if (!payload.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url))
      }

      // If everything is fine, continue
      return NextResponse.next()
    } catch (error) {
      // If token verification fails, redirect to login
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  // For non-protected routes, continue
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
