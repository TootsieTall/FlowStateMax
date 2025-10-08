'use client'

import { useState } from 'react'
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
    // Save ritual to localStorage (will use API when backend is ready)
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowstate_ritual_items', JSON.stringify(ritualItems))
    }
    
    console.log('Saved ritual:', ritualItems)
    router.push('/onboarding/boredom')
  }

  const handleSkip = () => {
    router.push('/onboarding/boredom')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
        <div className="mb-8">
          <div className="text-sm text-primary-700 font-semibold mb-2">STEP 6 OF 8</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Flow Ritual
          </h1>
          <p className="text-gray-600">
            Build a consistent pre-work routine to signal your brain it's time for deep focus
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">
            💡 Why Rituals Matter
          </h3>
          <p className="text-sm text-blue-700">
            A consistent ritual trains your brain to enter focus mode faster. Like athletes warming up, 
            your ritual prepares your mind for peak performance.
          </p>
        </div>

        {/* Ritual Checklist */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your pre-work checklist
          </label>
          <div className="space-y-2">
            {ritualItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  item.checked
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex-shrink-0"
                  >
                    {item.checked ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <span className={`flex-1 ${item.checked ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                  {!item.isDefault && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Custom Item */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a custom step
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
              placeholder="e.g., Light a candle, Stretch for 2 minutes"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none text-gray-900"
            />
            <button
              onClick={addCustomItem}
              className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Popular Suggestions */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            💭 Popular ritual ideas
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setNewItem('Put on headphones 🎧')}
              className="text-left text-sm text-gray-700 hover:text-primary-700 transition-colors p-2 rounded hover:bg-white"
            >
              <Music className="w-4 h-4 inline mr-1" />
              Put on headphones
            </button>
            <button
              onClick={() => setNewItem('Set phone to airplane mode ✈️')}
              className="text-left text-sm text-gray-700 hover:text-primary-700 transition-colors p-2 rounded hover:bg-white"
            >
              <Phone className="w-4 h-4 inline mr-1" />
              Airplane mode
            </button>
            <button
              onClick={() => setNewItem('Quick 5-min meditation 🧘')}
              className="text-left text-sm text-gray-700 hover:text-primary-700 transition-colors p-2 rounded hover:bg-white"
            >
              Quick meditation
            </button>
            <button
              onClick={() => setNewItem('Review daily goals 🎯')}
              className="text-left text-sm text-gray-700 hover:text-primary-700 transition-colors p-2 rounded hover:bg-white"
            >
              Review goals
            </button>
            <button
              onClick={() => setNewItem('Drink water 💧')}
              className="text-left text-sm text-gray-700 hover:text-primary-700 transition-colors p-2 rounded hover:bg-white"
            >
              Drink water
            </button>
            <button
              onClick={() => setNewItem('Open focus app/tool 💻')}
              className="text-left text-sm text-gray-700 hover:text-primary-700 transition-colors p-2 rounded hover:bg-white"
            >
              Open focus app
            </button>
          </div>
        </div>

        {/* Cal Newport Quote */}
        <div className="mb-8 p-4 border-l-4 border-primary-600 bg-primary-50">
          <p className="text-sm italic text-gray-700">
            "To make the most out of your deep work sessions, build rituals of the same level of 
            strictness and idiosyncrasy as the important thinkers mentioned throughout this book."
          </p>
          <p className="text-sm text-gray-600 mt-2">— Cal Newport, Deep Work</p>
        </div>

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
              className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

