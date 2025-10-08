'use client'

import { useState, useEffect } from 'react'

export interface WorkLocation {
  id: string
  name: string
  latitude?: number
  longitude?: number
  radius: number // in feet
}

export function useWorkLocations() {
  const [locations, setLocations] = useState<WorkLocation[]>([])
  const [currentLocation, setCurrentLocation] = useState<WorkLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved locations from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('flowstate_work_locations')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setLocations(parsed)
        } catch (error) {
          console.error('Error loading work locations:', error)
        }
      }
      setIsLoading(false)
    }
  }, [])

  // Check if user is in a saved location
  const checkCurrentLocation = async (): Promise<WorkLocation | null> => {
    if (!navigator.geolocation || locations.length === 0) {
      return null
    }

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
            setCurrentLocation(location)
            return location
          }
        }
      }

      setCurrentLocation(null)
      return null
    } catch (error) {
      console.log('Could not get current location:', error)
      return null
    }
  }

  // Calculate distance in feet between two GPS coordinates
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

  const deg2rad = (deg: number): number => deg * (Math.PI / 180)

  // Save a new location
  const saveLocation = (location: WorkLocation) => {
    const updated = [...locations, location]
    setLocations(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowstate_work_locations', JSON.stringify(updated))
    }
  }

  // Remove a location
  const removeLocation = (id: string) => {
    const updated = locations.filter(loc => loc.id !== id)
    setLocations(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowstate_work_locations', JSON.stringify(updated))
    }
  }

  // Update a location
  const updateLocation = (id: string, updates: Partial<WorkLocation>) => {
    const updated = locations.map(loc => 
      loc.id === id ? { ...loc, ...updates } : loc
    )
    setLocations(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowstate_work_locations', JSON.stringify(updated))
    }
  }

  return {
    locations,
    currentLocation,
    isLoading,
    checkCurrentLocation,
    saveLocation,
    removeLocation,
    updateLocation,
  }
}

