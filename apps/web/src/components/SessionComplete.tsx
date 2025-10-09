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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Session Complete!
        </h2>

        {/* Duration Stats */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            You focused for <span className="font-bold text-primary-700">{duration} minutes</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Target was {targetDuration} minutes
          </p>
        </div>

        {/* Feedback Options */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            How did it feel?
          </p>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedFeedback('on_time')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedFeedback === 'on_time'
                  ? 'border-green-500 bg-green-50'
                  : defaultFeedback === 'on_time'
                  ? 'border-green-300 bg-green-50 opacity-60'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">✅ Just right</p>
                  <p className="text-sm text-gray-500">
                    Perfect amount of time
                  </p>
                </div>
                {defaultFeedback === 'on_time' && selectedFeedback !== 'on_time' && (
                  <span className="text-xs text-gray-400">Suggested</span>
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedFeedback('needed_more')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedFeedback === 'needed_more'
                  ? 'border-amber-500 bg-amber-50'
                  : defaultFeedback === 'needed_more'
                  ? 'border-amber-300 bg-amber-50 opacity-60'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">⏰ Needed more time</p>
                  <p className="text-sm text-gray-500">
                    Could have kept going
                  </p>
                </div>
                {defaultFeedback === 'needed_more' && selectedFeedback !== 'needed_more' && (
                  <span className="text-xs text-gray-400">Suggested</span>
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedFeedback('finished_early')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedFeedback === 'finished_early'
                  ? 'border-blue-500 bg-blue-50'
                  : defaultFeedback === 'finished_early'
                  ? 'border-blue-300 bg-blue-50 opacity-60'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">⚡ Finished early</p>
                  <p className="text-sm text-gray-500">
                    Completed before timer
                  </p>
                </div>
                {defaultFeedback === 'finished_early' && selectedFeedback !== 'finished_early' && (
                  <span className="text-xs text-gray-400">Suggested</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleComplete}
            disabled={!selectedFeedback}
            className="flex-1 px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Session
          </button>
        </div>
      </div>
    </div>
  )
}
