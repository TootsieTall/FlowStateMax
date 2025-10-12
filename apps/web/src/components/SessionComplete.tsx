'use client'

import { useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface SessionCompleteProps {
  duration: number // in minutes
  targetDuration: number // in minutes
  onComplete: (feedback: 'on_time' | 'needed_more' | 'finished_early') => void
  onClose: () => void
}

export function SessionComplete({
  duration,
  targetDuration,
  onComplete,
  onClose,
}: SessionCompleteProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<
    'on_time' | 'needed_more' | 'finished_early' | null
  >(null)

  const handleComplete = () => {
    if (selectedFeedback) {
      onComplete(selectedFeedback)
    }
  }

  // Determine default feedback based on timing
  const getDefaultFeedback = () => {
    const percentComplete = (duration / targetDuration) * 100
    if (percentComplete >= 95 && percentComplete <= 105) return 'on_time'
    if (percentComplete < 95) return 'finished_early'
    return 'needed_more'
  }

  const defaultFeedback = getDefaultFeedback()

  return (
    <div className="fixed inset-0 bg-bark-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-elevated max-w-md w-full p-8 relative completion-shine animate-bounce-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-bark-200 hover:text-bark-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center shadow-glow-gold">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-display-md text-center text-bark-500 mb-2">
          Session Complete!
        </h2>

        {/* Duration Stats */}
        <div className="text-center mb-6">
          <p className="text-body text-bark-400">
            You focused for <span className="font-bold text-gradient-sunset">{duration} minutes</span>
          </p>
          <p className="text-body-sm text-bark-200 mt-1">
            Target was {targetDuration} minutes
          </p>
        </div>

        {/* Feedback Options */}
        <div className="mb-6">
          <p className="text-label text-bark-400 mb-3">
            How did it feel?
          </p>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedFeedback('on_time')}
              className={`w-full p-4 rounded-warm-lg border-2 transition-all text-left hover:-translate-y-0.5 shadow-warm-sm hover:shadow-warm-md ${
                selectedFeedback === 'on_time'
                  ? 'border-gold-500 bg-gold-100'
                  : defaultFeedback === 'on_time'
                  ? 'border-gold-300 bg-gold-50 opacity-60'
                  : 'border-border-light hover:border-gold-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-bark-500">✅ Just right</p>
                  <p className="text-body-sm text-bark-300">
                    Perfect amount of time
                  </p>
                </div>
                {defaultFeedback === 'on_time' && selectedFeedback !== 'on_time' && (
                  <span className="text-caption text-bark-200">Suggested</span>
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedFeedback('needed_more')}
              className={`w-full p-4 rounded-warm-lg border-2 transition-all text-left hover:-translate-y-0.5 shadow-warm-sm hover:shadow-warm-md ${
                selectedFeedback === 'needed_more'
                  ? 'border-warning-strong bg-warning-light'
                  : defaultFeedback === 'needed_more'
                  ? 'border-warning-DEFAULT bg-warning-light opacity-60'
                  : 'border-border-light hover:border-warning-DEFAULT'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-bark-500">⏰ Needed more time</p>
                  <p className="text-body-sm text-bark-300">
                    Could have kept going
                  </p>
                </div>
                {defaultFeedback === 'needed_more' && selectedFeedback !== 'needed_more' && (
                  <span className="text-caption text-bark-200">Suggested</span>
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedFeedback('finished_early')}
              className={`w-full p-4 rounded-warm-lg border-2 transition-all text-left hover:-translate-y-0.5 shadow-warm-sm hover:shadow-warm-md ${
                selectedFeedback === 'finished_early'
                  ? 'border-sunset-500 bg-sunset-100'
                  : defaultFeedback === 'finished_early'
                  ? 'border-sunset-300 bg-sunset-50 opacity-60'
                  : 'border-border-light hover:border-sunset-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-bark-500">⚡ Finished early</p>
                  <p className="text-body-sm text-bark-300">
                    Completed before timer
                  </p>
                </div>
                {defaultFeedback === 'finished_early' && selectedFeedback !== 'finished_early' && (
                  <span className="text-caption text-bark-200">Suggested</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Skip
          </button>
          <button
            onClick={handleComplete}
            disabled={!selectedFeedback}
            className="btn-success flex-1"
          >
            Complete Session
          </button>
        </div>
      </div>
    </div>
  )
}
