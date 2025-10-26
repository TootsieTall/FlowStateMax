import { redirect } from 'next/navigation'

/**
 * Login Page - Server-side redirect to onboarding
 *
 * This page exists for backward compatibility and SEO purposes.
 * The actual authentication form is located at /onboarding.
 *
 * We use a server-side redirect (not client-side) to avoid
 * redirect loops with middleware and ensure proper navigation.
 */
export default function LoginPage() {
  // Server-side redirect to onboarding where the auth form lives
  redirect('/onboarding')
}
