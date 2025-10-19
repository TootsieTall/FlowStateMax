'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to onboarding where the proper auth form is
    router.replace('/onboarding')
  }, [router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary">Redirecting...</p>
      </div>
    </div>
  )
}
