'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AuthForm } from '@/components/auth/AuthForm'

/**
 * Login Page - Authentication form with redirect handling
 *
 * Shows the login/signup form for unauthenticated users.
 * Redirects authenticated users to the appropriate page based on onboarding status.
 */
export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // If already authenticated, redirect appropriately
    if (status === 'authenticated' && session) {
      const onboardingComplete = (session.user as any)?.onboardingComplete === true
      router.push(onboardingComplete ? '/today' : '/onboarding/goals')
    }
  }, [session, status, router])

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
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Hero content */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <div className="mb-8">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-gold to-accent-orange bg-clip-text text-transparent">
                Welcome to Daybreak 🌅
              </span>
            </h1>
            <p className="text-xl text-text-secondary mb-8">
              Your deep work companion, inspired by Cal Newport's methodology
            </p>
          </div>

          <blockquote className="text-text-secondary italic mb-8 border-l-4 border-accent-gold pl-6 pr-4 py-6 bg-bg-surface rounded-r-xl max-w-2xl">
            <p className="text-text-primary text-lg mb-4">
              "Deep Work is the ability to focus without distraction on a cognitively demanding task.
              It's a skill that allows you to quickly master complicated information and produce better
              results in less time."
            </p>
            <footer className="text-sm not-italic text-accent-orange font-semibold">
              — Cal Newport
            </footer>
          </blockquote>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { emoji: '🎯', title: 'Focus Sessions', desc: 'Time-blocked deep work' },
              { emoji: '🚫', title: 'Block Distractions', desc: 'App & site blocking' },
              { emoji: '📈', title: 'Track Progress', desc: 'Build consistency' },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.05 }}
                className="bg-bg-elevated border border-border-default rounded-lg p-4"
              >
                <div className="text-3xl mb-2">{feature.emoji}</div>
                <h3 className="font-semibold text-text-primary mb-1">{feature.title}</h3>
                <p className="text-sm text-text-tertiary">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Auth form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <AuthForm />
        </motion.div>
      </div>
    </div>
  )
}
