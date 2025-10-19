'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'

type AuthMode = 'signin' | 'signup'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        // Create account
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create account')
        }

        // Auto sign in after signup
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error('Account created but login failed. Please try logging in.')
        }

        router.push('/onboarding/goals')
      } else {
        // Sign in
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error('Invalid email or password')
        }

        // Check if user has completed onboarding
        const userResponse = await fetch('/api/onboarding/complete')
        const userData = await userResponse.json()

        if (userData.onboardingComplete) {
          router.push('/today')
        } else {
          router.push('/onboarding/goals')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-bg-elevated rounded-2xl border border-accent-gold/30 p-8 shadow-glow-strong"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-accent-gold to-accent-orange bg-clip-text text-transparent">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </span>
          </h2>
          <p className="text-text-secondary">
            {mode === 'signup'
              ? 'Start your deep work journey'
              : 'Continue your practice'}
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input pl-11"
                  placeholder="Your name"
                  required={mode === 'signup'}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input pl-11"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input pl-11 pr-11"
                placeholder="••••••••"
                required
                minLength={8}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {mode === 'signup' && (
              <p className="mt-1 text-xs text-text-tertiary">
                At least 8 characters
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-gold to-accent-orange text-bg-primary font-semibold text-lg py-4 rounded-lg shadow-glow-strong hover:shadow-glow-interactive transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
              </span>
            ) : (
              <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
            )}
          </motion.button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup')
              setError('')
            }}
            disabled={loading}
            className="text-text-secondary hover:text-accent-gold transition-colors text-sm disabled:opacity-50"
          >
            {mode === 'signup' ? (
              <>Already have an account? <span className="font-semibold">Sign in</span></>
            ) : (
              <>Don't have an account? <span className="font-semibold">Sign up</span></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
