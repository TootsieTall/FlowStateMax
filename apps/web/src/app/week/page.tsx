'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay, set } from 'date-fns'
import { BlockCard, Button } from '@flowstate/ui'
import { Plus, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { StartFlowButton } from '@/components/StartFlowButton'

interface TimeBlock {
  id: string
  title: string
  startTime: Date
  endTime: Date
  type: string
  color: string | null
}

interface AddBlockModalProps {
  day: Date
  onClose: () => void
  onSave: (block: TimeBlock) => void
}

const BLOCK_TYPES = [
  { value: 'DEEP_WORK', label: 'Deep Work', color: '#f59e0b' },
  { value: 'SHALLOW_WORK', label: 'Shallow Work', color: '#6b7280' },
  { value: 'BREAK', label: 'Break', color: '#10b981' },
  { value: 'PERSONAL', label: 'Personal', color: '#8b5cf6' },
]

function AddBlockModal({ day, onClose, onSave }: AddBlockModalProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('DEEP_WORK')
  const [startHour, setStartHour] = useState('09')
  const [startMin, setStartMin] = useState('00')
  const [endHour, setEndHour] = useState('10')
  const [endMin, setEndMin] = useState('00')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const mins = ['00', '15', '30', '45']

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }

    const startTime = set(day, {
      hours: parseInt(startHour),
      minutes: parseInt(startMin),
      seconds: 0,
      milliseconds: 0,
    })
    const endTime = set(day, {
      hours: parseInt(endHour),
      minutes: parseInt(endMin),
      seconds: 0,
      milliseconds: 0,
    })

    if (endTime <= startTime) {
      setError('End time must be after start time')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          type,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create block')
      }

      const block = await res.json()
      onSave({
        ...block,
        startTime: new Date(block.startTime),
        endTime: new Date(block.endTime),
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1410] border border-amber-900/30 rounded-xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-amber-100">
            Add Block — {format(day, 'EEE, MMM d')}
          </h3>
          <button onClick={onClose} className="text-amber-400/60 hover:text-amber-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm text-amber-300/70 mb-1">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="e.g. Deep work session"
              className="w-full bg-amber-950/30 border border-amber-900/40 rounded-lg px-3 py-2 text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-500/60 transition-colors"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm text-amber-300/70 mb-1">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    type === t.value
                      ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                      : 'border-amber-900/30 text-amber-400/60 hover:border-amber-700/50 hover:text-amber-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-amber-300/70 mb-1">Start</label>
              <div className="flex gap-1">
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="flex-1 bg-amber-950/30 border border-amber-900/40 rounded-lg px-2 py-2 text-amber-100 focus:outline-none focus:border-amber-500/60 text-sm"
                >
                  {hours.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                <select
                  value={startMin}
                  onChange={(e) => setStartMin(e.target.value)}
                  className="flex-1 bg-amber-950/30 border border-amber-900/40 rounded-lg px-2 py-2 text-amber-100 focus:outline-none focus:border-amber-500/60 text-sm"
                >
                  {mins.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-amber-300/70 mb-1">End</label>
              <div className="flex gap-1">
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="flex-1 bg-amber-950/30 border border-amber-900/40 rounded-lg px-2 py-2 text-amber-100 focus:outline-none focus:border-amber-500/60 text-sm"
                >
                  {hours.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                <select
                  value={endMin}
                  onChange={(e) => setEndMin(e.target.value)}
                  className="flex-1 bg-amber-950/30 border border-amber-900/40 rounded-lg px-2 py-2 text-amber-100 focus:outline-none focus:border-amber-500/60 text-sm"
                >
                  {mins.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-amber-900/40 text-amber-400/70 hover:text-amber-300 hover:border-amber-700/50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium hover:from-amber-500 hover:to-orange-500 transition-all text-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Block'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WeekViewPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [addingForDay, setAddingForDay] = useState<Date | null>(null)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  useEffect(() => {
    loadBlocks()
  }, [currentWeek])

  const loadBlocks = async () => {
    try {
      const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 })
      const endDate = addDays(startDate, 7)

      const response = await fetch(
        `/api/blocks?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )
      const data = await response.json()
      setBlocks(data.map((b: any) => ({
        ...b,
        startTime: new Date(b.startTime),
        endTime: new Date(b.endTime),
      })))
    } catch (error) {
      console.error('Error loading blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBlocksForDay = (day: Date) => {
    return blocks.filter((block) => isSameDay(block.startTime, day))
  }

  const previousWeek = () => setCurrentWeek(addDays(currentWeek, -7))
  const nextWeek = () => setCurrentWeek(addDays(currentWeek, 7))

  const handleBlockSaved = (newBlock: TimeBlock) => {
    setBlocks((prev) => [...prev, newBlock].sort((a, b) => a.startTime.getTime() - b.startTime.getTime()))
    setAddingForDay(null)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation - Floating layer */}
      <nav className="layer-floating sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient-sunset">Daybreak</h1>
            </div>
            <div className="flex items-center space-x-6 md:space-x-8">
              <a href="/week" className="text-accent-gold font-semibold">
                Week
              </a>
              <a href="/today" className="text-text-tertiary hover:text-accent-gold transition-all duration-fast hover:-translate-y-0.5">
                Today
              </a>
              <a href="/capture" className="text-text-tertiary hover:text-accent-gold transition-all duration-fast hover:-translate-y-0.5">
                Capture
              </a>
              <a href="/explore" className="text-text-tertiary hover:text-accent-gold transition-all duration-fast hover:-translate-y-0.5">
                Explore
              </a>
              <a href="/settings" className="text-text-tertiary hover:text-accent-gold transition-all duration-fast hover:-translate-y-0.5">
                Settings
              </a>
              <StartFlowButton variant="icon" />
            </div>
          </div>
        </div>
      </nav>

      {/* Week View - Responsive container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousWeek}
            className="layer-elevated p-2 rounded-warm transition-all duration-fast text-text-secondary hover:text-accent-gold hover-lift"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-h2 text-text-primary">
            {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
          </h2>
          <button
            onClick={nextWeek}
            className="layer-elevated p-2 rounded-warm transition-all duration-fast text-text-secondary hover:text-accent-gold hover-lift"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-body text-text-tertiary">Loading your week...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => {
              const dayBlocks = getBlocksForDay(day)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toISOString()}
                  className={`card p-4 min-h-[400px] transition-all duration-normal hover:-translate-y-1 hover:shadow-warm-md ${
                    isToday ? 'border-2 border-accent-gold shadow-glow-amber' : ''
                  }`}
                >
                  <div className="mb-4">
                    <div className="text-overline text-text-tertiary">{format(day, 'EEE')}</div>
                    <div
                      className={`text-h1 ${
                        isToday ? 'text-gradient-sunset' : 'text-text-primary'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dayBlocks.map((block) => (
                      <BlockCard
                        key={block.id}
                        title={block.title}
                        startTime={block.startTime}
                        endTime={block.endTime}
                        type={block.type}
                        color={block.color}
                      />
                    ))}
                  </div>

                  <button
                    className="w-full mt-4 p-2 border-2 border-dashed border-border-default rounded-warm-lg hover:border-accent-gold hover:bg-accent-gold/5 transition-all duration-fast flex items-center justify-center text-text-tertiary hover:text-accent-gold group"
                    onClick={() => setAddingForDay(day)}
                  >
                    <Plus className="w-4 h-4 mr-1 group-hover:animate-icon-bounce" />
                    <span className="text-sm">Add block</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Quick Capture Button */}
      <button
        className="fixed bottom-8 right-8 bg-gradient-to-br from-sunset-400 to-gold-400 hover:from-accent-gold hover:to-accent-orange text-white rounded-full p-4 shadow-warm-2xl hover:shadow-glow-sunset transition-all duration-fast hover:scale-110 animate-pulse-glow"
        onClick={() => (window.location.href = '/capture')}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Block Modal */}
      {addingForDay && (
        <AddBlockModal
          day={addingForDay}
          onClose={() => setAddingForDay(null)}
          onSave={handleBlockSaved}
        />
      )}
    </div>
  )
}
