'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, X, Locate, AlertCircle } from 'lucide-react'

interface Location {
  id: string
  name: string
  latitude?: number
  longitude?: number
  radius: number // in feet
}

export default function LocationsPage() {
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])
  const [newLocationName, setNewLocationName] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')

  const addManualLocation = () => {
    if (!newLocationName.trim()) return

    const newLocation: Location = {
      id: Date.now().toString(),
      name: newLocationName.trim(),
      radius: 50, // default 50 feet
    }

    setLocations([...locations, newLocation])
    setNewLocationName('')
  }

  const addCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: Location = {
          id: Date.now().toString(),
          name: 'Current Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 50,
        }

        setLocations([...locations, newLocation])
        setIsGettingLocation(false)
      },
      (error) => {
        setIsGettingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out.')
            break
          default:
            setLocationError('An error occurred while getting your location.')
        }
      }
    )
  }

  const removeLocation = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id))
  }

  const updateLocationName = (id: string, name: string) => {
    setLocations(
      locations.map((loc) => (loc.id === id ? { ...loc, name } : loc))
    )
  }

  const updateLocationRadius = (id: string, radius: number) => {
    setLocations(
      locations.map((loc) => (loc.id === id ? { ...loc, radius } : loc))
    )
  }

  const handleContinue = async () => {
    // Save locations to localStorage for now (will use API when backend is ready)
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowstate_work_locations', JSON.stringify(locations))
    }
    console.log('Saved locations:', locations)
    router.push('/onboarding/apps')
  }

  const handleSkip = () => {
    router.push('/onboarding/apps')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
      <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 shadow-glow-strong animate-slide-in-right max-w-2xl w-full p-8">
        <div className="mb-8">
          <div className="text-overline text-accent-orange mb-2">STEP 4 OF 8</div>
          <h1 className="text-display-md text-text-primary mb-2">
            Where do you do your best work?
          </h1>
          <p className="text-body text-text-tertiary">
            Add your flow zones so we can remind you to start deep work sessions when you arrive
          </p>
        </div>

        {/* Add Manual Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Add a location manually
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addManualLocation()}
              placeholder="e.g., Home Office, Library, Coffee Shop"
              className="input"
            />
            <button
              onClick={addManualLocation}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Add Current Location */}
        <div className="mb-6">
          <button
            onClick={addCurrentLocation}
            disabled={isGettingLocation}
            className="w-full px-4 py-3 border-2 border-dashed border-border-default rounded-warm hover:border-accent-gold hover:bg-accent-gold/5 transition-colors flex items-center justify-center gap-2 text-text-primary hover:text-accent-orange disabled:opacity-50"
          >
            <Locate className={`w-5 h-5 ${isGettingLocation ? 'animate-pulse' : ''}`} />
            {isGettingLocation ? 'Getting your location...' : 'Add Current Location (with GPS)'}
          </button>
        </div>

        {/* Location Error */}
        {locationError && (
          <div className="mb-6 p-3 bg-accent-orange/10 border border-accent-orange/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-orange">{locationError}</p>
          </div>
        )}

        {/* Locations List */}
        {locations.length > 0 && (
          <div className="mb-8 space-y-3">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Your work zones ({locations.length})
            </label>
            {locations.map((location) => (
              <div
                key={location.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-accent-orange flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={location.name}
                      onChange={(e) => updateLocationName(location.id, e.target.value)}
                      className="input font-medium"
                    />
                    {location.latitude && location.longitude && (
                      <p className="text-xs text-text-tertiary mt-1">
                        📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeLocation(location.id)}
                    className="p-1 text-text-tertiary hover:text-accent-orange transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Radius Slider */}
                <div className="ml-8">
                  <label className="block text-xs text-gray-600 mb-1">
                    Detection Radius: {location.radius} feet
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="25"
                    value={location.radius}
                    onChange={(e) =>
                      updateLocationRadius(location.id, parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-700"
                  />
                  <div className="flex justify-between text-xs text-text-tertiary mt-1">
                    <span>25 ft</span>
                    <span>500 ft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mb-8 p-4 bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border border-accent-gold/30 rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            💡 How it works
          </h3>
          <p className="text-sm text-text-secondary">
            When you enter one of your work zones, FlowState will send you a notification asking if
            you're ready to start a deep work session. You can adjust the detection radius for each
            location.
          </p>
        </div>

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
              disabled={locations.length === 0}
              className="px-8 py-3 btn-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue {locations.length > 0 && `(${locations.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

