'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, AlertCircle, CheckCircle, Navigation, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FlowLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number
  enabled: boolean
}

interface LocationCheckProps {
  isOpen: boolean
  onConfirm: (locationId?: string) => void
  onSkip: () => void
  onClose: () => void
}

export function LocationCheck({ isOpen, onConfirm, onSkip, onClose }: LocationCheckProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'detected' | 'manual' | 'no-locations'>('checking')
  const [locations, setLocations] = useState<FlowLocation[]>([])
  const [selectedLocationId, setSelectedLocationId] = useState<string>()
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string>()
  const [showBenefits, setShowBenefits] = useState(false)

  useEffect(() => {
    if (isOpen) {
      checkLocation()
    }
  }, [isOpen])

  const checkLocation = async () => {
    try {
      // Fetch user's flow locations
      const res = await fetch('/api/onboarding/complete')
      const data = await res.json()
      
      // For now, let's fetch locations from a dedicated endpoint
      const locRes = await fetch('/api/locations')
      if (locRes.ok) {
        const locData = await locRes.json()
        setLocations(locData.locations || [])
        
        if (locData.locations.length === 0) {
          setStatus('no-locations')
          setShowBenefits(true)
          return
        }

        // Check if geolocation is available
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              setCurrentLocation({ lat: latitude, lng: longitude })
              
              // Check if current location matches any flow locations
              const matchedLocation = findMatchingLocation(latitude, longitude, locData.locations)
              
              if (matchedLocation) {
                setSelectedLocationId(matchedLocation.id)
                setStatus('detected')
              } else {
                setStatus('manual')
              }
            },
            (err) => {
              console.error('Geolocation error:', err)
              setStatus('manual')
            }
          )
        } else {
          setStatus('manual')
        }
      } else {
        setStatus('manual')
      }
    } catch (err) {
      console.error('Error checking location:', err)
      setStatus('manual')
    }
  }

  const findMatchingLocation = (lat: number, lng: number, locs: FlowLocation[]) => {
    for (const loc of locs) {
      const distance = calculateDistance(lat, lng, loc.latitude, loc.longitude)
      if (distance <= loc.radius) {
        return loc
      }
    }
    return null
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Haversine formula to calculate distance in meters
    const R = 6371000 // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleManualConfirm = (locationId: string) => {
    setSelectedLocationId(locationId)
    onConfirm(locationId)
  }

  const handleAutoConfirm = () => {
    onConfirm(selectedLocationId)
  }

  const handleAddLocation = () => {
    router.push('/settings?tab=locations')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-lg bg-bg-elevated rounded-2xl shadow-2xl overflow-hidden mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-bg-surface transition-colors z-10"
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-border-default">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent-gold/10 rounded-lg">
                <MapPin className="w-6 h-6 text-accent-gold" />
              </div>
              <h2 className="text-h2 text-text-primary">Location Check</h2>
            </div>
            <p className="text-body-sm text-text-secondary">
              Consistent environments help trigger deep work habits
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Checking Status */}
            {status === 'checking' && (
              <div className="text-center py-8">
                <Navigation className="w-12 h-12 text-accent-gold mx-auto mb-4 animate-pulse" />
                <p className="text-body text-text-secondary">Checking your location...</p>
              </div>
            )}

            {/* Auto-detected Location */}
            {status === 'detected' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text-primary mb-1">Location Confirmed!</p>
                    <p className="text-body-sm text-text-secondary">
                      You're at{' '}
                      <span className="font-medium text-text-primary">
                        {locations.find((l) => l.id === selectedLocationId)?.name}
                      </span>
                    </p>
                  </div>
                </div>

                <button onClick={handleAutoConfirm} className="btn-primary w-full">
                  Continue to Flow
                </button>

                <button onClick={() => setStatus('manual')} className="btn-ghost w-full">
                  Choose Different Location
                </button>
              </motion.div>
            )}

            {/* Manual Selection */}
            {status === 'manual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-body text-text-secondary mb-4">
                  Select your current flow location:
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleManualConfirm(location.id)}
                      className="w-full p-4 text-left border-2 border-border-default rounded-lg hover:border-accent-gold hover:bg-accent-gold/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-text-tertiary group-hover:text-accent-gold transition-colors" />
                        <span className="font-medium text-text-primary">{location.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button onClick={onSkip} className="btn-ghost w-full mt-4">
                  Skip Location Check
                </button>
              </motion.div>
            )}

            {/* No Locations - Show Benefits */}
            {status === 'no-locations' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Cal Newport Quote */}
                <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-lg p-4">
                  <blockquote className="text-body-sm text-text-primary italic mb-2">
                    "By leveraging a radical change to your normal environment, you increase the
                    perceived importance of the task at hand, reducing procrastination and
                    providing an energy boost."
                  </blockquote>
                  <footer className="text-caption text-text-tertiary">— Cal Newport, Deep Work</footer>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary">Why Location Matters:</h3>
                  <ul className="space-y-2">
                    {[
                      'Creates mental cue for deep focus',
                      'Builds ritual association over time',
                      'Reduces decision fatigue',
                      'Separates work from relaxation spaces',
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-body-sm text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <button onClick={handleAddLocation} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Your First Flow Location
                  </button>
                  <button onClick={onSkip} className="btn-ghost w-full">
                    Continue Without Location
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

