'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { OnboardingStep } from '@/store/onboarding'

interface ProgressIndicatorProps {
  steps: OnboardingStep[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function ProgressIndicator({
  steps,
  currentStep,
  onStepClick,
}: ProgressIndicatorProps) {
  const progress = (currentStep / (steps.length - 1)) * 100

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-start">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = step.completed
          const isPast = index < currentStep
          const isClickable = onStepClick && (isPast || isCompleted)

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 flex-1"
            >
              {/* Step circle */}
              <motion.button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all relative',
                  'disabled:cursor-not-allowed',
                  isActive && 'bg-blue-600 text-white shadow-lg scale-110',
                  isCompleted && !isActive && 'bg-green-500 text-white',
                  !isActive &&
                    !isCompleted &&
                    'bg-gray-200 dark:bg-gray-700 text-gray-400',
                  isClickable && 'hover:scale-105'
                )}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                {isCompleted ? (
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                ) : (
                  <span>{index + 1}</span>
                )}

                {/* Active pulse animation */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-600"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                )}
              </motion.button>

              {/* Step title */}
              <div className="flex flex-col items-center gap-1 min-h-[3rem]">
                <span
                  className={cn(
                    'text-xs font-medium text-center transition-colors',
                    isActive && 'text-blue-600 dark:text-blue-400',
                    isCompleted && !isActive && 'text-green-600 dark:text-green-400',
                    !isActive && !isCompleted && 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {step.title}
                </span>

                {/* Required indicator */}
                {step.required && !isCompleted && (
                  <span className="text-xs text-red-500">*</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
