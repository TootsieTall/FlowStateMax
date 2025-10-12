'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Timer as TimerIcon, CheckCircle, Coffee, X } from 'lucide-react'
import { Timer } from '@flowstate/ui'
import { Button } from '@flowstate/ui'

interface FlowSessionViewProps {
  session: {
    id: string
    startTime: Date
    monochromeOn: boolean
    appsBlocked: boolean
    musicPlayed: boolean
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
  const [showBreakDialog, setShowBreakDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)

  // Calculate session end time
  const startTime = new Date(session.startTime)
  const endTime = timeBlock 
    ? new Date(timeBlock.endTime)
    : new Date(startTime.getTime() + 60 * 60 * 1000)

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
        router.push('/today')
      }
    } catch (error) {
      console.error('Error completing session:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dawn-100 to-dawn-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Flow Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-8 mb-6 animate-pulse-glow"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sunset-100 to-gold-100 text-sunset-700 rounded-full text-sm font-semibold mb-4 shadow-warm-sm">
              <div className="w-2 h-2 bg-sunset-500 rounded-full animate-pulse" />
              Flow Session Active
            </div>
            <h1 className="text-display-md text-bark-500 mb-2">
              {timeBlock?.title || 'Deep Work Session'}
            </h1>
            {timeBlock?.description && (
              <p className="text-body text-bark-300">{timeBlock.description}</p>
            )}
            {timeBlock?.task && (
              <p className="text-body-sm text-bark-200 mt-2">
                Task: {timeBlock.task.title}
              </p>
            )}
          </div>

          {/* Timer */}
          <div className="flex justify-center mb-8">
            <Timer startTime={startTime} endTime={endTime} />
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-dawn-100 rounded-warm-lg border border-border-light shadow-warm-sm">
              <div className="text-2xl mb-1">
                {session.monochromeOn ? '🎨' : '🌈'}
              </div>
              <div className="text-caption text-bark-300">
                {session.monochromeOn ? 'Monochrome' : 'Color'}
              </div>
            </div>
            <div className="text-center p-4 bg-dawn-100 rounded-warm-lg border border-border-light shadow-warm-sm">
              <div className="text-2xl mb-1">
                {session.appsBlocked ? '🔒' : '🔓'}
              </div>
              <div className="text-caption text-bark-300">
                {session.appsBlocked ? 'Apps Blocked' : 'Apps Open'}
              </div>
            </div>
            <div className="text-center p-4 bg-dawn-100 rounded-warm-lg border border-border-light shadow-warm-sm">
              <div className="text-2xl mb-1">
                {session.musicPlayed ? '🎵' : '🔇'}
              </div>
              <div className="text-caption text-bark-300">
                {session.musicPlayed ? 'Music On' : 'Silent'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={handleTakeBreak}
              className="flex-1"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Take Break
            </Button>
            <Button
              variant="primary"
              onClick={handleComplete}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Session
            </Button>
          </div>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center px-8"
        >
          <blockquote className="border-l-4 border-gold-400 bg-gradient-to-br from-gold-100 to-dawn-200 px-6 py-4 rounded-r-lg shadow-warm-sm">
            <p className="text-body text-bark-400 italic mb-2">
              "The ability to concentrate intensely is a skill that must be trained."
            </p>
            <footer className="text-body-sm text-bark-300 font-medium">— Cal Newport</footer>
          </blockquote>
        </motion.div>
      </div>

      {/* Break Dialog */}
      {showBreakDialog && (
        <div className="fixed inset-0 bg-bark-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-elevated max-w-md w-full p-6 animate-bounce-in"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-h2 text-bark-500">Take a Break?</h2>
              <button
                onClick={() => setShowBreakDialog(false)}
                className="p-1 hover:bg-dawn-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-bark-300" />
              </button>
            </div>
            <p className="text-body text-bark-300 mb-6">
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
        <div className="fixed inset-0 bg-bark-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-elevated max-w-md w-full p-6 animate-bounce-in"
          >
            <h2 className="text-h2 text-bark-500 mb-4">
              How did it go?
            </h2>
            <p className="text-body text-bark-300 mb-6">
              Your feedback helps us schedule better deep work sessions.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => confirmComplete('finished_early')}
                className="w-full p-4 text-left border-2 border-border-light rounded-warm-lg hover:border-sunset-400 hover:bg-sunset-50 transition-all hover:-translate-y-0.5 shadow-warm-sm hover:shadow-warm-md"
              >
                <div className="font-semibold text-bark-500">✅ Finished Early</div>
                <div className="text-body-sm text-bark-300">Completed the work ahead of schedule</div>
              </button>
              <button
                onClick={() => confirmComplete('on_time')}
                className="w-full p-4 text-left border-2 border-border-light rounded-warm-lg hover:border-gold-400 hover:bg-gold-50 transition-all hover:-translate-y-0.5 shadow-warm-sm hover:shadow-warm-md"
              >
                <div className="font-semibold text-bark-500">🎯 Right on Time</div>
                <div className="text-body-sm text-bark-300">Perfect duration for the task</div>
              </button>
              <button
                onClick={() => confirmComplete('needed_more')}
                className="w-full p-4 text-left border-2 border-border-light rounded-warm-lg hover:border-sand-400 hover:bg-sand-50 transition-all hover:-translate-y-0.5 shadow-warm-sm hover:shadow-warm-md"
              >
                <div className="font-semibold text-bark-500">⏰ Needed More Time</div>
                <div className="text-body-sm text-bark-300">Could have used additional time</div>
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

