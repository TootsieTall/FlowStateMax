/**
 * Navigation Guards
 * 
 * Centralized logic for determining if users can access routes
 * and where to redirect them based on auth state and onboarding status
 */

import { Session } from 'next-auth';
import { ROUTES, isPublicRoute, isOnboardingRoute, isProtectedRoute } from './routes';

export interface NavigationGuardResult {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
}

/**
 * Check if user can access a given route
 */
export function canAccessRoute(
  pathname: string,
  session: Session | null,
  onboardingComplete: boolean = false
): NavigationGuardResult {
  // Public routes - anyone can access
  if (isPublicRoute(pathname)) {
    // If authenticated user tries to access login/signup, redirect to app
    if (session && (pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP)) {
      return {
        allowed: false,
        redirectTo: onboardingComplete ? ROUTES.TODAY : ROUTES.ONBOARDING.ROOT,
        reason: 'Already authenticated',
      };
    }
    
    return { allowed: true };
  }

  // Protected routes require authentication
  if (isProtectedRoute(pathname) || isOnboardingRoute(pathname)) {
    if (!session) {
      return {
        allowed: false,
        redirectTo: ROUTES.LOGIN,
        reason: 'Authentication required',
      };
    }

    // If user hasn't completed onboarding and tries to access main app
    if (!onboardingComplete && !isOnboardingRoute(pathname)) {
      return {
        allowed: false,
        redirectTo: ROUTES.ONBOARDING.ROOT,
        reason: 'Onboarding incomplete',
      };
    }

    // If user has completed onboarding and tries to access onboarding
    if (onboardingComplete && isOnboardingRoute(pathname) && pathname !== ROUTES.ONBOARDING.ROOT) {
      return {
        allowed: false,
        redirectTo: ROUTES.TODAY,
        reason: 'Onboarding already complete',
      };
    }

    return { allowed: true };
  }

  // Unknown routes - allow (will 404 naturally)
  return { allowed: true };
}

/**
 * Get the redirect URL for an authenticated user on homepage
 */
export function getAuthenticatedHomeRedirect(onboardingComplete: boolean): string {
  return onboardingComplete ? ROUTES.TODAY : ROUTES.ONBOARDING.ROOT;
}

/**
 * Get the redirect URL after successful login
 */
export function getPostLoginRedirect(
  onboardingComplete: boolean,
  intendedPath?: string
): string {
  // If user was trying to access a specific path, send them there
  if (intendedPath && intendedPath !== '/' && intendedPath !== ROUTES.LOGIN) {
    return intendedPath;
  }

  // Otherwise, send to appropriate default
  return onboardingComplete ? ROUTES.TODAY : ROUTES.ONBOARDING.ROOT;
}

/**
 * Get the redirect URL after successful onboarding
 */
export function getPostOnboardingRedirect(): string {
  return ROUTES.TODAY;
}

/**
 * Check if user should be redirected from landing page
 */
export function shouldRedirectFromLanding(session: Session | null): string | null {
  if (!session) {
    return null; // Stay on landing page
  }

  // Redirect authenticated users to app
  return ROUTES.TODAY;
}

/**
 * Validate onboarding step access
 */
export function canAccessOnboardingStep(
  currentStep: string,
  completedSteps: string[]
): NavigationGuardResult {
  const steps = [
    ROUTES.ONBOARDING.ROOT,
    ROUTES.ONBOARDING.GOALS,
    ROUTES.ONBOARDING.INTEGRATIONS,
    ROUTES.ONBOARDING.LOCATIONS,
    ROUTES.ONBOARDING.APPS,
    ROUTES.ONBOARDING.RITUAL,
    ROUTES.ONBOARDING.BOREDOM,
    ROUTES.ONBOARDING.RECOVERY,
    ROUTES.ONBOARDING.COMPLETE,
  ] as string[];

  const currentIndex = steps.indexOf(currentStep);
  const lastCompletedIndex = Math.max(
    ...completedSteps.map(step => steps.indexOf(step)),
    -1
  );

  // Can access if it's the next step or any previous step
  if (currentIndex <= lastCompletedIndex + 1) {
    return { allowed: true };
  }

  // Otherwise redirect to next available step
  return {
    allowed: false,
    redirectTo: steps[Math.min(lastCompletedIndex + 1, steps.length - 1)],
    reason: 'Must complete steps in order',
  };
}

/**
 * Get next onboarding step
 */
export function getNextOnboardingStep(currentStep: string): string | null {
  const steps = [
    ROUTES.ONBOARDING.ROOT,
    ROUTES.ONBOARDING.GOALS,
    ROUTES.ONBOARDING.INTEGRATIONS,
    ROUTES.ONBOARDING.LOCATIONS,
    ROUTES.ONBOARDING.APPS,
    ROUTES.ONBOARDING.RITUAL,
    ROUTES.ONBOARDING.BOREDOM,
    ROUTES.ONBOARDING.RECOVERY,
    ROUTES.ONBOARDING.COMPLETE,
  ] as string[];

  const currentIndex = steps.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return null;
  }

  return steps[currentIndex + 1];
}

/**
 * Get previous onboarding step
 */
export function getPreviousOnboardingStep(currentStep: string): string | null {
  const steps = [
    ROUTES.ONBOARDING.ROOT,
    ROUTES.ONBOARDING.GOALS,
    ROUTES.ONBOARDING.INTEGRATIONS,
    ROUTES.ONBOARDING.LOCATIONS,
    ROUTES.ONBOARDING.APPS,
    ROUTES.ONBOARDING.RITUAL,
    ROUTES.ONBOARDING.BOREDOM,
    ROUTES.ONBOARDING.RECOVERY,
    ROUTES.ONBOARDING.COMPLETE,
  ] as string[];

  const currentIndex = steps.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }

  return steps[currentIndex - 1];
}

/**
 * Route access matrix for debugging
 */
export function getRouteAccessMatrix(session: Session | null, onboardingComplete: boolean) {
  const allRoutes = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.TODAY,
    ROUTES.WEEK,
    ROUTES.EXPLORE,
    ROUTES.SETTINGS,
    ROUTES.CAPTURE,
    ROUTES.ONBOARDING.ROOT,
    ROUTES.FLOW.ROOT,
    ROUTES.SHUTDOWN,
  ];

  return allRoutes.map(route => ({
    route,
    access: canAccessRoute(route, session, onboardingComplete),
  }));
}

