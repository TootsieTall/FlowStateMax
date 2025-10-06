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

    // Save goals (would call API here)
    router.push('/onboarding/locations')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
        <div className="mb-8">
          <div className="text-sm text-primary font-semibold mb-2">STEP 1 OF 7</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What brings you here?</h1>
          <p className="text-gray-600">Select your focus areas (choose as many as apply)</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {FOCUS_AREAS.map((area) => {
            const selected = selectedGoals.includes(area)
            return (
              <button
                key={area}
                onClick={() => toggleGoal(area)}
                className={`p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                  selected
                    ? 'border-primary bg-primary bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`font-medium ${selected ? 'text-primary' : 'text-gray-700'}`}>
                  {area}
                </span>
                {selected ? (
                  <CheckCircle className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedGoals.length === 0}
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}