import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware for Route Protection with Guest Mode Support
 * 
 * Handles:
 * - Authentication checks
 * - Onboarding flow enforcement
 * - Guest mode for onboarding
 * - Redirect logic
 */

const PUBLIC_ROUTES = ['/', '/login', '/signup'];
const AUTH_ROUTES = ['/login', '/signup'];
const ONBOARDING_ROUTES = '/onboarding';
const API_ROUTES = '/api';

// Feature flags - these are checked server-side from env
function isGuestOnboardingAllowed(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING === 'true';
}

function isOAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_OAUTH === 'true';
}

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
  const isGuest = token?.isGuest === true;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isOnboardingRoute = pathname.startsWith(ONBOARDING_ROUTES);

  // GUEST MODE: Allow unauthenticated access to onboarding
  if (isOnboardingRoute && isGuestOnboardingAllowed() && !isAuthenticated) {
    // Allow guest users to access onboarding without authentication
    console.log('🎫 Guest onboarding access granted for:', pathname);
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    // If they're a guest, send to onboarding; otherwise to main app
    url.pathname = isGuest ? '/onboarding' : '/today';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from landing page (check onboarding status)
  if (isAuthenticated && pathname === '/') {
    const url = request.nextUrl.clone();
    // Check if user completed onboarding (stored in token if available)
    const onboardingComplete = token?.onboardingComplete === true;
    url.pathname = onboardingComplete ? '/today' : '/onboarding';
    return NextResponse.redirect(url);
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // GUEST MODE: Allow authenticated guest users to access onboarding
  if (isOnboardingRoute && isAuthenticated) {
    // Allow both guest and regular users to access onboarding
    return NextResponse.next();
  }

  // Require authentication for protected routes (non-onboarding)
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    
    // If guest mode is enabled, send to onboarding; otherwise to login
    if (isGuestOnboardingAllowed()) {
      url.pathname = '/onboarding';
    } else {
      url.pathname = '/login';
      // Store the intended destination
      url.searchParams.set('callbackUrl', pathname);
    }
    
    return NextResponse.redirect(url);
  }

  // Check if user needs to complete onboarding before accessing protected routes
  if (isAuthenticated && !isOnboardingRoute) {
    const onboardingComplete = token?.onboardingComplete === true;
    
    console.log(`[Middleware] Checking onboarding for ${pathname}:`, {
      onboardingComplete,
      isGuest,
      userId: token?.sub
    });
    
    // If onboarding is not complete and user is trying to access protected routes
    if (!onboardingComplete && !isGuest) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      console.log('🚧 Redirecting to onboarding - not complete');
      return NextResponse.redirect(url);
    }
  }

  // Check if guest user is trying to access main app
  if (isGuest && !isOnboardingRoute) {
    const onboardingComplete = token?.onboardingComplete === true;
    
    // If guest completed onboarding, allow them to use the app
    if (onboardingComplete) {
      console.log('✅ Guest user with completed onboarding, allowing access');
      return NextResponse.next();
    }
    
    // If OAuth is enabled and onboarding not complete, redirect to complete page
    if (isOAuthEnabled()) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding/complete';
      url.searchParams.set('connectAccount', 'true');
      console.log('🔗 Guest needs to connect account');
      return NextResponse.redirect(url);
    }
    
    // If OAuth is disabled, allow them to use the app as guest
    return NextResponse.next();
  }

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

