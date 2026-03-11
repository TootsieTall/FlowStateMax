'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Timer as TimerIcon, 
  CheckCircle, 
  Coffee, 
  X, 
  Maximize2,
  Minimize2,
  Plus,
  Clock
} from 'lucide-react'
import { DaybreakAnimation } from './DaybreakAnimation'

interface FlowSessionViewProps {
  session: {
    id: string
    startTime: Date
    endTime?: Date | null
    originalDuration?: number | null
    extendedDuration?: number
    monochromeOn: boolean
    appsBlocked: boolean
    musicPlayed: boolean
    ritualCompleted: boolean
    locationConfirmed: boolean
  }
  timeBlock?: {
    id: string
    title: string
    startTime: Date
    endTime: Date
    description?: string | null
    task?: {
      id: string
      title: string
    } | null
  } | null
  user: {
    name?: string | null
  }
}

export function FlowSessionView({ session, timeBlock, user }: FlowSessionViewProps) {
  const router = useRouter()
  const [isImmersiveMode, setIsImmersiveMode] = useState(true)
  const [showBreakDialog, setShowBreakDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showExtendDialog, setShowExtendDialog] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [newEndTime, setNewEndTime] = useState<Date | null>(null)

  // Calculate session end time
  const startTime = new Date(session.startTime)
  const endTime = newEndTime || (timeBlock 
    ? new Date(timeBlock.endTime)
    : session.endTime 
    ? new Date(session.endTime)
    : new Date(startTime.getTime() + 60 * 60 * 1000)) // Default 1 hour

  // Update time left every second
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date()
      const diff = endTime.getTime() - now.getTime()
      const seconds = Math.max(0, Math.floor(diff / 1000))
      setTimeLeft(seconds)

      // Auto-show extend dialog when 5 minutes left
      if (seconds === 300 && !showExtendDialog) {
        setShowExtendDialog(true)
      }

      // Auto-complete when time runs out
      if (seconds === 0) {
        setTimeout(() => setShowCompleteDialog(true), 1000)
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`
  }

  const handleTakeBreak = async () => {
    setShowBreakDialog(true)
  }

  const confirmBreak = async () => {
    try {
      const response = await fetch('/api/sessions/flow/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id }),
      })

      if (response.ok) {
        router.push('/today')
      }
    } catch (error) {
      console.error('Error pausing session:', error)
    }
  }

  const handleComplete = async () => {
    setShowCompleteDialog(true)
  }

  const confirmComplete = async (feedback: 'on_time' | 'needed_more' | 'finished_early') => {
    try {
      const response = await fetch('/api/sessions/flow/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, feedback }),
      })

      if (response.ok) {
        router.push('/flow/complete')
      }
    } catch (error) {
      console.error('Error completing session:', error)
    }
  }

  const handleExtendSession = async (additionalMinutes: number) => {
    try {
      const response = await fetch('/api/sessions/flow/extend', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: session.id, 
          additionalMinutes 
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewEndTime(new Date(data.newEndTime))
        setShowExtendDialog(false)
      }
    } catch (error) {
      console.error('Error extending session:', error)
    }
  }

  const EXTEND_PRESETS = [
    { label: '+15 min', value: 15 },
    { label: '+30 min', value: 30 },
    { label: '+45 min', value: 45 },
    { label: '+60 min', value: 60 },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Daybreak Animation Background */}
      <DaybreakAnimation
        startTime={startTime}
        endTime={endTime}
        isPaused={false}
      />

      {/* Bottom sunrise glow — Stitch screen 01 signature element */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-64 z-0"
        style={{
          background: 'radial-gradient(ellipse at bottom center, rgba(255,140,66,0.25) 0%, rgba(255,200,87,0.10) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Immersive Mode Toggle */}
      <button
        onClick={() => setIsImmersiveMode(!isImmersiveMode)}
        className="fixed top-4 right-4 z-50 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-lg transition-all text-white"
        title={isImmersiveMode ? 'Show Details' : 'Hide Details'}
      >
        {isImmersiveMode ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
      </button>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {isImmersiveMode ? (
            /* Immersive Mode — Stitch screen 01: massive timer + floating control panel */
            <motion.div
              key="immersive"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center w-full max-w-2xl"
            >
              {/* Session label */}
              <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-4">
                {timeBlock?.title || 'Deep Work Session'}
              </p>

              {/* Large Timer — Stitch design uses ~120-160px */}
              <motion.div
                className="mb-10"
                animate={{ scale: [1, 1.015, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div
                  className="text-white font-black font-mono drop-shadow-2xl leading-none"
                  style={{ fontSize: 'clamp(80px, 18vw, 160px)' }}
                >
                  {formatTime(timeLeft)}
                </div>
              </motion.div>

              {/* Floating control panel — Stitch screen 01 glass card */}
              <div
                className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl"
                style={{
                  background: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                {timeLeft < 300 && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setShowExtendDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Extend
                  </motion.button>
                )}
                <button
                  onClick={handleTakeBreak}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all border border-white/10"
                >
                  <Coffee className="w-4 h-4" />
                  Take Break
                </button>
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-5 py-2.5 text-bg-primary text-sm font-black rounded-xl transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #ffc757 0%, #fb923c 100%)' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Session
                </button>
              </div>
            </motion.div>
          ) : (
            /* Normal Mode — Full Details panel */
            <motion.div
              key="normal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-2xl w-full"
            >
              {/* Main Flow Card */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold mb-4">
                    <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
                    Flow Session Active
                  </div>
                  <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                    {timeBlock?.title || 'Deep Work Session'}
                  </h1>
                  {timeBlock?.description && (
                    <p className="text-sm text-white/70">{timeBlock.description}</p>
                  )}
                  {timeBlock?.task && (
                    <p className="text-xs text-white/60 mt-2">
                      Task: {timeBlock.task.title}
                    </p>
                  )}
                </div>

                {/* Timer */}
                <div className="text-center mb-8">
                  <div className="text-7xl font-bold font-mono text-white mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-white/60 text-sm">
                    {session.originalDuration && (session.extendedDuration ?? 0) > 0 && (
                      <span>
                        {session.originalDuration} min + {session.extendedDuration ?? 0} min extended
                      </span>
                    )}
                  </div>
                </div>

                {/* Session Info */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="text-2xl mb-1">
                      {session.monochromeOn ? '🎨' : '🌈'}
                    </div>
                    <div className="text-xs text-white/70">
                      {session.monochromeOn ? 'Monochrome' : 'Color'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="text-2xl mb-1">
                      {session.appsBlocked ? '🔒' : '🔓'}
                    </div>
                    <div className="text-xs text-white/70">
                      {session.appsBlocked ? 'Apps Blocked' : 'Apps Open'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="text-2xl mb-1">
                      {session.musicPlayed ? '🎵' : '🔇'}
                    </div>
                    <div className="text-xs text-white/70">
                      {session.musicPlayed ? 'Music On' : 'Silent'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {timeLeft < 300 && (
                    <button
                      onClick={() => setShowExtendDialog(true)}
                      className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Extend Session
                    </button>
                  )}
                  <button
                    onClick={handleTakeBreak}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Coffee className="w-4 h-4" />
                    Take Break
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 px-4 py-3 text-bg-primary font-black rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #ffc757 0%, #fb923c 100%)' }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete
                  </button>
                </div>
              </div>

              {/* Cal Newport Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center"
              >
                <blockquote className="border-l-4 border-white/30 bg-black/20 backdrop-blur-md px-6 py-4 rounded-r-lg">
                  <p className="text-sm text-white/80 italic mb-2">
                    &ldquo;The ability to concentrate intensely is a skill that must be trained.&rdquo;
                  </p>
                  <footer className="text-xs text-white/60">— Cal Newport</footer>
                </blockquote>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Extend Session Dialog */}
      {showExtendDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-bg-elevated max-w-md w-full p-6 rounded-2xl border border-border-default shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-h2 text-text-primary">Extend Session?</h2>
              <button
                onClick={() => setShowExtendDialog(false)}
                className="p-1 hover:bg-bg-surface rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-tertiary" />
              </button>
            </div>
            <p className="text-body text-text-secondary mb-6">
              Add more time to your current flow session
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {EXTEND_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleExtendSession(preset.value)}
                  className="p-4 border-2 border-border-default rounded-lg hover:border-accent-gold hover:bg-accent-gold/5 transition-all"
                >
                  <div className="text-h3 text-text-primary font-semibold">
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowExtendDialog(false)}
              className="btn-ghost w-full"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Break Dialog */}
      {showBreakDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-bg-elevated max-w-md w-full p-6 rounded-2xl border border-border-default shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-h2 text-text-primary">Take a Break?</h2>
              <button
                onClick={() => setShowBreakDialog(false)}
                className="p-1 hover:bg-bg-surface rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-tertiary" />
              </button>
            </div>
            <p className="text-body text-text-secondary mb-6">
              Breaking flow now will pause your session. You can resume it later, but you'll need to complete your ritual again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBreakDialog(false)}
                className="btn-secondary flex-1"
              >
                Stay in Flow
              </button>
              <button
                onClick={confirmBreak}
                className="btn-primary flex-1"
              >
                Take Break
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Complete Dialog */}
      {showCompleteDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-bg-elevated max-w-md w-full p-6 rounded-2xl border border-border-default shadow-2xl"
          >
            <h2 className="text-h2 text-text-primary mb-4">
              How did it go?
            </h2>
            {session.originalDuration && (session.extendedDuration ?? 0) > 0 && (
              <div className="mb-4 p-3 bg-accent-gold/10 border border-accent-gold/20 rounded-lg">
                <p className="text-body-sm text-text-primary">
                  Completed: <span className="font-semibold">{session.originalDuration} min</span>
                  {' + '}
                  <span className="font-semibold">{session.extendedDuration ?? 0} min extended</span>
                  {' = '}
                  <span className="font-semibold">{(session.originalDuration ?? 0) + (session.extendedDuration ?? 0)} min total</span>
                </p>
              </div>
            )}
            <p className="text-body text-text-secondary mb-6">
              Your feedback helps us schedule better deep work sessions.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => confirmComplete('finished_early')}
                className="w-full p-4 text-left border-2 border-border-default rounded-lg hover:border-accent-gold hover:bg-accent-gold/5 transition-all"
              >
                <div className="font-semibold text-text-primary">✅ Finished Early</div>
                <div className="text-body-sm text-text-secondary">Completed the work ahead of schedule</div>
              </button>
              <button
                onClick={() => confirmComplete('on_time')}
                className="w-full p-4 text-left border-2 border-border-default rounded-lg hover:border-accent-gold hover:bg-accent-gold/5 transition-all"
              >
                <div className="font-semibold text-text-primary">🎯 Right on Time</div>
                <div className="text-body-sm text-text-secondary">Perfect duration for the task</div>
              </button>
              <button
                onClick={() => confirmComplete('needed_more')}
                className="w-full p-4 text-left border-2 border-border-default rounded-lg hover:border-accent-gold hover:bg-accent-gold/5 transition-all"
              >
                <div className="font-semibold text-text-primary">⏰ Needed More Time</div>
                <div className="text-body-sm text-text-secondary">Could have used additional time</div>
              </button>
            </div>
            <button
              onClick={() => setShowCompleteDialog(false)}
              className="btn-ghost w-full mt-4"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
