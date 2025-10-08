'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Clock, Coffee, Smartphone, CheckCircle, Circle } from 'lucide-react'

export default function BoredomPage() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<string>('')

  const options = [
    {
      id: 'embrace',
      title: '🧘 Embrace it',
      description: 'I want to train myself to handle boredom and resist distractions',
      features: [
        'Meditation sessions during breaks',
        'Mindful breathing exercises',
        'Boredom resistance training',
        'No entertainment during rest periods'
      ],
      recommended: true
    },
    {
      id: 'brainstorm',
      title: '💡 Creative thinking',
      description: 'Use breaks for brainstorming and capturing ideas',
      features: [
        'Voice memo prompts',
        'Quick capture for ideas',
        'Structured brain dumps',
        'Creative problem-solving time'
      ],
      recommended: false
    },
    {
      id: 'productive',
      title: '🎧 Productive breaks',
      description: 'I prefer to fill downtime with productive content',
      features: [
        'Curated podcast suggestions',
        'Educational content',
        'Industry news & articles',
        'Productive listening during breaks'
      ],
      recommended: false
    },
    {
      id: 'minimal',
      title: '⚡ Minimal intervention',
      description: 'I know how to manage my breaks, keep it simple',
      features: [
        'Basic break timer',
        'No content suggestions',
        'No structured activities',
        'Full autonomy over downtime'
      ],
      recommended: false
    }
  ]

  const handleContinue = async () => {
    if (!selectedOption) return

    // Save boredom preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowstate_boredom_training', selectedOption)
    }

    console.log('Saved boredom training preference:', selectedOption)
    router.push('/onboarding/recovery')
  }

  const handleSkip = () => {
    router.push('/onboarding/recovery')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8">
        <div className="mb-8">
          <div className="text-sm text-primary-700 font-semibold mb-2">STEP 7 OF 8</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Train Your Boredom Resistance
          </h1>
          <p className="text-gray-600">
            How do you want to handle downtime and breaks?
          </p>
        </div>

        {/* Educational Banner */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Why Boredom Training Matters
              </h3>
              <p className="text-sm text-blue-700">
                Cal Newport argues that constant entertainment during breaks weakens your ability to 
                concentrate. Training yourself to embrace boredom strengthens your focus muscle and 
                increases your capacity for deep work.
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                selectedOption === option.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 ${selectedOption === option.id ? 'text-primary-600' : 'text-gray-400'}`}>
                  {selectedOption === option.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-semibold ${
                      selectedOption === option.id ? 'text-primary-700' : 'text-gray-900'
                    }`}>
                      {option.title}
                    </h3>
                    {option.recommended && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  
                  <div className="space-y-2">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          selectedOption === option.id ? 'bg-primary-600' : 'bg-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          selectedOption === option.id ? 'text-primary-700' : 'text-gray-600'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Cal Newport Quote */}
        <div className="mb-8 p-4 border-l-4 border-primary-600 bg-primary-50">
          <p className="text-sm italic text-gray-700">
            "If you eat ice cream every night, then you'll find it difficult to eat less ice cream when 
            you decide to lose weight. If you check your email or social media every time you have a 
            free moment, then you'll find it difficult to concentrate when it's time to work deeply."
          </p>
          <p className="text-sm text-gray-600 mt-2">— Cal Newport, Deep Work</p>
        </div>

        {/* What Happens Next */}
        {selectedOption === 'embrace' && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-semibold text-green-900 mb-2">
              🎯 What you'll get
            </h3>
            <p className="text-sm text-green-700">
              During breaks, you'll be guided through mindfulness exercises and meditation sessions. 
              No podcasts, no social media, just pure mental rest to recharge your focus capacity.
            </p>
          </div>
        )}

        {selectedOption === 'brainstorm' && (
          <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-900 mb-2">
              💡 What you'll get
            </h3>
            <p className="text-sm text-purple-700">
              Break time becomes creative time. You'll get prompts for voice memos, brain dumps, 
              and idea capture. Perfect for synthesizing learnings or solving problems in the background 
              while your mind wanders constructively.
            </p>
          </div>
        )}

        {selectedOption === 'productive' && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">
              🎧 What you'll get
            </h3>
            <p className="text-sm text-amber-700">
              We'll suggest curated podcasts and articles during breaks. While this keeps you productive, 
              it may reduce your boredom resistance over time.
            </p>
          </div>
        )}

        {selectedOption === 'minimal' && (
          <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              ⚡ What you'll get
            </h3>
            <p className="text-sm text-gray-700">
              Simple break timers with no suggestions. You're in full control of how you spend your 
              downtime between deep work sessions.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedOption}
              className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

