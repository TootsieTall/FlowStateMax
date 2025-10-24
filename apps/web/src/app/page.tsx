import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  // Get session on the server
  const session = await getServerSession(authOptions)

  // Server-side redirect based on authentication status
  if (session) {
    // User is authenticated - check onboarding status
    const onboardingComplete = (session.user as any)?.onboardingComplete === true
    redirect(onboardingComplete ? '/today' : '/onboarding')
  } else {
    // User is not authenticated - send to onboarding
    redirect('/onboarding')
  }

  // This will never be reached due to redirects above
  return null
}
