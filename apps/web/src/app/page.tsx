import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Root Page - Smart redirect based on authentication state
 *
 * Redirect Logic:
 * - Authenticated + onboarding complete → /today (main app)
 * - Authenticated + onboarding incomplete → /onboarding/goals
 * - Unauthenticated + guest mode enabled → /onboarding (shows auth form)
 * - Unauthenticated + guest mode disabled → /login (shows auth form)
 *
 * Note: Respects NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING to prevent redirect loops
 */
export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    // Authenticated user - check if they've completed onboarding
    const onboardingComplete = (session.user as any)?.onboardingComplete === true
    redirect(onboardingComplete ? '/today' : '/onboarding/goals')
  } else {
    // Unauthenticated user - redirect based on guest mode setting
    const guestModeEnabled = process.env.NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING === 'true'
    redirect(guestModeEnabled ? '/onboarding' : '/login')
  }

  // This will never be reached due to redirects above
  return null
}
