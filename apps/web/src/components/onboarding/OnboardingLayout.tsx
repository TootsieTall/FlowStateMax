'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from '@/store/onboarding'
import { ProgressIndicator } from './ProgressIndicator'
import { Button } from '@flowstate/ui'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

interface OnboardingLayoutProps {
  children: ReactNode
  showProgress?: boolean
  showNavigation?: boolean
}

const screenVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  }),
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

const screenTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

export function OnboardingLayout({
  children,
  showProgress = true,
  showNavigation = true,
}: OnboardingLayoutProps) {
  const {
    currentStep,
    direction,
    steps,
    canContinue,
    canSkip,
    nextStep,
    prevStep,
    skipStep,
    goToStep,
  } = useOnboardingStore()

  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Progress indicator */}
        {showProgress && (
          <ProgressIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        )}

        {/* Screen content with animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={screenTransition}
            className="w-full max-w-4xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {showNavigation && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="container mx-auto max-w-4xl flex items-center justify-between gap-4">
              {/* Back button */}
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={isFirstStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {/* Center info */}
              <div className="flex items-center gap-4">
                {/* Skip button for optional steps */}
                {canSkip() && (
                  <Button
                    variant="ghost"
                    onClick={skipStep}
                    className="gap-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                    Skip
                  </Button>
                )}

                {/* Step counter */}
                <span className="text-sm text-gray-500">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>

              {/* Continue button */}
              <Button
                onClick={nextStep}
                disabled={!canContinue()}
                className="gap-2 min-w-[120px]"
              >
                {isLastStep ? 'Finish' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
