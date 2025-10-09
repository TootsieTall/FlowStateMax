'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle, MapPin, Clock, Target, Coffee, Volume2, BellOff } from 'lucide-react'
import { useWorkLocations } from '@/hooks/useWorkLocations'

interface ChecklistItem {
  id: string
  label: string
  icon: React.ReactNode
  checked: boolean
  required: boolean
  description?: string
}

interface SessionChecklistProps {
  onComplete: (data: SessionData) => void
  onSkip?: () => void
}

export interface SessionData {
  location: string
  locationVerified: boolean
  duration: number
  goal?: string
  checklist: {
    location: boolean
    environment: boolean
    tools: boolean
    mindset: boolean
  }
}

function SessionChecklist({ onComplete, onSkip }: SessionChecklistProps) {
  const { locations, currentLocation, checkCurrentLocation } = useWorkLocations()
  const [isCheckingLocation, setIsCheckingLocation] = useState(false)
  const [locationVerified, setLocationVerified] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('anywhere')
  const [duration, setDuration] = useState(90)
  const [goal, setGoal] = useState('')

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'location',
      label: 'In a work zone',
      icon: <MapPin className="w-5 h-5" />,
      checked: false,
      required: false,
      description: 'You can work anywhere, but work zones help maintain focus'
    },
    {
      id: 'environment',
      label: 'Environment ready',
      icon: <Coffee className="w-5 h-5" />,
      checked: false,
      required: true,
      description: 'Clear desk, coffee ready, comfortable setup'
    },
    {
      id: 'tools',
      label: 'Tools prepared',
      icon: <Volume2 className="w-5 h-5" />,
      checked: false,
      required: true,
      description: 'Music/ambient sounds, necessary apps open'
    },
    {
      id: 'mindset',
      label: 'Distractions minimized',
      icon: <BellOff className="w-5 h-5" />,
      checked: false,
      required: true,
      description: 'Phone on DND, notifications off, email closed'
    }
  ])

  // Check location on mount
  useEffect(() => {
    handleCheckLocation()
  }, [])

  const handleCheckLocation = async () => {
    setIsCheckingLocation(true)
    const location = await checkCurrentLocation()
    
    if (location) {
      setLocationVerified(true)
      setSelectedLocation(location.id)
      toggleChecklistItem('location', true)
    }
    
    setIsCheckingLocation(false)
  }

  const toggleChecklistItem = (id: string, forceValue?: boolean) => {
    setChecklist(prev => prev.map(item => 
      item.id === id 
        ? { ...item, checked: forceValue !== undefined ? forceValue : !item.checked }
        : item
    ))
  }

  const canStartSession = () => {
    // Required items must be checked
    const requiredChecked = checklist
      .filter(item => item.required)
      .every(item => item.checked)
    
    return requiredChecked && duration > 0
  }

  const handleStart = () => {
    let locationName = 'Anywhere'
    
    if (selectedLocation === 'anywhere') {
      locationName = 'Anywhere'
    } else {
      const location = locations.find(loc => loc.id === selectedLocation)
      locationName = location?.name || 'Unknown location'
    }

    const sessionData: SessionData = {
      location: locationName,
      locationVerified,
      duration,
      goal: goal || undefined,
      checklist: {
        location: checklist.find(i => i.id === 'location')?.checked || false,
        environment: checklist.find(i => i.id === 'environment')?.checked || false,
        tools: checklist.find(i => i.id === 'tools')?.checked || false,
        mindset: checklist.find(i => i.id === 'mindset')?.checked || false,
      }
    }

    onComplete(sessionData)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Deep Work Session</h2>
        <p className="text-gray-600">Let's set you up for maximum focus</p>
      </div>

      {/* Location Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <button
            onClick={handleCheckLocation}
            disabled={isCheckingLocation}
            className="text-sm text-primary-700 hover:text-primary-800 disabled:text-gray-400"
          >
            {isCheckingLocation ? 'Checking...' : 'Check current location'}
          </button>
        </div>

        {currentLocation && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">
              You're in <strong>{currentLocation.name}</strong>! Great choice for deep work.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {/* Work Anywhere */}
          <button
            onClick={() => setSelectedLocation('anywhere')}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
              selectedLocation === 'anywhere'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className={`text-sm font-medium ${selectedLocation === 'anywhere' ? 'text-primary-700' : 'text-gray-700'}`}>
              🌍 Work from anywhere
            </span>
          </button>

          {/* Saved Locations */}
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => {
                setSelectedLocation(location.id)
                if (currentLocation?.id === location.id) {
                  toggleChecklistItem('location', true)
                }
              }}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                selectedLocation === location.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`text-sm font-medium ${selectedLocation === location.id ? 'text-primary-700' : 'text-gray-700'}`}>
                {location.name}
              </span>
              {currentLocation?.id === location.id && (
                <span className="text-xs text-green-600 font-semibold">✓ Current</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Pre-Session Checklist */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Pre-session checklist
        </label>
        <div className="space-y-2">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                item.checked
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${item.checked ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.checked ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${item.checked ? 'text-green-700' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    {item.required && (
                      <span className="text-xs text-red-500">*required</span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 inline mr-1" />
          Duration: {duration} minutes
        </label>
        <input
          type="range"
          min="15"
          max="240"
          step="15"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>15 min</span>
          <span>4 hours</span>
        </div>
      </div>

      {/* Goal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Target className="w-4 h-4 inline mr-1" />
          What will you work on? (optional)
        </label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Finish report, Code feature, Study chapter 3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none text-gray-900"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onSkip && (
          <button
            onClick={onSkip}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
        )}
        <button
          onClick={handleStart}
          disabled={!canStartSession()}
          className="flex-1 px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Deep Work
        </button>
      </div>

      {!canStartSession() && (
        <p className="mt-3 text-sm text-amber-600 text-center">
          Please complete all required checklist items to start
        </p>
      )}
    </div>
  )
}

// Default export for lazy loading
export default SessionChecklist

