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
      const response = await fetch('/api/sessions/pause', {
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
      const response = await fetch('/api/sessions/complete', {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Flow Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Flow Session Active
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {timeBlock?.title || 'Deep Work Session'}
            </h1>
            {timeBlock?.description && (
              <p className="text-gray-600">{timeBlock.description}</p>
            )}
            {timeBlock?.task && (
              <p className="text-sm text-gray-500 mt-2">
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
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">
                {session.monochromeOn ? '🎨' : '🌈'}
              </div>
              <div className="text-xs text-gray-600">
                {session.monochromeOn ? 'Monochrome' : 'Color'}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">
                {session.appsBlocked ? '🔒' : '🔓'}
              </div>
              <div className="text-xs text-gray-600">
                {session.appsBlocked ? 'Apps Blocked' : 'Apps Open'}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">
                {session.musicPlayed ? '🎵' : '🔇'}
              </div>
              <div className="text-xs text-gray-600">
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
          className="text-center text-gray-600 italic px-8"
        >
          "The ability to concentrate intensely is a skill that must be trained."
          <div className="text-sm text-gray-500 mt-1">— Cal Newport</div>
        </motion.div>
      </div>

      {/* Break Dialog */}
      {showBreakDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Take a Break?</h2>
              <button
                onClick={() => setShowBreakDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Breaking flow now will pause your session. You can resume it later, but you'll need to complete your ritual again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBreakDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Stay in Flow
              </button>
              <button
                onClick={confirmBreak}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Take Break
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Complete Dialog */}
      {showCompleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              How did it go?
            </h2>
            <p className="text-gray-600 mb-6">
              Your feedback helps us schedule better deep work sessions.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => confirmComplete('finished_early')}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="font-semibold text-gray-900">✅ Finished Early</div>
                <div className="text-sm text-gray-600">Completed the work ahead of schedule</div>
              </button>
              <button
                onClick={() => confirmComplete('on_time')}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="font-semibold text-gray-900">🎯 Right on Time</div>
                <div className="text-sm text-gray-600">Perfect duration for the task</div>
              </button>
              <button
                onClick={() => confirmComplete('needed_more')}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="font-semibold text-gray-900">⏰ Needed More Time</div>
                <div className="text-sm text-gray-600">Could have used additional time</div>
              </button>
            </div>
            <button
              onClick={() => setShowCompleteDialog(false)}
              className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

