'use client'

import { motion } from 'framer-motion'
import { Target, TrendingUp, Shield } from 'lucide-react'

const benefits = [
  {
    icon: Target,
    title: 'Structure your day for maximum impact',
    description: 'Time-block your calendar with deep work sessions',
  },
  {
    icon: Shield,
    title: 'Eliminate distractions automatically',
    description: 'Block apps and enable grayscale during focus time',
  },
  {
    icon: TrendingUp,
    title: 'Track your deep work progress',
    description: 'Build consistency and see your productivity soar',
  },
]

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Breathing circle animation */}
      <motion.div
        className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-12"
        animate={{
          scale: [0.8, 1.3, 0.8],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Headline */}
      <motion.h1
        className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Welcome to Deep Work Mastery
      </motion.h1>

      <motion.p
        className="text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Build unshakeable focus in 8 simple steps
      </motion.p>

      {/* Benefits grid */}
      <motion.div
        className="grid md:grid-cols-3 gap-8 w-full max-w-5xl mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <benefit.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
