'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only redirect once authentication status is determined
    if (status === 'loading' || hasRedirected) {
      return
    }

    // Redirect based on authentication status
    if (status === 'authenticated' && session) {
      const onboardingComplete = (session.user as any)?.onboardingComplete
      router.replace(onboardingComplete ? '/today' : '/onboarding')
      setHasRedirected(true)
    } else if (status === 'unauthenticated') {
      router.replace('/onboarding')
      setHasRedirected(true)
    }
  }, [session, status, router, hasRedirected])

  // Show loading state while determining auth status and redirecting
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  )
}
