'use client'

import React, { useState, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'

interface TimerProps {
  startTime: Date
  endTime: Date
}

export function Timer({ startTime, endTime }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const secondsLeft = differenceInSeconds(endTime, now)
      setTimeLeft(Math.max(0, secondsLeft))
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  const totalDuration = differenceInSeconds(endTime, startTime)
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time Display */}
      <div className="flex items-center justify-center space-x-2 text-4xl font-bold text-gray-900">
        {hours > 0 && (
          <>
            <span className="w-16 text-center">{hours.toString().padStart(2, '0')}</span>
            <span>:</span>
          </>
        )}
        <span className="w-16 text-center">{minutes.toString().padStart(2, '0')}</span>
        <span>:</span>
        <span className="w-16 text-center">{seconds.toString().padStart(2, '0')}</span>
      </div>

      <p className="text-sm text-gray-500 text-center">
        {timeLeft === 0 ? 'Session complete!' : 'Time remaining'}
      </p>
    </div>
  )
}