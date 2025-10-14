'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
      <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 shadow-glow-strong animate-slide-in-right max-w-3xl w-full p-8">
        <div className="mb-8">
          <div className="text-overline text-accent-orange mb-2">STEP 7 OF 8</div>
          <h1 className="text-display-md text-text-primary mb-2">
            Train Your Boredom Resistance
          </h1>
          <p className="text-body text-text-tertiary">
            How do you want to handle downtime and breaks?
          </p>
        </div>

        {/* Educational Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border border-accent-gold/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">
                Why Boredom Training Matters
              </h3>
              <p className="text-sm text-text-secondary">
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
                  ? 'border-accent-gold bg-accent-gold/10 shadow-glow-medium'
                  : 'border-border-default hover:border-accent-gold/30 bg-bg-surface'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 ${selectedOption === option.id ? 'text-accent-gold' : 'text-text-tertiary'}`}>
                  {selectedOption === option.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-semibold ${
                      selectedOption === option.id ? 'text-accent-orange' : 'text-text-primary'
                    }`}>
                      {option.title}
                    </h3>
                    {option.recommended && (
                      <span className="px-2 py-1 bg-accent-gold/20 text-accent-gold text-xs font-semibold rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>

                  <p className="text-text-secondary mb-4">{option.description}</p>
                  
                  <div className="space-y-2">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          selectedOption === option.id ? 'bg-accent-gold' : 'bg-text-tertiary'
                        }`} />
                        <span className={`text-sm ${
                          selectedOption === option.id ? 'text-text-primary' : 'text-text-secondary'
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
        <blockquote className="mb-8">
          <p className="text-sm italic">
            "If you eat ice cream every night, then you'll find it difficult to eat less ice cream when 
            you decide to lose weight. If you check your email or social media every time you have a 
            free moment, then you'll find it difficult to concentrate when it's time to work deeply."
          </p>
          <footer className="text-sm mt-2">— Cal Newport, Deep Work</footer>
        </blockquote>

        {/* What Happens Next */}
        {selectedOption === 'embrace' && (
          <div className="mb-8 p-4 bg-accent-gold/10 border border-accent-gold/30 rounded-lg">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              🎯 What you'll get
            </h3>
            <p className="text-sm text-text-secondary">
              During breaks, you'll be guided through mindfulness exercises and meditation sessions.
              No podcasts, no social media, just pure mental rest to recharge your focus capacity.
            </p>
          </div>
        )}

        {selectedOption === 'brainstorm' && (
          <div className="mb-8 p-4 bg-accent-orange/10 border border-accent-orange/30 rounded-lg">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              💡 What you'll get
            </h3>
            <p className="text-sm text-text-secondary">
              Break time becomes creative time. You'll get prompts for voice memos, brain dumps,
              and idea capture. Perfect for synthesizing learnings or solving problems in the background
              while your mind wanders constructively.
            </p>
          </div>
        )}

        {selectedOption === 'productive' && (
          <div className="mb-8 p-4 bg-accent-warm/10 border border-accent-warm/30 rounded-lg">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              🎧 What you'll get
            </h3>
            <p className="text-sm text-text-secondary">
              We'll suggest curated podcasts and articles during breaks. While this keeps you productive, 
              it may reduce your boredom resistance over time.
            </p>
          </div>
        )}

        {selectedOption === 'minimal' && (
          <div className="mb-8 p-4 bg-bg-surface border border-border-default rounded-lg">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              ⚡ What you'll get
            </h3>
            <p className="text-sm text-text-secondary">
              Simple break timers with no suggestions. You're in full control of how you spend your
              downtime between deep work sessions.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 btn-ghost"
          >
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="px-6 py-2 btn-ghost"
            >
              Skip
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedOption}
              className="px-8 py-3 btn-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

