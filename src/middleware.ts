// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // --- Authentication Check Placeholder ---
  // In a real app, check for a valid session token (e.g., from a cookie)
  // This requires backend integration and secure cookie handling.
  const isAuthenticated = false; // Replace with actual check (e.g., verify cookie/token)
  // --- End Placeholder ---

  const { pathname } = request.nextUrl

  // If trying to access any page other than login and not authenticated, redirect to login
  if (!isAuthenticated && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated and trying to access login, redirect to home (dashboard)
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow the request to proceed if authenticated or accessing the login page
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
