'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { isGuestOnboardingAllowed, isDevMode, getAuthModeMessage } from '@/lib/guest-auth'

export default function OnboardingStart() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [canAccessAsGuest, setCanAccessAsGuest] = useState(false)
  
  useEffect(() => {
    // Check if guest onboarding is allowed
    setCanAccessAsGuest(isGuestOnboardingAllowed() || isDevMode())
  }, [])

  useEffect(() => {
    // If already authenticated, skip to goals
    if (status === 'authenticated' && session) {
      router.push('/onboarding/goals')
    }
  }, [session, status, router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setLoading(true)
    const result = await signIn('credentials', {
      name: name.trim(),
      redirect: false,
    })
    
    if (result?.ok) {
      router.push('/onboarding/goals')
    } else {
      setLoading(false)
    }
  }

  const handleSkipAuth = () => {
    // For guest mode, proceed to goals without authentication
    if (canAccessAsGuest) {
      router.push('/onboarding/goals')
    }
  }

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If already authenticated, show loading while redirecting
  if (status === 'authenticated') {
    return null
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="bg-background-card rounded-2xl shadow-2xl max-w-2xl w-full p-12 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Welcome to FlowState
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your deep work companion, inspired by Cal Newport's methodology
          </p>
          <blockquote className="text-lg italic text-amber-200 mb-8 border-l-4 border-amber-500 pl-6 pr-4 py-4 text-left max-w-lg mx-auto bg-amber-500/10 rounded-r-lg backdrop-blur-sm">
            <span className="text-amber-100">"Deep Work is the ability to focus without distraction on a cognitively demanding task.
            It's a skill that allows you to quickly master complicated information and produce better
            results in less time."</span>
            <footer className="text-sm mt-3 not-italic text-amber-300 font-medium">— Cal Newport</footer>
          </blockquote>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              What's your name?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none bg-primary-800 text-gray-100 placeholder-gray-500"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-coral-600 hover:bg-coral-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-coral-500/20"
          >
            {loading ? 'Starting...' : 'Get Started'}
          </button>

          {/* Guest mode: Skip authentication button */}
          {canAccessAsGuest && (
            <button
              type="button"
              onClick={handleSkipAuth}
              disabled={loading}
              className="w-full mt-3 bg-transparent hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 font-medium px-8 py-3 rounded-lg text-base transition-all border border-gray-600"
            >
              Continue Without Signing In
            </button>
          )}
          
          <p className="mt-4 text-sm text-gray-400 text-center">
            {getAuthModeMessage()}
          </p>
        </form>
      </div>
    </div>
  )
}