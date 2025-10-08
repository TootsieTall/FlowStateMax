'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, Target, X } from 'lucide-react'

interface Location {
  id: string
  name: string
  latitude?: number
  longitude?: number
  radius: number
}

interface StartSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onStartSession: (location: string, duration: number, goal?: string) => void
}

export default function StartSessionModal({ isOpen, onClose, onStartSession }: StartSessionModalProps) {
  const [savedLocations, setSavedLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('anywhere')
  const [customLocation, setCustomLocation] = useState('')
  const [duration, setDuration] = useState(90) // default 90 minutes
  const [goal, setGoal] = useState('')
  const [currentLocationMatch, setCurrentLocationMatch] = useState<string | null>(null)

  useEffect(() => {
    // Load saved locations from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('flowstate_work_locations')
      if (stored) {
        const locations = JSON.parse(stored)
        setSavedLocations(locations)
        
        // Check if user is currently in a saved location (if they have GPS coords)
        checkCurrentLocation(locations)
      }
    }
  }, [isOpen])

  const checkCurrentLocation = async (locations: Location[]) => {
    if (!navigator.geolocation) return

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      })

      const userLat = position.coords.latitude
      const userLng = position.coords.longitude

      // Check if user is within radius of any saved location
      for (const location of locations) {
        if (location.latitude && location.longitude) {
          const distance = getDistance(userLat, userLng, location.latitude, location.longitude)
          if (distance <= location.radius) {
            setCurrentLocationMatch(location.name)
            setSelectedLocation(location.id)
            break
          }
        }
      }
    } catch (error) {
      // Silently fail - user may have denied location permission
      console.log('Could not get current location:', error)
    }
  }

  // Calculate distance in feet between two GPS coordinates
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 20902231 // Earth's radius in feet
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const deg2rad = (deg: number) => deg * (Math.PI / 180)

  const handleStart = () => {
    let locationName = 'Anywhere'
    
    if (selectedLocation === 'anywhere') {
      locationName = 'Anywhere'
    } else if (selectedLocation === 'custom') {
      locationName = customLocation || 'Custom location'
    } else {
      const location = savedLocations.find(loc => loc.id === selectedLocation)
      locationName = location?.name || 'Unknown location'
    }

    onStartSession(locationName, duration, goal || undefined)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Start Deep Work Session</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Location Match */}
        {currentLocationMatch && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">
              You're in <strong>{currentLocationMatch}</strong>! Ready to focus?
            </p>
          </div>
        )}

        {/* Location Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <MapPin className="w-4 h-4 inline mr-1" />
            Where are you working?
          </label>
          
          <div className="space-y-2">
            {/* Work Anywhere Option */}
            <button
              onClick={() => setSelectedLocation('anywhere')}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                selectedLocation === 'anywhere'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`font-medium ${selectedLocation === 'anywhere' ? 'text-primary-700' : 'text-gray-700'}`}>
                🌍 Work from anywhere (no location required)
              </span>
            </button>

            {/* Saved Locations */}
            {savedLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                  selectedLocation === location.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <span className={`font-medium ${selectedLocation === location.id ? 'text-primary-700' : 'text-gray-700'}`}>
                    {location.name}
                  </span>
                  {location.latitude && location.longitude && (
                    <p className="text-xs text-gray-500 mt-0.5">GPS tracked location</p>
                  )}
                </div>
                {currentLocationMatch === location.name && (
                  <span className="text-xs text-green-600 font-semibold">Current</span>
                )}
              </button>
            ))}

            {/* Custom Location */}
            <button
              onClick={() => setSelectedLocation('custom')}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                selectedLocation === 'custom'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`font-medium ${selectedLocation === 'custom' ? 'text-primary-700' : 'text-gray-700'}`}>
                ✏️ Other location
              </span>
            </button>

            {selectedLocation === 'custom' && (
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Enter location name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none text-gray-900 ml-2"
              />
            )}
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

        {/* Session Goal (Optional) */}
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
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="flex-1 px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors"
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  )
}

