'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { DEFAULT_RITUAL } from '@flowstate/core'
import { CheckCircle, Circle, Plus, X, Coffee, Music, Phone, Mail } from 'lucide-react'

interface RitualItem {
  id: string
  text: string
  checked: boolean
  isDefault: boolean
}

export default function RitualPage() {
  const router = useRouter()
  const [ritualItems, setRitualItems] = useState<RitualItem[]>(
    DEFAULT_RITUAL.map((item, index) => ({
      id: `default-${index}`,
      text: item,
      checked: false,
      isDefault: true
    }))
  )
  const [newItem, setNewItem] = useState('')

  const toggleItem = (id: string) => {
    setRitualItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const addCustomItem = () => {
    if (!newItem.trim()) return

    const customItem: RitualItem = {
      id: `custom-${Date.now()}`,
      text: newItem.trim(),
      checked: false,
      isDefault: false
    }

    setRitualItems([...ritualItems, customItem])
    setNewItem('')
  }

  const removeItem = (id: string) => {
    setRitualItems(prev => prev.filter(item => item.id !== id))
  }

  const handleContinue = async () => {
    try {
      // Save ritual items to database via API
      const response = await fetch('/api/onboarding/ritual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ritualItems: ritualItems.map(item => ({ text: item.text })),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Failed to save ritual:', error)
        alert('Failed to save ritual items. Please try again.')
        return
      }

      const data = await response.json()
      console.log(`✅ Saved ${data.count} ritual items`)
      router.push('/onboarding/boredom')
    } catch (error) {
      console.error('Error saving ritual:', error)
      alert('Failed to save ritual items. Please try again.')
    }
  }

  const handleSkip = () => {
    router.push('/onboarding/boredom')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
      <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 shadow-glow-strong animate-slide-in-right max-w-2xl w-full p-8">
        <div className="mb-8">
          <div className="text-overline text-accent-orange mb-2">STEP 6 OF 8</div>
          <h1 className="text-display-md text-text-primary mb-2">
            Create Your Flow Ritual
          </h1>
          <p className="text-body text-text-tertiary">
            Build a consistent pre-work routine to signal your brain it's time for deep focus
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border border-accent-gold/30 rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            💡 Why Rituals Matter
          </h3>
          <p className="text-sm text-text-secondary">
            A consistent ritual trains your brain to enter focus mode faster. Like athletes warming up, 
            your ritual prepares your mind for peak performance.
          </p>
        </div>

        {/* Ritual Checklist */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-tertiary mb-3">
            Your pre-work checklist
          </label>
          <div className="space-y-2">
            {ritualItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                type="button"
                className={`w-full p-4 rounded-lg border-2 transition-all text-left cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  item.checked
                    ? 'border-accent-gold bg-accent-gold/10'
                    : 'border-gray-300 hover:border-coral-500 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 pointer-events-none">
                  <div className="flex-shrink-0">
                    {item.checked ? (
                      <CheckCircle className="w-5 h-5 text-accent-gold" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-tertiary" />
                    )}
                  </div>
                  <span className={`flex-1 ${item.checked ? 'text-text-primary font-medium' : 'text-text-primary'}`}>
                    {item.text}
                  </span>
                  {!item.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)
                      }}
                      type="button"
                      className="flex-shrink-0 text-text-tertiary hover:text-accent-orange transition-colors pointer-events-auto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add Custom Item */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Add a custom step
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
              placeholder="e.g., Light a candle, Stretch for 2 minutes"
              className="input"
            />
            <button
              onClick={addCustomItem}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Popular Suggestions */}
        <div className="mb-8 p-4 bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border border-accent-gold/30 rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            💭 Popular ritual ideas
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setNewItem('Put on headphones 🎧')}
              className="text-left text-sm text-text-secondary hover:text-accent-orange transition-colors p-2 rounded hover:bg-bg-elevated"
            >
              <Music className="w-4 h-4 inline mr-1" />
              Put on headphones
            </button>
            <button
              onClick={() => setNewItem('Set phone to airplane mode ✈️')}
              className="text-left text-sm text-text-secondary hover:text-accent-orange transition-colors p-2 rounded hover:bg-bg-elevated"
            >
              <Phone className="w-4 h-4 inline mr-1" />
              Airplane mode
            </button>
            <button
              onClick={() => setNewItem('Quick 5-min meditation 🧘')}
              className="text-left text-sm text-text-secondary hover:text-accent-orange transition-colors p-2 rounded hover:bg-bg-elevated"
            >
              Quick meditation
            </button>
            <button
              onClick={() => setNewItem('Review daily goals 🎯')}
              className="text-left text-sm text-text-secondary hover:text-accent-orange transition-colors p-2 rounded hover:bg-bg-elevated"
            >
              Review goals
            </button>
            <button
              onClick={() => setNewItem('Drink water 💧')}
              className="text-left text-sm text-text-secondary hover:text-accent-orange transition-colors p-2 rounded hover:bg-bg-elevated"
            >
              Drink water
            </button>
            <button
              onClick={() => setNewItem('Open focus app/tool 💻')}
              className="text-left text-sm text-text-secondary hover:text-accent-orange transition-colors p-2 rounded hover:bg-bg-elevated"
            >
              Open focus app
            </button>
          </div>
        </div>

        {/* Cal Newport Quote */}
        <blockquote className="mb-8">
          <p className="text-sm italic">
            "To make the most out of your deep work sessions, build rituals of the same level of 
            strictness and idiosyncrasy as the important thinkers mentioned throughout this book."
          </p>
          <footer className="text-sm mt-2">— Cal Newport, Deep Work</footer>
        </blockquote>

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
              className="px-8 py-3 btn-primary transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

