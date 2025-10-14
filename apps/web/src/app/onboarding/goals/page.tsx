'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FOCUS_AREAS } from '@flowstate/core'
import { CheckCircle, Circle } from 'lucide-react'

export default function GoalsPage() {
  const router = useRouter()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
  }

  const handleContinue = async () => {
    if (selectedGoals.length === 0) return

    // Save goals to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowstate_goals', JSON.stringify(selectedGoals))
    }

    console.log('Saved goals:', selectedGoals)
    router.push('/onboarding/integrations')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 p-8 shadow-glow-strong">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent-orange mb-2">STEP 2 OF 8</div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">What brings you here? 🎯</h1>
            <p className="text-text-secondary">Select your focus areas (choose as many as apply)</p>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {FOCUS_AREAS.map((area, index) => {
              const selected = selectedGoals.includes(area)
              return (
                <motion.button
                  key={area}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleGoal(area)}
                  className={`p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                    selected
                      ? 'border-accent-gold bg-accent-gold/10 shadow-glow-subtle'
                      : 'border-border-default bg-bg-surface hover:border-accent-gold/50'
                  }`}
                >
                  <span className={`font-medium ${selected ? 'text-accent-gold' : 'text-text-secondary'}`}>
                    {area}
                  </span>
                  {selected ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <CheckCircle className="w-5 h-5 text-accent-gold" />
                    </motion.div>
                  ) : (
                    <Circle className="w-5 h-5 text-text-tertiary" />
                  )}
                </motion.button>
              )
            })}
          </motion.div>

          <div className="flex justify-between">
            <button
              onClick={() => router.back()}
              className="bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary px-4 py-2 rounded-lg transition-all"
            >
              Back
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              disabled={selectedGoals.length === 0}
              className="bg-gradient-to-r from-accent-gold to-accent-orange text-bg-primary font-semibold px-6 py-3 rounded-lg shadow-glow-strong hover:shadow-glow-interactive transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
