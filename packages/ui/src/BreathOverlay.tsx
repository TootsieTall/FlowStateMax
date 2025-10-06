'use client'

import React, { useState, useEffect } from 'react'

interface BreathOverlayProps {
  appName: string
  onClose: () => void
  onContinue: () => void
}

export function BreathOverlay({ appName, onClose, onContinue }: BreathOverlayProps) {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 5000 // 5 seconds per phase
    const interval = setInterval(() => {
      setPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'))
      setCount((prev) => prev + 1)
    }, duration)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Breathing Circle */}
        <div className="mb-8 flex items-center justify-center">
          <div
            className={`w-32 h-32 rounded-full bg-primary transition-all duration-5000 ease-in-out ${
              phase === 'inhale' ? 'scale-150 opacity-100' : 'scale-75 opacity-60'
            }`}
          />
        </div>

        {/* Instructions */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {phase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
        </h2>
        <p className="text-white text-opacity-80 mb-8">
          You tried to open {appName}
        </p>

        {/* Actions */}
        {count >= 2 && (
          <div className="space-y-3 animate-fade-in">
            <button
              onClick={onClose}
              className="block w-64 mx-auto px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              ✓ Go Back (Build Focus)
            </button>
            <button
              onClick={onContinue}
              className="block w-64 mx-auto px-6 py-3 bg-transparent text-white border border-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Open Anyway
            </button>
          </div>
        )}

        {count < 2 && (
          <p className="text-white text-opacity-60 text-sm">
            Complete the breathing exercise to continue
          </p>
        )}
      </div>
    </div>
  )
}