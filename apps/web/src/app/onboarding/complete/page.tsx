'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CheckCircle, Calendar, Target, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import ConnectAccountPrompt from '@/components/ConnectAccountPrompt'
import { shouldPromptOAuthConnection } from '@/lib/guest-auth'

export default function OnboardingComplete() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, update: updateSession } = useSession()
  const [userName, setUserName] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showOAuthPrompt, setShowOAuthPrompt] = useState(false)
  const [showDevTools, setShowDevTools] = useState(false)
  const [stats, setStats] = useState({ goals: 0, rituals: 0, apps: 0 })

  useEffect(() => {
    // Get user name from session or default
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('flowstate_user_name') || 'there'
      setUserName(storedName)
      
      // Calculate dynamic stats from localStorage
      const goalsData = localStorage.getItem('flowstate_goals')
      const ritualsData = localStorage.getItem('flowstate_ritual_items')
      const appsData = localStorage.getItem('flowstate_blocked_apps')
      
      let goalsCount = 0
      let ritualsCount = 0
      let appsCount = 0
      
      // Count goals
      if (goalsData) {
        try {
          const goals = JSON.parse(goalsData)
          if (Array.isArray(goals)) {
            goalsCount = goals.length
          }
        } catch (e) {
          console.error('Failed to parse goals data', e)
        }
      }
      
      // Count rituals (only checked items)
      if (ritualsData) {
        try {
          const rituals = JSON.parse(ritualsData)
          if (Array.isArray(rituals)) {
            ritualsCount = rituals.filter((r: any) => r.checked).length
          }
        } catch (e) {
          console.error('Failed to parse rituals data', e)
        }
      }
      
      // Count blocked apps
      if (appsData) {
        try {
          const apps = JSON.parse(appsData)
          if (Array.isArray(apps)) {
            appsCount = apps.length
          }
        } catch (e) {
          console.error('Failed to parse apps data', e)
        }
      }
      
      setStats({ goals: goalsCount, rituals: ritualsCount, apps: appsCount })
    }

    // Check if we should show OAuth connection prompt
    const connectAccount = searchParams.get('connectAccount')
    if (connectAccount === 'true' || shouldPromptOAuthConnection(session?.user)) {
      setShowOAuthPrompt(true)
    }

    // Show dev tools in development mode
    setShowDevTools(process.env.NEXT_PUBLIC_DEV_MODE === 'true')
  }, [session, searchParams])

  const handleGetStarted = async () => {
    setIsRedirecting(true)
    
    // Parse data from localStorage
    const parseLocalStorage = (key: string) => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch {
        return localStorage.getItem(key)
      }
    }
    
    // Mark onboarding as complete in database
    try {
      console.log('🚀 Starting onboarding completion...')
      
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goals: parseLocalStorage('flowstate_goals'),
          recoveryActivities: parseLocalStorage('flowstate_recovery_activities'),
          trackRecovery: parseLocalStorage('flowstate_track_recovery'),
          hobbiesToTry: parseLocalStorage('flowstate_hobbies_to_try'),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Failed to mark onboarding complete:', errorText)
        alert('Failed to complete onboarding. Please try again.')
        setIsRedirecting(false)
        return
      }
      
      const data = await response.json()
      console.log('✅ Onboarding marked as complete:', data)
      
      // CRITICAL: Update the session to refresh the JWT token
      // This ensures middleware sees the updated onboardingComplete status
      console.log('🔄 Updating session...')
      try {
        const sessionUpdateResult = await updateSession()
        console.log('✅ Session updated:', sessionUpdateResult)
        
        // Wait a moment for the session to fully propagate
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Now redirect - the middleware should have the updated token
        console.log('🎯 Redirecting to /today...')
        router.push('/today')
      } catch (sessionError) {
        console.error('⚠️ Session update failed:', sessionError)
        // Force a full page reload to ensure the JWT is refreshed
        console.log('🔄 Forcing full page reload to refresh session...')
        window.location.href = '/today'
      }
      
    } catch (error) {
      console.error('❌ Error marking onboarding complete:', error)
      alert('An error occurred. Please try again or refresh the page.')
      setIsRedirecting(false)
    }
  }

  return (
    <>
      {/* OAuth Connection Prompt Modal */}
      {showOAuthPrompt && (
        <ConnectAccountPrompt 
          onDismiss={() => setShowOAuthPrompt(false)}
          showDismiss={true}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-3xl w-full"
        >
          <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 p-12 shadow-glow-strong">
            {/* Success Icon with pulse animation */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-gradient-to-br from-accent-gold to-accent-orange rounded-full p-6 shadow-glow-strong">
                <Sparkles className="w-16 h-16 text-bg-primary" />
              </div>
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-accent-gold to-accent-orange bg-clip-text text-transparent">
                You're All Set{userName ? `, ${userName}` : ''}!
              </span>
            </h1>
            <p className="text-xl text-text-secondary text-center mb-8">
              Your deep work journey begins now
            </p>

            {/* Summary cards with stagger animation */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {[
                { icon: Target, label: 'Goals Set', value: stats.goals },
                { icon: Calendar, label: 'Rituals Ready', value: stats.rituals },
                { icon: Sparkles, label: 'Apps Blocked', value: stats.apps }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="bg-bg-surface rounded-lg p-4 text-center border border-accent-gold/20"
                >
                  <item.icon className="w-8 h-8 text-accent-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text-primary">{item.value}</div>
                  <div className="text-sm text-text-secondary">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* What's Next Section */}
            <div className="bg-bg-surface border border-accent-gold/20 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-3">What happens next?</h2>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-gold" />
                  <span>Schedule your first deep work blocks in your calendar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-gold" />
                  <span>Install the browser extension to block distracting sites</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-gold" />
                  <span>Complete your pre-work ritual before starting flow sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-gold" />
                  <span>Track your progress and celebrate your deep work wins</span>
                </li>
              </ul>
            </div>

            {/* Cal Newport Quote */}
            <blockquote className="mb-8 border-l-4 border-accent-gold pl-6 bg-bg-surface p-4 rounded-r-lg">
              <p className="text-text-secondary italic">
                "Clarity about what matters provides clarity about what does not."
              </p>
              <footer className="text-sm mt-2 text-text-tertiary">— Cal Newport, Deep Work</footer>
            </blockquote>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                disabled={isRedirecting}
                className="w-full bg-gradient-to-r from-accent-gold to-accent-orange text-bg-primary font-bold text-lg py-4 rounded-lg shadow-glow-strong hover:shadow-glow-interactive transition-all"
              >
                {isRedirecting ? 'Launching Dashboard... ✨' : 'Start Your First Flow Session →'}
              </motion.button>

              <p className="text-sm text-text-tertiary">
                You can always adjust these settings later in your profile
              </p>
            </div>

            {/* Extension Reminder */}
            <div className="mt-8 pt-6 border-t border-border-default">
              <div className="flex items-start gap-3 bg-bg-surface p-4 rounded-lg border border-accent-gold/20">
                <div className="bg-accent-gold/10 rounded-lg p-3 border border-accent-gold/30">
                  <span className="text-2xl">🔌</span>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    Don't forget the browser extension!
                  </h3>
                  <p className="text-text-secondary mb-2">
                    Install the Daybreak extension to automatically block distracting websites during your flow sessions.
                  </p>
                  <button
                    onClick={() => window.open('/extension-install', '_blank')}
                    className="text-accent-orange hover:text-accent-warm font-medium underline"
                  >
                    Install Extension →
                  </button>
                </div>
              </div>
            </div>

            {/* Development Tools */}
            {showDevTools && (
              <div className="mt-4 p-4 bg-bg-surface border-2 border-accent-warm/50 rounded-lg">
                <p className="text-xs text-text-tertiary mb-2 font-semibold">🛠️ Development Tools</p>
                <p className="text-xs text-text-secondary mb-3">
                  Skip authentication checks and go directly to the dashboard (dev mode only)
                </p>
                <button
                  onClick={() => window.location.href = '/today?devBypass=true'}
                  className="text-sm bg-accent-warm text-bg-primary px-4 py-2 rounded-lg hover:bg-accent-orange transition-colors font-medium"
                >
                  Skip to Dashboard →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}

