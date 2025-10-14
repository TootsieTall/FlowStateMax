'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, X, Plus, Minus } from 'lucide-react'

interface DurationInputProps {
  isOpen: boolean
  onSetDuration: (minutes: number) => void
  onCancel: () => void
}

const PRESET_DURATIONS = [
  { label: '25 min', value: 25, description: 'Quick focus' },
  { label: '45 min', value: 45, description: 'Deep dive' },
  { label: '60 min', value: 60, description: 'Standard session' },
  { label: '90 min', value: 90, description: 'Extended flow' },
  { label: '120 min', value: 120, description: 'Maximum focus' },
]

export function DurationInput({ isOpen, onSetDuration, onCancel }: DurationInputProps) {
  const [customDuration, setCustomDuration] = useState<number>(60)
  const [showCustom, setShowCustom] = useState(false)

  const handlePresetSelect = (minutes: number) => {
    onSetDuration(minutes)
  }

  const handleCustomConfirm = () => {
    if (customDuration >= 15 && customDuration <= 240) {
      onSetDuration(customDuration)
    }
  }

  const adjustCustomDuration = (amount: number) => {
    setCustomDuration((prev) => Math.max(15, Math.min(240, prev + amount)))
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
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
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-bg-surface transition-colors z-10"
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-border-default">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent-gold/10 rounded-lg">
                <Clock className="w-6 h-6 text-accent-gold" />
              </div>
              <h2 className="text-h2 text-text-primary">How long will you work?</h2>
            </div>
            <p className="text-body-sm text-text-secondary">
              Choose a duration for your flow session
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {!showCustom ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {/* Preset Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_DURATIONS.map((preset) => (
                    <motion.button
                      key={preset.value}
                      onClick={() => handlePresetSelect(preset.value)}
                      className="p-4 border-2 border-border-default rounded-lg hover:border-accent-gold hover:bg-accent-gold/5 transition-all text-left group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-h3 text-text-primary font-semibold mb-1">
                        {preset.label}
                      </div>
                      <div className="text-caption text-text-tertiary group-hover:text-text-secondary transition-colors">
                        {preset.description}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Duration Button */}
                <button
                  onClick={() => setShowCustom(true)}
                  className="w-full p-4 border-2 border-dashed border-border-default rounded-lg hover:border-accent-gold hover:bg-accent-gold/5 transition-all text-text-secondary hover:text-text-primary"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Custom Duration</span>
                  </div>
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Custom Input */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => adjustCustomDuration(-5)}
                      className="p-3 rounded-lg bg-bg-surface hover:bg-accent-gold/10 border border-border-default hover:border-accent-gold transition-all"
                    >
                      <Minus className="w-5 h-5 text-text-primary" />
                    </button>

                    <div className="text-center">
                      <div className="text-display-sm text-text-primary font-bold">
                        {formatDuration(customDuration)}
                      </div>
                      <div className="text-caption text-text-tertiary mt-1">
                        {customDuration} minutes
                      </div>
                    </div>

                    <button
                      onClick={() => adjustCustomDuration(5)}
                      className="p-3 rounded-lg bg-bg-surface hover:bg-accent-gold/10 border border-border-default hover:border-accent-gold transition-all"
                    >
                      <Plus className="w-5 h-5 text-text-primary" />
                    </button>
                  </div>

                  {/* Range Slider */}
                  <div className="px-2">
                    <input
                      type="range"
                      min="15"
                      max="240"
                      step="5"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(Number(e.target.value))}
                      className="w-full accent-accent-gold"
                    />
                    <div className="flex justify-between text-caption text-text-tertiary mt-2">
                      <span>15 min</span>
                      <span>4 hours</span>
                    </div>
                  </div>

                  {/* Timer Preview Visualization */}
                  <div className="bg-bg-surface border border-border-default rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-4 h-4 text-accent-gold" />
                      <span className="text-body-sm text-text-secondary">Session Preview</span>
                    </div>
                    <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-gold to-accent-orange"
                        initial={{ width: 0 }}
                        animate={{ width: `${(customDuration / 240) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="text-caption text-text-tertiary mt-2 text-center">
                      Sunrise animation will complete over {formatDuration(customDuration)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button onClick={() => setShowCustom(false)} className="btn-secondary flex-1">
                    Back to Presets
                  </button>
                  <button
                    onClick={handleCustomConfirm}
                    disabled={customDuration < 15 || customDuration > 240}
                    className="btn-primary flex-1"
                  >
                    Start Flow
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

