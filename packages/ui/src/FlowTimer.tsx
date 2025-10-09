/**
 * FlowTimer Component
 * Minimal, focused UI for active flow sessions
 */

import { useEffect, useState } from 'react'
import { differenceInSeconds, format } from 'date-fns'
import { Pause, Play, Square } from 'lucide-react'

interface FlowTimerProps {
  startTime: Date
  endTime: Date
  onPause?: () => void
  onResume?: () => void
  onEnd?: () => void
  isPaused?: boolean
}

export function FlowTimer({
  startTime,
  endTime,
  onPause,
  onResume,
  onEnd,
  isPaused = false,
}: FlowTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()
      const secondsLeft = differenceInSeconds(endTime, now)
      const secondsElapsed = differenceInSeconds(now, startTime)

      setTimeLeft(Math.max(0, secondsLeft))
      setElapsedTime(Math.max(0, secondsElapsed))

      // Auto-end when time is up
      if (secondsLeft <= 0 && onEnd) {
        onEnd()
      }
    }

    calculateTime()

    if (!isPaused) {
      const interval = setInterval(calculateTime, 1000)
      return () => clearInterval(interval)
    }
  }, [endTime, startTime, isPaused, onEnd])

  // Calculate progress percentage
  const totalSeconds = differenceInSeconds(endTime, startTime)
  const progressPercentage = Math.min(100, (elapsedTime / totalSeconds) * 100)

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="text-center max-w-2xl px-8">
        {/* Main Timer Display */}
        <div className="mb-12">
          <h2 className="text-white text-sm uppercase tracking-wider mb-4 opacity-70">
            {isPaused ? 'Paused' : 'Flow Session Active'}
          </h2>
          <div className="text-white text-8xl font-bold font-mono mb-2">
            {formatTime(timeLeft)}
          </div>
          <p className="text-white opacity-50 text-lg">
            {format(endTime, 'h:mm a')} target
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-white opacity-40 text-sm mt-2">
            {Math.round(progressPercentage)}% complete
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Pause/Resume */}
          {!isPaused ? (
            <button
              onClick={onPause}
              className="p-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
              title="Pause session"
            >
              <Pause className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={onResume}
              className="p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
              title="Resume session"
            >
              <Play className="w-6 h-6" />
            </button>
          )}

          {/* End Session */}
          <button
            onClick={onEnd}
            className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            title="End session"
          >
            <Square className="w-6 h-6" />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-white opacity-60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm">Monochrome</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm">Apps Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm">DND Mode</span>
          </div>
        </div>

        {/* Breathing Reminder */}
        {!isPaused && timeLeft % 900 < 5 && ( // Show every 15 minutes
          <div className="mt-8 animate-fade-in">
            <p className="text-white text-lg opacity-80">
              Take a deep breath...
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  )
}
