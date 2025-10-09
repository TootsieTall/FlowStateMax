'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/store/onboarding'
import { cn } from '@/lib/utils'
import {
  Code,
  PenTool,
  Palette,
  BarChart,
  BookOpen,
  Briefcase,
  GraduationCap,
  Music,
  Smartphone,
  Sparkles,
} from 'lucide-react'

const goalOptions = [
  {
    id: 'software-dev',
    label: 'Software Development',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'writing',
    label: 'Writing & Content',
    icon: PenTool,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'design',
    label: 'Design & Creative',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'data-analysis',
    label: 'Data & Analysis',
    icon: BarChart,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'research',
    label: 'Research & Learning',
    icon: BookOpen,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'business',
    label: 'Business & Strategy',
    icon: Briefcase,
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'academic',
    label: 'Academic Study',
    icon: GraduationCap,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'music-audio',
    label: 'Music & Audio',
    icon: Music,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'product',
    label: 'Product Development',
    icon: Smartphone,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'personal',
    label: 'Personal Projects',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-500',
  },
]

export function GoalsScreen() {
  const { goals, setGoals } = useOnboardingStore()
  const [selectedGoals, setSelectedGoals] = useState<string[]>(goals)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setGoals(selectedGoals)
    if (selectedGoals.length > 0) {
      setError(null)
    }
  }, [selectedGoals, setGoals])

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goalId))
    } else {
      if (selectedGoals.length < 5) {
        setSelectedGoals([...selectedGoals, goalId])
      } else {
        setError('Maximum 5 goals allowed')
        setTimeout(() => setError(null), 3000)
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-bold mb-4">What do you want to focus on?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Select 1-5 areas where you want to build deep work habits
        </p>

        {/* Selection counter */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {selectedGoals.length}/5 selected
          </span>
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            className="mt-4 text-red-600 dark:text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* Goal options grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
        {goalOptions.map((goal, index) => {
          const isSelected = selectedGoals.includes(goal.id)
          const Icon = goal.icon

          return (
            <motion.button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                'relative p-6 rounded-xl border-2 transition-all text-left',
                'hover:scale-105 active:scale-95',
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  'w-12 h-12 rounded-lg mb-4 flex items-center justify-center',
                  'bg-gradient-to-br',
                  goal.color
                )}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Label */}
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {goal.label}
              </h3>
            </motion.button>
          )
        })}
      </div>

      {/* Minimum requirement reminder */}
      {selectedGoals.length === 0 && (
        <motion.div
          className="text-center py-4 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Select at least 1 goal to continue
        </motion.div>
      )}
    </div>
  )
}
