'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ExpandableSectionProps {
  id: string
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
}

export function ExpandableSection({
  id,
  title,
  icon,
  children,
  defaultExpanded = false
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === id) {
        setIsExpanded(true)
        // Scroll to section
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }

    // Check on mount
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [id])

  return (
    <div
      id={id}
      className="rounded-xl overflow-hidden"
      style={{
        background: '#1E1E1E',
        boxShadow: '0 0 15px -5px rgba(255,199,87,0.3)',
        border: '1px solid rgba(255,199,87,0.2)',
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.03]"
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div
              className="p-2 rounded-lg text-accent-gold"
              style={{ background: 'rgba(255,199,87,0.1)' }}
            >
              {icon}
            </div>
          )}
          <span className="text-lg font-bold text-text-primary">{title}</span>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="material-symbols-outlined text-text-tertiary"
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
