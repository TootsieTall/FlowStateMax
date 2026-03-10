import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Root Page - Smart redirect based on authentication state
 *
 * Redirect Logic:
 * - DEV: ?devBypass=true (or dev_bypass cookie) → /today (skips auth)
 * - Authenticated + onboarding complete → /today (main app)
 * - Authenticated + onboarding incomplete → /onboarding/goals
 * - Unauthenticated → /onboarding (shows auth form)
 *
 * Note: /onboarding is always accessible and contains the auth form
 */
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // DEV BYPASS: ?devBypass=true skips auth and jumps straight to the app.
  // The middleware sets a session cookie on this param so subsequent requests
  // also bypass. Only active when NEXT_PUBLIC_DEV_MODE=true.
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    const hasBypassParam = searchParams.devBypass === 'true'
    const cookieStore = cookies()
    const hasBypassCookie = cookieStore.get('dev_bypass')?.value === 'true'

    if (hasBypassParam || hasBypassCookie) {
      redirect('/today')
    }
  }

  const session = await getServerSession(authOptions)

  if (session) {
    // Authenticated user - check if they've completed onboarding
    const onboardingComplete = (session.user as any)?.onboardingComplete === true
    redirect(onboardingComplete ? '/today' : '/onboarding/goals')
  } else {
    // Unauthenticated user - send to onboarding where auth form is located
    redirect('/onboarding')
  }

  // This will never be reached due to redirects above
  return null
}
