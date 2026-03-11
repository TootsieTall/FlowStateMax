'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay, set } from 'date-fns'
import { BlockCard } from '@flowstate/ui'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{
          background: '#1a1410',
          border: '1px solid rgba(255,199,87,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,199,87,0.06)',
        }}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold text-text-primary">
            Add Block — {format(day, 'EEE, MMM d')}
          </h3>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-accent-gold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-accent-gold/60 uppercase tracking-widest mb-1.5">
              Title
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="e.g. Deep work session"
              className="w-full rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:outline-none transition-colors"
              style={{
                background: 'rgba(255,199,87,0.04)',
                border: '1px solid rgba(255,199,87,0.15)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,199,87,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,199,87,0.15)'
              }}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-accent-gold/60 uppercase tracking-widest mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: type === t.value ? 'rgba(255,199,87,0.15)' : 'rgba(255,199,87,0.03)',
                    border: type === t.value
                      ? '1px solid rgba(255,199,87,0.5)'
                      : '1px solid rgba(255,199,87,0.1)',
                    color: type === t.value ? '#ffc757' : '#6B6560',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-accent-gold/60 uppercase tracking-widest mb-1.5">
                Start
              </label>
              <div className="flex gap-1">
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="flex-1 rounded-xl px-2 py-2 text-sm text-text-primary focus:outline-none"
                  style={{ background: 'rgba(255,199,87,0.04)', border: '1px solid rgba(255,199,87,0.15)' }}
                >
                  {hours.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                <select
                  value={startMin}
                  onChange={(e) => setStartMin(e.target.value)}
                  className="flex-1 rounded-xl px-2 py-2 text-sm text-text-primary focus:outline-none"
                  style={{ background: 'rgba(255,199,87,0.04)', border: '1px solid rgba(255,199,87,0.15)' }}
                >
                  {mins.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-accent-gold/60 uppercase tracking-widest mb-1.5">
                End
              </label>
              <div className="flex gap-1">
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="flex-1 rounded-xl px-2 py-2 text-sm text-text-primary focus:outline-none"
                  style={{ background: 'rgba(255,199,87,0.04)', border: '1px solid rgba(255,199,87,0.15)' }}
                >
                  {hours.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                <select
                  value={endMin}
                  onChange={(e) => setEndMin(e.target.value)}
                  className="flex-1 rounded-xl px-2 py-2 text-sm text-text-primary focus:outline-none"
                  style={{ background: 'rgba(255,199,87,0.04)', border: '1px solid rgba(255,199,87,0.15)' }}
                >
                  {mins.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-text-tertiary hover:text-text-secondary transition-colors"
              style={{ border: '1px solid rgba(255,199,87,0.15)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-bg-primary transition-all disabled:opacity-50 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #ffc757 0%, #fb923c 100%)' }}
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
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Subtle golden top glow */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-48 z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% -10%, rgba(255,200,87,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Week Navigation Header */}
      <header
        className="sticky top-0 z-30 px-6 py-4"
        style={{
          background: 'rgba(11,11,11,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,199,87,0.1)',
        }}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Week navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={previousWeek}
              className="p-2 rounded-xl text-text-tertiary hover:text-accent-gold transition-colors"
              style={{ border: '1px solid rgba(255,199,87,0.1)' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              {format(weekStart, 'MMMM d')} – {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
            </h2>
            <button
              onClick={nextWeek}
              className="p-2 rounded-xl text-text-tertiary hover:text-accent-gold transition-colors"
              style={{ border: '1px solid rgba(255,199,87,0.1)' }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Start Flow */}
          <StartFlowButton variant="icon" />
        </div>
      </header>

      {/* Main Kanban Board — horizontal scroll */}
      <main className="flex-1 overflow-x-auto px-6 pt-6 pb-4 relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b3d20 transparent' }}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-text-tertiary">Loading your week...</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 min-w-max pb-4 max-w-[1600px] mx-auto">
            {days.map((day) => {
              const dayBlocks = getBlocksForDay(day)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toISOString()}
                  className="flex flex-col gap-3"
                  style={{ minWidth: '280px' }}
                >
                  {/* Day header — Stitch 05 */}
                  <div className="flex items-center justify-between px-2">
                    <h3
                      className="font-bold uppercase tracking-widest text-xs"
                      style={{ color: isToday ? '#ffc757' : '#94a3b8' }}
                    >
                      {format(day, 'EEEE')} {format(day, 'd')}
                      {isToday && ' (Today)'}
                    </h3>
                    {isToday ? (
                      <span className="material-symbols-outlined text-sm" style={{ color: '#ffc757' }}>notifications_active</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm" style={{ color: '#64748b' }}>more_horiz</span>
                    )}
                  </div>

                  {/* Day column — Stitch 05 */}
                  <div
                    className="flex flex-col gap-3 flex-1 rounded-xl p-2"
                    style={{
                      minHeight: '420px',
                      background: isToday
                        ? 'rgba(255,199,87,0.05)'
                        : 'rgba(30,41,59,0.2)',
                      border: isToday
                        ? '2px solid rgba(255,199,87,0.3)'
                        : '1px solid rgba(30,41,59,0.3)',
                      boxShadow: isToday
                        ? '0 0 15px rgba(255,199,87,0.1)'
                        : 'none',
                    }}
                  >
                    {/* Block cards — Stitch 05 */}
                    {dayBlocks.map((block) => (
                      <div
                        key={block.id}
                        className="rounded-xl p-4 shadow-lg relative group"
                        style={{
                          background: '#1E1E1E',
                          border: isToday
                            ? '1px solid rgba(255,199,87,0.2)'
                            : '1px solid rgba(30,41,59,1)',
                        }}
                      >
                        {/* Gold left accent for today's blocks */}
                        {isToday && (
                          <div
                            className="absolute -left-1 top-4 h-8 w-1 rounded-full"
                            style={{ background: '#ffc757' }}
                          />
                        )}
                        <div className="flex items-start justify-between mb-2">
                          <BlockCard
                            title={block.title}
                            startTime={block.startTime}
                            endTime={block.endTime}
                            type={block.type}
                            color={block.color}
                          />
                          <span className="material-symbols-outlined text-sm cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#4b5563' }}>drag_indicator</span>
                        </div>
                      </div>
                    ))}

                    {/* Ghost card / Add block — Stitch 05 */}
                    <button
                      onClick={() => setAddingForDay(day)}
                      className="h-24 rounded-xl flex items-center justify-center transition-all"
                      style={{
                        border: isToday
                          ? '2px dashed rgba(255,199,87,0.3)'
                          : '2px dashed rgba(255,199,87,0.15)',
                        background: isToday
                          ? 'rgba(255,199,87,0.05)'
                          : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,199,87,0.4)'
                        e.currentTarget.style.background = 'rgba(255,199,87,0.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = isToday ? 'rgba(255,199,87,0.3)' : 'rgba(255,199,87,0.15)'
                        e.currentTarget.style.background = isToday ? 'rgba(255,199,87,0.05)' : 'transparent'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: 'rgba(255,199,87,0.4)' }}>add</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Inbox / Backlog strip — Stitch 05 */}
      <section
        className="relative z-10 p-6"
        style={{
          borderTop: '1px solid rgba(255,199,87,0.1)',
          background: '#1A150B',
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-accent-gold">inventory_2</span>
              Inbox &amp; Backlog
            </h2>
            <div className="h-px flex-1" style={{ background: 'rgba(255,199,87,0.1)' }} />
            <button
              onClick={() => (window.location.href = '/capture')}
              className="text-xs text-accent-gold font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b3d20 transparent' }}>
            {/* Placeholder backlog cards — Stitch 05 */}
            <div
              className="min-w-[240px] flex items-center gap-3 p-3 rounded-lg cursor-grab transition-all hover:border-accent-gold/40 active:scale-95"
              style={{
                background: '#1E1E1E',
                border: '1px solid rgba(30,41,59,1)',
              }}
            >
              <span className="material-symbols-outlined text-sm" style={{ color: '#4b5563' }}>drag_indicator</span>
              <div>
                <p className="text-xs font-medium" style={{ color: '#e2e8f0' }}>Drag from capture</p>
                <span className="text-[9px]" style={{ color: '#64748b' }}>Backlog</span>
              </div>
            </div>
            {/* Add card */}
            <div
              onClick={() => (window.location.href = '/capture')}
              className="min-w-[240px] flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:text-accent-gold"
              style={{
                border: '2px dashed rgba(30,41,59,1)',
                color: '#4b5563',
              }}
            >
              <span className="material-symbols-outlined">add_circle</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer quote */}
      <footer className="relative z-10 py-10 px-6 border-t border-accent-gold/5">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="relative">
            <span
              className="material-symbols-outlined text-5xl absolute -top-6 -left-8 pointer-events-none"
              style={{ color: 'rgba(255,199,87,0.2)' }}
            >format_quote</span>
            <p className="text-lg md:text-xl font-medium italic leading-relaxed" style={{ color: '#94a3b8' }}>
              &ldquo;A 40-hour time-blocked work week, I estimate, produces the same amount of output as a 60-plus hour work week pursued without structure.&rdquo;
            </p>
            <footer className="mt-4 font-bold tracking-widest uppercase text-xs" style={{ color: '#ffc757' }}>
              — Cal Newport, Deep Work
            </footer>
          </blockquote>
        </div>
      </footer>

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
