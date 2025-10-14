'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '@flowstate/ui'

// Utility function for merging class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

interface RitualItem {
  id: string
  text: string
  order: number
  completed: boolean
}

interface RitualChecklistProps {
  isOpen: boolean
  onClose: () => void
  onBeginFlow: () => void
}

export function RitualChecklist({ isOpen, onClose, onBeginFlow }: RitualChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  // Fetch user's ritual items
  const { data: ritualItems = [], isLoading } = useQuery<RitualItem[]>({
    queryKey: ['ritual-items'],
    queryFn: async () => {
      const res = await fetch('/api/ritual')
      if (!res.ok) throw new Error('Failed to fetch ritual items')
      const data = await res.json()
      return data.sort((a: RitualItem, b: RitualItem) => a.order - b.order)
    },
    enabled: isOpen,
  })

  // Reset checked items when modal opens
  useEffect(() => {
    if (isOpen) {
      setCheckedItems(new Set())
    }
  }, [isOpen])

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  const allChecked = ritualItems.length > 0 && checkedItems.size === ritualItems.length
  const progress = ritualItems.length > 0 ? (checkedItems.size / ritualItems.length) * 100 : 0

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md bg-bg-surface dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-2">Pre-Flow Ritual</h2>
            <p className="text-text-secondary dark:text-gray-400">
              Complete your ritual to enter deep focus
            </p>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Ritual items */}
          <div className="p-6 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-text-tertiary">Loading ritual...</div>
            ) : ritualItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-center py-6">
                  <span className="text-4xl mb-3 block">🌄</span>
                  <p className="text-bark-400 mb-2">No ritual items configured yet</p>
                  <p className="text-body-sm text-bark-300">Visit Settings to create your perfect pre-work ritual</p>
                </div>
                <button 
                  onClick={() => window.location.href = '/onboarding/ritual'}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Set up ritual
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {ritualItems.map((item, index) => {
                  const isChecked = checkedItems.has(item.id)

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        'w-full p-4 rounded-lg border-2 transition-all text-left',
                        'hover:scale-[1.02] active:scale-[0.98]',
                        isChecked
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-border-default dark:border-gray-700 hover:border-blue-300'
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div
                          className={cn(
                            'w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all',
                            isChecked
                              ? 'bg-green-500 border-green-500'
                              : 'border-border-default dark:border-gray-600'
                          )}
                        >
                          <AnimatePresence>
                            {isChecked && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Item text */}
                        <span
                          className={cn(
                            'flex-1',
                            isChecked && 'line-through text-text-tertiary'
                          )}
                        >
                          {item.text}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t dark:border-gray-700">
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={onBeginFlow}
                disabled={!allChecked}
                variant="primary"
              >
                {allChecked ? 'Begin Flow' : `${checkedItems.size}/${ritualItems.length} Complete`}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
