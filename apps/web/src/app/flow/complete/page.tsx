'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
// Material Symbols used inline to match Stitch design exactly

interface SessionData {
  id: string
  startTime: string
  endTime: string
  duration: number
  originalDuration?: number
  extendedDuration?: number
  feedback: string
  ritualCompleted: boolean
  locationConfirmed: boolean
}

interface UserStats {
  ritualCompletionCount: number
  locationConfirmationCount: number
  totalSessions: number
  totalMinutes: number
}

const DEV_MOCK_SESSION_DATA: SessionData = {
  id: 'dev-session-1',
  startTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  endTime: new Date().toISOString(),
  duration: 90,
  originalDuration: 90,
  extendedDuration: 0,
  feedback: 'on_time',
  ritualCompleted: true,
  locationConfirmed: true,
}

const DEV_MOCK_USER_STATS: UserStats = {
  ritualCompletionCount: 7,
  locationConfirmationCount: 5,
  totalSessions: 12,
  totalMinutes: 720,
}

export default function FlowCompletePage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  const isDevBypass = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

  useEffect(() => {
    // Dev bypass: show mock data
    if (isDevBypass) {
      setSessionData(DEV_MOCK_SESSION_DATA)
      setUserStats(DEV_MOCK_USER_STATS)
      setLoading(false)
      return
    }

    // Get session data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('sessionId')

    if (sessionId) {
      fetchSessionData(sessionId)
    } else {
      // Try to get from localStorage
      const storedSession = localStorage.getItem('lastCompletedSession')
      if (storedSession) {
        setSessionData(JSON.parse(storedSession))
        setLoading(false)
      } else {
        router.push('/today')
      }
    }
  }, [router, isDevBypass])

  const fetchSessionData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/flow/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setSessionData(data.session)
        setUserStats(data.userStats)

        // Store in localStorage for future reference
        localStorage.setItem('lastCompletedSession', JSON.stringify(data.session))
      }
    } catch (error) {
      console.error('Error fetching session data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFeedbackMessage = (feedback: string) => {
    switch (feedback) {
      case 'on_time':
        return 'Perfect timing!'
      case 'needed_more':
        return 'Could use more time'
      case 'finished_early':
        return 'Finished ahead of schedule!'
      default:
        return 'Session completed'
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-tertiary">Loading session summary...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Session not found</h1>
          <button
            onClick={() => router.push('/today')}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const feedbackMsg = getFeedbackMessage(sessionData.feedback)
  const totalDuration = (sessionData.originalDuration || sessionData.duration) + (sessionData.extendedDuration || 0)
  const streakDays = userStats?.ritualCompletionCount ?? 0
  const streakTarget = 28
  const streakPct = Math.round((streakDays / streakTarget) * 100)

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-x-hidden">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% -5%, rgba(255,200,87,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[800px] mx-auto px-6 py-10 pb-24">
        {/* Hero Section — Stitch screen 10 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-16 text-center"
        >
          {/* Gold check circle — Stitch 10 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-8 shadow-2xl"
            style={{
              background: '#ffc757',
              boxShadow: '0 25px 50px -12px rgba(255,199,87,0.2)',
            }}
          >
            <span className="material-symbols-outlined text-4xl" style={{ color: '#080808' }}>check</span>
          </motion.div>

          {/* Gold gradient headline */}
          <h1
            className="text-5xl md:text-6xl font-black mb-4 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffc757 0%, #fde68a 50%, #ffc757 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Flow Session Complete!
          </h1>
          <p className="text-text-secondary text-lg font-medium opacity-80">
            Deep work achieved. Your focus is your superpower.
          </p>
        </motion.div>

        {/* Metrics Grid — Stitch screen 10 glass cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Duration Card */}
          <div className="glass-card gold-glow-border flex flex-col gap-6 rounded-2xl p-8 hover:bg-accent-gold/5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-accent-gold">timer</span>
            </div>
            <div className="flex flex-col">
              <p className="text-accent-gold/50 text-xs font-bold uppercase tracking-[0.2em] mb-1">
                Session Duration
              </p>
              <h2 className="text-3xl font-bold text-text-primary tracking-tight">
                {formatDuration(sessionData.duration)}
              </h2>
              {(sessionData.extendedDuration ?? 0) > 0 && (
                <p className="text-xs text-text-tertiary mt-1">
                  {formatDuration(sessionData.originalDuration ?? sessionData.duration)} + {formatDuration(sessionData.extendedDuration!)} extended
                </p>
              )}
            </div>
          </div>

          {/* Feedback Card */}
          <div className="glass-card gold-glow-border flex flex-col gap-6 rounded-2xl p-8 hover:bg-accent-gold/5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-accent-gold">sentiment_very_satisfied</span>
            </div>
            <div className="flex flex-col">
              <p className="text-accent-gold/50 text-xs font-bold uppercase tracking-[0.2em] mb-1">
                Flow Feedback
              </p>
              <h2 className="text-3xl font-bold text-text-primary tracking-tight">
                {feedbackMsg}
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Status Badges — Stitch screen 10 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/5 px-5 py-2 border border-emerald-500/20">
            <span className="material-symbols-outlined text-emerald-400 text-sm">task_alt</span>
            <span className="text-emerald-400/80 text-xs font-bold uppercase tracking-widest">
              Pre-Flow Ritual: {sessionData.ritualCompleted ? 'Completed' : 'Skipped'}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-500/5 px-5 py-2 border border-blue-500/20">
            <span className="material-symbols-outlined text-blue-400 text-sm">location_on</span>
            <span className="text-blue-400/80 text-xs font-bold uppercase tracking-widest">
              Location Check: {sessionData.locationConfirmed ? 'Confirmed' : 'Skipped'}
            </span>
          </div>
        </motion.div>

        {/* Streak Progress — Stitch screen 10 */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card gold-glow-border rounded-2xl p-10 mb-12 relative overflow-hidden"
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-accent-gold/60 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                  Ritual Streak
                </p>
                <h3 className="text-4xl font-black text-text-primary tracking-tight">
                  {streakDays} of {streakTarget} Days
                </h3>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black text-accent-gold/20 tracking-tight">
                  {streakPct}%
                </span>
              </div>
            </div>

            {/* Gold gradient progress bar */}
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${streakPct}%`,
                  background: 'linear-gradient(135deg, #ffc757 0%, #fb923c 100%)',
                  boxShadow: '0 0 15px rgba(255,199,87,0.5)',
                }}
              />
            </div>

            <p className="mt-6 text-sm text-text-tertiary font-medium italic opacity-70 tracking-tight">
              &ldquo;The consistency of your ritual determines the depth of your focus.&rdquo;
            </p>
          </motion.div>
        )}

        {/* Action Buttons — Stitch screen 10 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-6 mb-16"
        >
          <button
            onClick={() => router.push('/today')}
            className="flex-1 premium-gold-gradient text-bg-primary font-black py-5 rounded-2xl shadow-xl shadow-accent-gold/10 transition-all flex items-center justify-center gap-3 text-lg tracking-tight hover:scale-[1.02] hover:brightness-110"
          >
            <span className="material-symbols-outlined">home</span>
            Back to Today
          </button>
          <button
            onClick={() => router.push('/capture')}
            className="flex-1 border border-accent-gold/20 text-accent-gold font-bold py-5 rounded-2xl hover:bg-accent-gold/5 transition-all flex items-center justify-center gap-3 text-lg tracking-tight hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined">edit_note</span>
            Quick Capture
          </button>
        </motion.div>

        {/* Footer Quote — Stitch screen 10 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="border-t border-accent-gold/10 pt-12 pb-16"
        >
          <blockquote className="relative p-8 border-l border-accent-gold/30">
            <span className="material-symbols-outlined absolute -top-2 -left-4 text-6xl" style={{ color: 'rgba(255,199,87,0.1)' }}>format_quote</span>
            <p className="text-text-secondary italic text-xl leading-relaxed tracking-tight">
              &ldquo;Who you are, what you think, feel, and do, what you love — is the sum of what you focus on.&rdquo;
            </p>
            <cite className="block mt-6 text-accent-gold/60 font-bold not-italic text-sm uppercase tracking-[0.2em]">
              — Cal Newport, Deep Work
            </cite>
          </blockquote>
        </motion.div>
      </div>
    </div>
  )
}
