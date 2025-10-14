'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Calendar } from 'lucide-react'

export default function ThemeTest() {
  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-text-primary">
          Dark Sunrise Theme Test
        </h1>

        {/* Color Swatches */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Colors</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-bg-primary h-20 rounded-lg border border-border-default flex items-center justify-center text-text-secondary text-sm">
              bg-primary
            </div>
            <div className="bg-bg-elevated h-20 rounded-lg border border-border-default flex items-center justify-center text-text-secondary text-sm">
              bg-elevated
            </div>
            <div className="bg-accent-gold h-20 rounded-lg flex items-center justify-center text-bg-primary text-sm font-bold">
              accent-gold
            </div>
            <div className="bg-accent-orange h-20 rounded-lg flex items-center justify-center text-bg-primary text-sm font-bold">
              accent-orange
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Buttons</h2>
          <div className="flex gap-4">
            <button className="btn-primary">
              Primary Button
            </button>
            <button className="btn-secondary">
              Secondary Button
            </button>
            <button className="btn-ghost">
              Ghost Button
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Cards</h2>
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Standard Card</h3>
            <p className="text-text-secondary">This is a standard card with default styling.</p>
          </div>
          <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 shadow-glow-strong">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Elevated Card</h3>
            <p className="text-text-secondary">This card has a stronger glow effect.</p>
          </div>
        </div>

        {/* Framer Motion Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Animations (Framer Motion)</h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card cursor-pointer"
          >
            <p className="text-text-secondary">Hover me for scale animation</p>
          </motion.div>
        </div>

        {/* Icons Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Icons (Lucide)</h2>
          <div className="flex gap-6">
            <Sparkles className="w-8 h-8 text-accent-gold" />
            <Zap className="w-8 h-8 text-accent-orange" />
            <Calendar className="w-8 h-8 text-accent-warm" />
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Form Inputs</h2>
          <input
            type="text"
            className="input"
            placeholder="Type something..."
          />
        </div>
      </div>
    </div>
  )
}
