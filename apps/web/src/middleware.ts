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

  // DEV BYPASS: Allow access to all routes in dev mode with query param
  // This is useful for testing and can be removed in production
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true' && 
      request.nextUrl.searchParams.get('devBypass') === 'true') {
    console.log('🚧 DEV BYPASS: Allowing access to', pathname);
    return NextResponse.next();
  }

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

  // Allow unauthenticated access to /onboarding (where auth form is located)
  // This prevents redirect loops when guest mode is disabled
  if (pathname === '/onboarding' && !isAuthenticated) {
    console.log('🔓 Allowing unauthenticated access to onboarding page (auth form)');
    return NextResponse.next();
  }

  // GUEST MODE: Allow unauthenticated access to other onboarding routes
  if (isOnboardingRoute && isGuestOnboardingAllowed() && !isAuthenticated) {
    // Allow guest users to access onboarding flow without authentication
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

  // Allow access to public routes (root page handles its own redirect logic)
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

    // Always redirect to /onboarding where the auth form is located
    // This works whether guest mode is enabled or not
    url.pathname = '/onboarding';

    return NextResponse.redirect(url);
  }

  // Check if user needs to complete onboarding before accessing protected routes
  if (isAuthenticated && !isOnboardingRoute) {
    const onboardingComplete = token?.onboardingComplete === true;
    
    console.log(`[Middleware] 🔍 Checking onboarding status for ${pathname}:`, {
      onboardingComplete,
      isGuest,
      userId: token?.sub,
      tokenKeys: Object.keys(token || {})
    });
    
    // If onboarding is not complete and user is NOT a guest
    // (guests get special handling below)
    if (!onboardingComplete && !isGuest) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      console.log('🚧 [Middleware] Redirecting to onboarding - not complete (regular user)');
      return NextResponse.redirect(url);
    }
    
    // If onboarding IS complete, allow access
    if (onboardingComplete) {
      console.log(`✅ [Middleware] Onboarding complete, allowing access to ${pathname}`);
      // Don't return yet - let guest checks run if needed
    }
  }

  // Check if guest user is trying to access main app
  if (isGuest && !isOnboardingRoute) {
    const onboardingComplete = token?.onboardingComplete === true;
    
    console.log('[Middleware] 👤 Guest user accessing main app:', {
      pathname,
      onboardingComplete,
      oauthEnabled: isOAuthEnabled()
    });
    
    // If guest completed onboarding, allow them to use the app
    if (onboardingComplete) {
      console.log('✅ [Middleware] Guest user with completed onboarding, allowing access');
      return NextResponse.next();
    }
    
    // If OAuth is enabled and onboarding not complete, redirect to complete page
    if (isOAuthEnabled()) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding/complete';
      url.searchParams.set('connectAccount', 'true');
      console.log('🔗 [Middleware] Guest needs to connect account');
      return NextResponse.redirect(url);
    }
    
    // If OAuth is disabled, allow them to use the app as guest
    console.log('✅ [Middleware] OAuth disabled, allowing guest access');
    return NextResponse.next();
  }

  console.log(`✅ [Middleware] Allowing access to ${pathname}`);
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

