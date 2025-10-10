/**
 * Guest Authentication Utilities
 * 
 * Provides guest user support for onboarding without requiring OAuth.
 * This allows users to complete onboarding before connecting external accounts.
 */

import { User } from 'next-auth';

// Feature flags from environment
export const AUTH_CONFIG = {
  enableOAuth: process.env.NEXT_PUBLIC_ENABLE_OAUTH === 'true',
  allowGuestOnboarding: process.env.NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING === 'true',
  devMode: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
  guestUserId: process.env.DEV_GUEST_USER_ID || 'guest-user-dev-001',
} as const;

/**
 * Check if OAuth is currently enabled
 */
export function isOAuthEnabled(): boolean {
  return AUTH_CONFIG.enableOAuth;
}

/**
 * Check if guest onboarding is allowed
 */
export function isGuestOnboardingAllowed(): boolean {
  return AUTH_CONFIG.allowGuestOnboarding;
}

/**
 * Check if we're in development mode
 */
export function isDevMode(): boolean {
  return AUTH_CONFIG.devMode;
}

/**
 * Create a guest user for onboarding
 */
export function createGuestUser(name?: string): User {
  const timestamp = Date.now();
  return {
    id: `guest-${timestamp}`,
    name: name || 'Guest User',
    email: `guest-${timestamp}@flowstate.local`,
    image: undefined,
    // Custom flag to identify guest users
    isGuest: true,
  } as User & { isGuest: boolean };
}

/**
 * Create a development test user
 */
export function createDevUser(name?: string): User {
  return {
    id: AUTH_CONFIG.guestUserId,
    name: name || 'Dev User',
    email: 'dev@flowstate.local',
    image: undefined,
    isGuest: false,
  } as User;
}

/**
 * Check if a user is a guest user
 */
export function isGuestUser(user: User | null | undefined): boolean {
  if (!user) return false;
  return (user as any).isGuest === true || user.id?.startsWith('guest-') || false;
}

/**
 * Check if a user should be prompted to connect OAuth
 */
export function shouldPromptOAuthConnection(user: User | null | undefined): boolean {
  // Only prompt if OAuth is enabled and user is a guest
  return isOAuthEnabled() && isGuestUser(user);
}

/**
 * Get authentication mode message for UI
 */
export function getAuthModeMessage(): string {
  if (isDevMode()) {
    return 'Development mode - No authentication required';
  }
  if (isGuestOnboardingAllowed() && !isOAuthEnabled()) {
    return 'Guest mode - Complete onboarding without signing in';
  }
  if (isOAuthEnabled()) {
    return 'Sign in with Google to get started';
  }
  return 'Authentication required';
}

/**
 * Get available auth providers
 */
export function getAvailableProviders(): string[] {
  const providers: string[] = [];
  
  if (isDevMode() || isGuestOnboardingAllowed()) {
    providers.push('credentials');
  }
  
  if (isOAuthEnabled()) {
    providers.push('google');
  }
  
  return providers;
}

/**
 * Determine if auth is required for onboarding
 */
export function isAuthRequiredForOnboarding(): boolean {
  // If guest onboarding is allowed, no auth required
  if (isGuestOnboardingAllowed()) {
    return false;
  }
  
  // If OAuth is enabled and guest mode is off, auth is required
  return isOAuthEnabled();
}

