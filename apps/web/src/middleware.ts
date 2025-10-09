import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware for Route Protection
 * 
 * Handles:
 * - Authentication checks
 * - Onboarding flow enforcement
 * - Redirect logic
 */

const PUBLIC_ROUTES = ['/', '/login', '/signup'];
const AUTH_ROUTES = ['/login', '/signup'];
const ONBOARDING_ROUTES = '/onboarding';
const API_ROUTES = '/api';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes to pass through
  if (pathname.startsWith(API_ROUTES)) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get the user's session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isOnboardingRoute = pathname.startsWith(ONBOARDING_ROUTES);

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/today';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from landing page
  if (isAuthenticated && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/today';
    return NextResponse.redirect(url);
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Store the intended destination
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Check onboarding status (you can extend this with database checks)
  // For now, we'll allow all authenticated users to access all routes
  // In production, you'd check user.onboardingComplete from database

  return NextResponse.next();
}

// Configure which routes use middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};

