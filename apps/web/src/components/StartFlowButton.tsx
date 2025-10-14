'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle, Loader2, PlayCircle, AlertCircle } from 'lucide-react'
import { RitualChecklist } from './RitualChecklist'
import { LocationCheck } from './LocationCheck'
import { DurationInput } from './DurationInput'

// Utility function for merging class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

type ButtonVariant = 'primary' | 'floating' | 'icon'

interface StartFlowButtonProps {
  variant?: ButtonVariant
  className?: string
}

interface SessionStatus {
  hasActiveSession: boolean
  sessionId?: string
  endTime?: string
  timeBlockId?: string
  remainingMinutes?: number
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  redirectTo?: string
}

interface UserData {
  ritualCompletionCount: number
  locationConfirmationCount: number
}

// Flow steps
type FlowStep = 'location' | 'duration' | 'ritual' | 'starting'

export function StartFlowButton({ variant = 'primary', className }: StartFlowButtonProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Multi-step flow state
  const [currentStep, setCurrentStep] = useState<FlowStep | null>(null)
  const [flowData, setFlowData] = useState<{
    locationId?: string
    locationConfirmed: boolean
    duration?: number
    ritualCompleted: boolean
  }>({
    locationConfirmed: false,
    ritualCompleted: false,
  })
  
  const [validationError, setValidationError] = useState<string | null>(null)

  // Fetch current session status
  const { data: sessionStatus, isLoading: isLoadingSession } = useQuery<SessionStatus>({
    queryKey: ['session-status'],
    queryFn: async () => {
      const res = await fetch('/api/sessions/flow/status')
      if (!res.ok) throw new Error('Failed to fetch session')
      return res.json()
    },
    refetchInterval: 5000,
    staleTime: 4000,
  })

  // Fetch user data for ritual count
  const { data: userData } = useQuery<UserData>({
    queryKey: ['user-ritual-count'],
    queryFn: async () => {
      const res = await fetch('/api/user/ritual-count')
      if (!res.ok) return { ritualCompletionCount: 0, locationConfirmationCount: 0 }
      return res.json()
    },
  })

  // Validate prerequisites
  const { data: validation, isLoading: isValidating } = useQuery<ValidationResult>({
    queryKey: ['flow-validation'],
    queryFn: async () => {
      const res = await fetch('/api/sessions/validate')
      if (!res.ok) throw new Error('Failed to validate')
      return res.json()
    },
    enabled: !sessionStatus?.hasActiveSession,
  })

  // Start flow session
  const startFlow = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/sessions/flow/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeBlockId: sessionStatus?.timeBlockId,
          duration: flowData.duration,
          locationId: flowData.locationId,
          locationConfirmed: flowData.locationConfirmed,
          ritualCompleted: flowData.ritualCompleted,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to start flow')
      }

      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['session-status'] })
      // Try to activate extension if installed
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({
            type: 'FLOW_SESSION_START',
            sessionId: data.sessionId,
            duration: data.duration,
          })
        }
      } catch (error) {
        console.log('Extension not available:', error)
      }
      router.push('/flow')
    },
    onError: (error: Error) => {
      setValidationError(error.message)
      setTimeout(() => setValidationError(null), 5000)
      setCurrentStep(null)
    },
  })

  const handleClick = () => {
    // If active session, resume
    if (sessionStatus?.hasActiveSession) {
      router.push('/flow')
      return
    }

    // Check validation
    if (validation && !validation.isValid) {
      if (validation.redirectTo) {
        router.push(validation.redirectTo)
        return
      }
      setValidationError(validation.errors[0])
      setTimeout(() => setValidationError(null), 5000)
      return
    }

    // Start multi-step flow
    setCurrentStep('location')
  }

  // Step 1: Location confirmed
  const handleLocationConfirm = (locationId?: string) => {
    setFlowData((prev) => ({
      ...prev,
      locationId,
      locationConfirmed: true,
    }))

    // If no time block, ask for duration
    if (!sessionStatus?.timeBlockId) {
      setCurrentStep('duration')
    } else {
      // Otherwise, check if we need ritual
      checkRitualNeeded()
    }
  }

  // Location skipped
  const handleLocationSkip = () => {
    setFlowData((prev) => ({
      ...prev,
      locationConfirmed: false,
    }))

    if (!sessionStatus?.timeBlockId) {
      setCurrentStep('duration')
    } else {
      checkRitualNeeded()
    }
  }

  // Step 2: Duration set
  const handleDurationSet = (minutes: number) => {
    setFlowData((prev) => ({
      ...prev,
      duration: minutes,
    }))
    checkRitualNeeded()
  }

  // Check if ritual is needed (< 28 completions)
  const checkRitualNeeded = () => {
    const ritualCount = userData?.ritualCompletionCount || 0
    if (ritualCount < 28) {
      setCurrentStep('ritual')
    } else {
      // Skip ritual, start immediately
      setFlowData((prev) => ({
        ...prev,
        ritualCompleted: false, // Already completed 28 times
      }))
      setCurrentStep('starting')
      startFlow.mutate()
    }
  }

  // Step 3: Ritual completed
  const handleBeginFlow = () => {
    setFlowData((prev) => ({
      ...prev,
      ritualCompleted: true,
    }))
    setCurrentStep('starting')
    startFlow.mutate()
  }

  // Close all modals
  const handleCloseAll = () => {
    setCurrentStep(null)
    setFlowData({
      locationConfirmed: false,
      ritualCompleted: false,
    })
  }

  // Determine button state
  const isLoading = isLoadingSession || isValidating || startFlow.isPending
  const isDisabled = isLoading || (validation && !validation.isValid && !validation.redirectTo)
  const hasActiveSession = sessionStatus?.hasActiveSession

  // Button content based on variant and state
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {variant !== 'icon' && <span>Preparing...</span>}
        </>
      )
    }

    if (hasActiveSession) {
      return (
        <>
          <PlayCircle className="w-4 h-4" />
          {variant !== 'icon' && <span>Resume Flow</span>}
          {variant !== 'icon' && sessionStatus.remainingMinutes && (
            <span className="ml-2 px-2 py-0.5 bg-bg-surface/20 rounded-full text-xs">
              {sessionStatus.remainingMinutes}m
            </span>
          )}
        </>
      )
    }

    return (
      <>
        <Circle className="w-4 h-4" />
        {variant !== 'icon' && <span>Start Flow</span>}
      </>
    )
  }

  // Tooltip message for disabled state
  const getTooltip = () => {
    if (validation && !validation.isValid) {
      return validation.errors[0]
    }
    return null
  }

  // Base button classes
  const baseClasses = cn(
    'relative group transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    validationError ? 'ring-2 ring-red-500' : ''
  )

  // Variant-specific styling
  const variantClasses = {
    primary: cn(
      'px-8 py-6 text-lg font-semibold rounded-2xl',
      'bg-gradient-to-r from-accent-orange to-accent-gold',
      'hover:from-accent-orange/90 hover:to-accent-gold/90',
      'text-white shadow-warm-lg hover:shadow-warm-xl',
      'flex items-center gap-3 justify-center min-w-[240px]',
      'transition-all duration-fast hover:-translate-y-0.5'
    ),
    floating: cn(
      'fixed bottom-6 right-6 z-40',
      'w-16 h-16 rounded-full',
      'bg-gradient-to-br from-accent-orange to-accent-gold',
      'hover:from-accent-orange/90 hover:to-accent-gold/90',
      'text-white shadow-warm-2xl hover:shadow-glow-sunset',
      'flex items-center justify-center',
      'transition-all duration-fast',
      'hover:scale-110 active:scale-95',
      'animate-pulse-glow'
    ),
    icon: cn(
      'w-10 h-10 rounded-lg',
      'bg-accent-orange hover:bg-accent-orange/90',
      'text-white shadow-warm-md hover:shadow-warm-lg',
      'flex items-center justify-center',
      'transition-all duration-fast'
    ),
  }

  return (
    <>
      <motion.div
        className={cn(baseClasses, className)}
        whileHover={{ scale: variant === 'floating' ? 1.1 : 1.02 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={handleClick}
          disabled={isDisabled}
          className={variantClasses[variant]}
          title={getTooltip() || undefined}
          data-start-flow-button
        >
          {getButtonContent()}
        </button>

        {/* Pulsing ring animation for primary variant */}
        {variant === 'primary' && !isLoading && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-orange to-accent-gold"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.05, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}

        {/* Error message */}
        <AnimatePresence>
          {validationError && variant === 'primary' && (
            <motion.div
              className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2 text-red-500 text-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="w-4 h-4" />
              <span>{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Location Check Modal */}
      <LocationCheck
        isOpen={currentStep === 'location'}
        onConfirm={handleLocationConfirm}
        onSkip={handleLocationSkip}
        onClose={handleCloseAll}
      />

      {/* Duration Input Modal */}
      <DurationInput
        isOpen={currentStep === 'duration'}
        onSetDuration={handleDurationSet}
        onCancel={handleCloseAll}
      />

      {/* Ritual Checklist Modal */}
      <RitualChecklist
        isOpen={currentStep === 'ritual'}
        onClose={handleCloseAll}
        onBeginFlow={handleBeginFlow}
      />
    </>
  )
}
