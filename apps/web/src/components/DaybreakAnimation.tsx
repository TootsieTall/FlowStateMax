'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface DaybreakAnimationProps {
  startTime: Date
  endTime: Date
  isPaused?: boolean
}

export function DaybreakAnimation({ startTime, endTime, isPaused = false }: DaybreakAnimationProps) {
  const [progress, setProgress] = useState(0)
  const sunControls = useAnimation()

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date().getTime()
      const start = new Date(startTime).getTime()
      const end = new Date(endTime).getTime()
      const total = end - start
      const elapsed = now - start

      if (elapsed < 0) {
        setProgress(0)
      } else if (elapsed > total) {
        setProgress(100)
      } else {
        setProgress((elapsed / total) * 100)
      }
    }

    updateProgress()
    const interval = setInterval(updateProgress, 1000)

    return () => clearInterval(interval)
  }, [startTime, endTime])

  useEffect(() => {
    // Animate sun position based on progress
    if (!isPaused) {
      sunControls.start({
        bottom: `${-20 + (progress / 100) * 30}%`, // From -20% to 10%
        transition: { duration: 1, ease: 'linear' },
      })
    }
  }, [progress, isPaused, sunControls])

  // Calculate gradient colors based on progress
  const getGradientColors = () => {
    if (progress < 25) {
      // Pre-dawn: Deep purple/dark blue
      return {
        top: '#1a1a2e',
        middle: '#16213e',
        bottom: '#0f1419',
      }
    } else if (progress < 50) {
      // Early dawn: Purple to orange
      return {
        top: '#16213e',
        middle: '#3a2463',
        bottom: '#6b2737',
      }
    } else if (progress < 75) {
      // Sunrise: Orange/pink horizon
      return {
        top: '#6b2737',
        middle: '#ff6b6b',
        bottom: '#ffa500',
      }
    } else {
      // Full daylight: Golden yellow/sky blue
      return {
        top: '#6bcfff',
        middle: '#ffd93d',
        bottom: '#ffb347',
      }
    }
  }

  const colors = getGradientColors()

  // Sun glow intensity based on progress
  const getSunGlow = () => {
    if (progress < 25) return 'rgba(255, 184, 77, 0.2)'
    if (progress < 50) return 'rgba(255, 140, 66, 0.4)'
    if (progress < 75) return 'rgba(255, 200, 87, 0.6)'
    return 'rgba(255, 221, 61, 0.8)'
  }

  const getSunColor = () => {
    if (progress < 25) return '#ffa500' // Dim orange
    if (progress < 50) return '#ff8c42' // Warm orange
    if (progress < 75) return '#ffc857' // Bright gold
    return '#ffd93d' // Full yellow
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `linear-gradient(to bottom, ${colors.top}, ${colors.middle}, ${colors.bottom})`,
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Stars (fade out as sun rises) */}
      {progress < 50 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: Math.max(0, 1 - progress / 50) }}
          transition={{ duration: 2 }}
        >
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Sun */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        animate={sunControls}
        initial={{ bottom: '-20%' }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isPaused ? 1 : [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Sun Glow */}
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              width: '300px',
              height: '300px',
              background: getSunGlow(),
            }}
            animate={{
              scale: isPaused ? 1 : [1, 1.2, 1],
              opacity: isPaused ? 0.5 : [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Sun Core */}
          <motion.div
            className="relative rounded-full"
            style={{
              width: '200px',
              height: '200px',
              background: `radial-gradient(circle, ${getSunColor()}, ${getSunColor()}dd)`,
              boxShadow: `0 0 60px 20px ${getSunGlow()}`,
            }}
            animate={{
              boxShadow: isPaused
                ? `0 0 60px 20px ${getSunGlow()}`
                : [
                    `0 0 60px 20px ${getSunGlow()}`,
                    `0 0 80px 30px ${getSunGlow()}`,
                    `0 0 60px 20px ${getSunGlow()}`,
                  ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Sun rays */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 origin-left"
                  style={{
                    width: '100px',
                    height: '2px',
                    background: `linear-gradient(to right, ${getSunColor()}, transparent)`,
                    transform: `rotate(${i * 45}deg) translateY(-50%)`,
                  }}
                  animate={{
                    opacity: progress > 25 ? [0.3, 0.7, 0.3] : 0,
                    scaleX: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Horizon glow */}
      {progress > 20 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/3"
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.min(1, (progress - 20) / 40) }}
          style={{
            background: `linear-gradient(to top, ${getSunColor()}33, transparent)`,
          }}
        />
      )}

      {/* Cloud overlay (optional, adds depth) */}
      {progress > 50 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 3 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${i * 25}%`,
                top: `${20 + i * 10}%`,
                width: '200px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                filter: 'blur(30px)',
              }}
              animate={{
                x: [0, 100, 0],
              }}
              transition={{
                duration: 60 + i * 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

