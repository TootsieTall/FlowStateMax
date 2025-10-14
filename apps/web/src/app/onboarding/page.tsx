'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  // If already authenticated, show loading while redirecting
  if (status === 'authenticated') {
    return null
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 p-12 shadow-glow-strong">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-gold to-accent-orange bg-clip-text text-transparent">
                Welcome to Daybreak 🌅
              </span>
            </h1>
            <p className="text-xl text-text-secondary mb-8">
              Your deep work companion, inspired by Cal Newport's methodology
            </p>
            <blockquote className="text-text-secondary italic mb-8 border-l-4 border-accent-gold pl-6 pr-4 py-4 text-left max-w-lg mx-auto bg-bg-surface rounded-r-xl">
              <span className="text-text-primary">"Deep Work is the ability to focus without distraction on a cognitively demanding task.
              It's a skill that allows you to quickly master complicated information and produce better
              results in less time."</span>
              <footer className="text-sm mt-3 not-italic text-accent-orange font-semibold">— Cal Newport</footer>
            </blockquote>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full bg-gradient-to-r from-accent-gold to-accent-orange text-bg-primary font-bold text-lg py-4 rounded-lg shadow-glow-strong hover:shadow-glow-interactive transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Starting...' : 'Get Started ✨'}
            </motion.button>

            {/* Guest mode: Skip authentication button */}
            {canAccessAsGuest && (
              <button
                type="button"
                onClick={handleSkipAuth}
                disabled={loading}
                className="w-full mt-3 bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary px-4 py-2 rounded-lg transition-all"
              >
                Continue Without Signing In
              </button>
            )}

            <p className="mt-4 text-sm text-text-tertiary text-center">
              {getAuthModeMessage()}
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}