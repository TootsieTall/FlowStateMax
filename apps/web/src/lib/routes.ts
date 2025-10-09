/**
 * Centralized Route Constants
 * 
 * All application routes defined in one place to prevent typos and
 * make route changes easier to manage.
 */

// ============================================================================
// PUBLIC ROUTES (No auth required)
// ============================================================================

export const ROUTES = {
  // Landing & Auth
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',

  // ============================================================================
  // MAIN APP ROUTES (Authenticated users)
  // ============================================================================

  // Bottom Navigation Routes
  WEEK: '/week',
  TODAY: '/today',
  EXPLORE: '/explore',
  SETTINGS: '/settings',

  // Additional Features
  CAPTURE: '/capture',

  // ============================================================================
  // ONBOARDING FLOW
  // ============================================================================

  ONBOARDING: {
    ROOT: '/onboarding',
    GOALS: '/onboarding/goals',
    INTEGRATIONS: '/onboarding/integrations',
    LOCATIONS: '/onboarding/locations',
    APPS: '/onboarding/apps',
    RITUAL: '/onboarding/ritual',
    BOREDOM: '/onboarding/boredom',
    RECOVERY: '/onboarding/recovery',
    COMPLETE: '/onboarding/complete',
    
    // Aliases for clarity
    BLOCK_APPS: '/onboarding/apps',
    READY: '/onboarding/complete',
  },

  // ============================================================================
  // FLOW SESSION
  // ============================================================================

  FLOW: {
    ROOT: '/flow',
    ACTIVE: '/flow',
    COMPLETE: '/flow/complete',
  },

  // ============================================================================
  // SHUTDOWN RITUAL
  // ============================================================================

  SHUTDOWN: '/shutdown',

} as const;

/**
 * Flatten routes for easy lookup
 */
export const ALL_ROUTES = {
  ...ROUTES,
  ...ROUTES.ONBOARDING,
  ...ROUTES.FLOW,
} as const;

/**
 * Route Groups for Navigation Guards
 */
export const ROUTE_GROUPS = {
  // Public routes (no auth required)
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
  ],

  // Routes requiring authentication
  PROTECTED: [
    ROUTES.WEEK,
    ROUTES.TODAY,
    ROUTES.EXPLORE,
    ROUTES.SETTINGS,
    ROUTES.CAPTURE,
    ROUTES.SHUTDOWN,
    ROUTES.FLOW.ROOT,
    ROUTES.FLOW.COMPLETE,
  ],

  // Onboarding routes
  ONBOARDING: [
    ROUTES.ONBOARDING.ROOT,
    ROUTES.ONBOARDING.GOALS,
    ROUTES.ONBOARDING.INTEGRATIONS,
    ROUTES.ONBOARDING.LOCATIONS,
    ROUTES.ONBOARDING.APPS,
    ROUTES.ONBOARDING.RITUAL,
    ROUTES.ONBOARDING.BOREDOM,
    ROUTES.ONBOARDING.RECOVERY,
    ROUTES.ONBOARDING.COMPLETE,
  ],

  // Bottom nav tabs
  BOTTOM_NAV: [
    ROUTES.WEEK,
    ROUTES.TODAY,
    ROUTES.EXPLORE,
    ROUTES.SETTINGS,
  ],
} as const;

/**
 * Helper to check if a route requires auth
 */
export function isProtectedRoute(pathname: string): boolean {
  return ROUTE_GROUPS.PROTECTED.some(route => pathname.startsWith(route));
}

/**
 * Helper to check if route is onboarding
 */
export function isOnboardingRoute(pathname: string): boolean {
  return pathname.startsWith(ROUTES.ONBOARDING.ROOT);
}

/**
 * Helper to check if route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return ROUTE_GROUPS.PUBLIC.includes(pathname as any);
}

/**
 * Get the default route for authenticated users
 */
export function getDefaultAuthenticatedRoute(onboardingComplete: boolean): string {
  return onboardingComplete ? ROUTES.TODAY : ROUTES.ONBOARDING.ROOT;
}

/**
 * Navigation helpers
 */
export const NAV = {
  /**
   * Get the next onboarding step
   */
  getNextOnboardingStep(currentPath: string): string | null {
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
    ];

    const currentIndex = steps.indexOf(currentPath);
    if (currentIndex === -1 || currentIndex === steps.length - 1) {
      return null;
    }

    return steps[currentIndex + 1];
  },

  /**
   * Get the previous onboarding step
   */
  getPreviousOnboardingStep(currentPath: string): string | null {
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
    ];

    const currentIndex = steps.indexOf(currentPath);
    if (currentIndex <= 0) {
      return null;
    }

    return steps[currentIndex - 1];
  },
} as const;

/**
 * Bottom Navigation Configuration
 */
export const BOTTOM_NAV_CONFIG = [
  {
    path: ROUTES.WEEK,
    label: 'Week',
    icon: 'Calendar',
  },
  {
    path: ROUTES.TODAY,
    label: 'Today',
    icon: 'CheckCircle',
  },
  {
    path: ROUTES.EXPLORE,
    label: 'Explore',
    icon: 'Compass',
  },
  {
    path: ROUTES.SETTINGS,
    label: 'Settings',
    icon: 'Settings',
  },
] as const;

export default ROUTES;

