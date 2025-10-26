import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Root Page - Smart redirect based on authentication state
 *
 * Redirect Logic:
 * - Authenticated + onboarding complete → /today (main app)
 * - Authenticated + onboarding incomplete → /onboarding/goals
 * - Unauthenticated → /onboarding (shows auth form)
 *
 * Note: /onboarding serves dual purpose:
 * - Shows login/signup form for unauthenticated users
 * - Shows onboarding flow for authenticated users
 */
export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    // Authenticated user - check if they've completed onboarding
    const onboardingComplete = (session.user as any)?.onboardingComplete === true
    redirect(onboardingComplete ? '/today' : '/onboarding/goals')
  } else {
    // Unauthenticated user - send to onboarding (which shows auth form)
    redirect('/onboarding')
  }

  // This will never be reached due to redirects above
  return null
}
