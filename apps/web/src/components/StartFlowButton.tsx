'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle, Loader2, PlayCircle, Clock, AlertCircle } from 'lucide-react'
import { RitualChecklist } from './RitualChecklist'

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

export function StartFlowButton({ variant = 'primary', className }: StartFlowButtonProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showRitualModal, setShowRitualModal] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Fetch current session status
  const { data: sessionStatus, isLoading: isLoadingSession } = useQuery<SessionStatus>({
    queryKey: ['session-status'],
    queryFn: async () => {
      const res = await fetch('/api/sessions/current')
      if (!res.ok) throw new Error('Failed to fetch session')
      return res.json()
    },
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 4000,
  })

  // Validate prerequisites
  const { data: validation, isLoading: isValidating } = useQuery<ValidationResult>({
    queryKey: ['flow-validation'],
    queryFn: async () => {
      const res = await fetch('/api/sessions/validate')
      if (!res.ok) throw new Error('Failed to validate')
      return res.json()
    },
    enabled: !sessionStatus?.hasActiveSession, // Only validate when no active session
  })

  // Start flow session
  const startFlow = useMutation({
    mutationFn: async (timeBlockId?: string) => {
      const res = await fetch('/api/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeBlockId }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to start flow')
      }

      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['session-status'] })
      router.push('/flow')
    },
    onError: (error: Error) => {
      setValidationError(error.message)
      setTimeout(() => setValidationError(null), 5000)
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

    // Show ritual checklist
    setShowRitualModal(true)
  }

  const handleBeginFlow = () => {
    setShowRitualModal(false)
    startFlow.mutate(sessionStatus?.timeBlockId)
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
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
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
      'bg-gradient-to-r from-blue-600 to-purple-600',
      'hover:from-blue-700 hover:to-purple-700',
      'text-white shadow-lg hover:shadow-xl',
      'flex items-center gap-3 justify-center min-w-[240px]'
    ),
    floating: cn(
      'fixed bottom-6 right-6 z-50',
      'w-16 h-16 rounded-full',
      'bg-gradient-to-r from-blue-600 to-purple-600',
      'hover:from-blue-700 hover:to-purple-700',
      'text-white shadow-2xl hover:shadow-3xl',
      'flex items-center justify-center',
      'hover:scale-110 active:scale-95'
    ),
    icon: cn(
      'w-10 h-10 rounded-lg',
      'bg-blue-600 hover:bg-blue-700',
      'text-white',
      'flex items-center justify-center'
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
        >
          {getButtonContent()}
        </button>

        {/* Pulsing ring animation for primary variant */}
        {variant === 'primary' && !isLoading && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-blue-600"
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
              className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2 text-red-600 text-sm"
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

      {/* Ritual Checklist Modal */}
      <RitualChecklist
        isOpen={showRitualModal}
        onClose={() => setShowRitualModal(false)}
        onBeginFlow={handleBeginFlow}
      />
    </>
  )
}
