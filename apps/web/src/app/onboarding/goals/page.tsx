'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    <div className="min-h-screen bg-dawn-100 flex items-center justify-center p-4">
      <div className="card-elevated max-w-2xl w-full p-8 animate-slide-in-right">
        <div className="mb-8">
          <div className="text-overline text-sunset-600 mb-2">STEP 2 OF 8</div>
          <h1 className="text-display-md text-bark-500 mb-2">What brings you here? 🎯</h1>
          <p className="text-body text-bark-300">Select your focus areas (choose as many as apply)</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {FOCUS_AREAS.map((area) => {
            const selected = selectedGoals.includes(area)
            return (
              <button
                key={area}
                onClick={() => toggleGoal(area)}
                className={`p-4 rounded-warm-lg border-2 transition-all duration-fast text-left flex items-center justify-between hover-lift ${
                  selected
                    ? 'border-sunset-400 bg-gradient-to-br from-sunset-50 to-gold-50 shadow-warm-md'
                    : 'border-border-DEFAULT hover:border-sunset-300 bg-white'
                }`}
              >
                <span className={`font-medium ${selected ? 'text-sunset-600' : 'text-bark-400'}`}>
                  {area}
                </span>
                {selected ? (
                  <CheckCircle className="w-5 h-5 text-gold-500 animate-bounce-in" />
                ) : (
                  <Circle className="w-5 h-5 text-bark-200" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.back()}
            className="btn-ghost"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedGoals.length === 0}
            className="btn-primary"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}