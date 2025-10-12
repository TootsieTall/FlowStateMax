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
      <div className="min-h-screen bg-dawn-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-bark-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If already authenticated, show loading while redirecting
  if (status === 'authenticated') {
    return null
  }
  
  return (
    <div className="min-h-screen bg-dawn-100 flex items-center justify-center p-4">
      <div className="card-elevated max-w-2xl w-full p-12 shadow-warm-2xl animate-bounce-in">
        <div className="text-center mb-8">
          <h1 className="text-display-lg text-gradient-sunset mb-4">
            Welcome to Daybreak 🌅
          </h1>
          <p className="text-h4 text-bark-400 mb-8">
            Your deep work companion, inspired by Cal Newport's methodology
          </p>
          <blockquote className="text-body italic text-gold-700 mb-8 border-l-4 border-gold-400 pl-6 pr-4 py-4 text-left max-w-lg mx-auto bg-gradient-to-r from-gold-100 to-sunset-100 rounded-r-xl shadow-warm-md">
            <span className="text-bark-500">"Deep Work is the ability to focus without distraction on a cognitively demanding task.
            It's a skill that allows you to quickly master complicated information and produce better
            results in less time."</span>
            <footer className="text-caption mt-3 not-italic text-sunset-600 font-semibold">— Cal Newport</footer>
          </blockquote>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-6">
            <label htmlFor="name" className="block text-body-sm font-medium text-bark-400 mb-2">
              What's your name?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="input"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="btn-primary w-full text-lg py-4 shadow-warm-lg hover:shadow-glow-sunset"
          >
            {loading ? 'Starting...' : 'Get Started ✨'}
          </button>

          {/* Guest mode: Skip authentication button */}
          {canAccessAsGuest && (
            <button
              type="button"
              onClick={handleSkipAuth}
              disabled={loading}
              className="btn-ghost w-full mt-3"
            >
              Continue Without Signing In
            </button>
          )}
          
          <p className="mt-4 text-caption text-bark-300 text-center">
            {getAuthModeMessage()}
          </p>
        </form>
      </div>
    </div>
  )
}