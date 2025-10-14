'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Sparkles, Circle, PlayCircle, Loader2, Timer, Zap, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { StartFlowButton } from './StartFlowButton'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface UserData {
  ritualCompletionCount: number
  locationConfirmationCount: number
  onboardingComplete: boolean
}

interface SessionStatus {
  hasActiveSession: boolean
  sessionId?: string
  endTime?: string
  timeBlockId?: string
  remainingMinutes?: number
}

export function FloatingCaptureCTA() {
  const router = useRouter()
  const { toggleQuickCapture } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Fetch user data for contextual variations
  const { data: userData } = useQuery<UserData>({
    queryKey: ['user-data'],
    queryFn: async () => {
      const res = await fetch('/api/user/profile')
      if (!res.ok) return { ritualCompletionCount: 0, locationConfirmationCount: 0, onboardingComplete: false }
      return res.json()
    },
  })

  // Fetch session status
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

  // Auto-expand on hover
  useEffect(() => {
    if (isHovering) {
      const timer = setTimeout(() => setIsExpanded(true), 300)
      return () => clearTimeout(timer)
    } else {
      setIsExpanded(false)
    }
  }, [isHovering])

  const handleStartFlow = () => {
    // Keep expanded state while flow is starting
    // The StartFlowButton will handle the multi-step flow
    const startButton = document.querySelector('[data-start-flow-button]') as HTMLButtonElement
    if (startButton) {
      startButton.click()
      // Collapse after a delay to allow smooth transition
      setTimeout(() => setIsExpanded(false), 300)
    }
  }

  const handleQuickCapture = () => {
    toggleQuickCapture()
    // Collapse after a delay to allow smooth transition
    setTimeout(() => setIsExpanded(false), 300)
  }

  // Get contextual text based on user state
  const getContextualText = () => {
    if (!userData) return 'Start Golden Focus'
    
    if (!userData.onboardingComplete) {
      return 'Begin Your Journey'
    }
    
    if (userData.ritualCompletionCount === 0) {
      return 'Start Your First Flow'
    }
    
    if (userData.ritualCompletionCount < 7) {
      return 'Build Your Ritual'
    }
    
    if (userData.ritualCompletionCount < 28) {
      return 'Strengthen Focus'
    }
    
    return 'Deep Work Session'
  }

  const getContextualDescription = () => {
    if (!userData) return 'Begin your flow session'
    
    if (!userData.onboardingComplete) {
      return 'Complete setup to start'
    }
    
    if (userData.ritualCompletionCount === 0) {
      return 'Your first deep work session'
    }
    
    if (userData.ritualCompletionCount < 7) {
      return `${7 - userData.ritualCompletionCount} more to build habit`
    }
    
    if (userData.ritualCompletionCount < 28) {
      return `${28 - userData.ritualCompletionCount} more to master`
    }
    
    return 'You\'ve mastered the ritual'
  }

  const hasActiveSession = sessionStatus?.hasActiveSession
  const isLoading = isLoadingSession

  return (
    <TooltipProvider>
      {/* Hidden StartFlowButton for programmatic triggering */}
      <div className="hidden">
        <StartFlowButton variant="primary" />
      </div>

      {/* Floating CTA Container */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Main CTA Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                  relative w-16 h-16 rounded-full shadow-2xl
                  bg-gradient-to-br from-accent-orange to-accent-gold
                  hover:from-accent-orange/90 hover:to-accent-gold/90
                  text-white flex items-center justify-center cursor-pointer
                  transition-all duration-300 hover:scale-110 active:scale-95
                  ${isExpanded ? 'scale-110' : ''}
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 10px 30px rgba(255, 140, 66, 0.3)',
                    '0 15px 40px rgba(255, 140, 66, 0.4)',
                    '0 10px 30px rgba(255, 140, 66, 0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : hasActiveSession ? (
                  <PlayCircle className="w-6 h-6" />
                ) : (
                  <div className="relative">
                    <Sun className="w-7 h-7" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Plus className="w-3 h-3 text-accent-orange" />
                    </div>
                  </div>
                )}

                {/* Pulsing ring */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-orange to-accent-gold"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/90 text-white border-0">
              <p>{hasActiveSession ? 'Resume Flow' : 'Start Flow or Capture'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Expanded Options */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute bottom-20 right-0 space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Start Golden Focus Option */}
                <Card className="w-64 bg-gradient-to-r from-accent-gold to-accent-orange border-0 shadow-xl">
                  <CardContent className="p-0">
                    <Button
                      onClick={handleStartFlow}
                      variant="ghost"
                      className="w-full h-auto p-4 text-white hover:bg-white/10 justify-start"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-white/20 rounded-lg">
                          {hasActiveSession ? (
                            <PlayCircle className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-sm">
                            {hasActiveSession ? 'Resume Flow' : getContextualText()}
                          </div>
                          <div className="text-xs opacity-90">
                            {hasActiveSession 
                              ? `${sessionStatus?.remainingMinutes || 0}m remaining`
                              : getContextualDescription()
                            }
                          </div>
                        </div>
                        {hasActiveSession && (
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            <Timer className="w-3 h-3 mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Capture Option */}
                <Card className="w-64 bg-gradient-to-r from-purple-500 to-pink-500 border-0 shadow-xl">
                  <CardContent className="p-0">
                    <Button
                      onClick={handleQuickCapture}
                      variant="ghost"
                      className="w-full h-auto p-4 text-white hover:bg-white/10 justify-start"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-sm">Quick Capture</div>
                          <div className="text-xs opacity-90">
                            Ideas, tasks & notes
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          <Zap className="w-3 h-3 mr-1" />
                          Fast
                        </Badge>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  )
}
