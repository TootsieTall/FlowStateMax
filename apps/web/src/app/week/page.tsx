'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { BlockCard, Button } from '@flowstate/ui'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { StartFlowButton } from '@/components/StartFlowButton'

interface TimeBlock {
  id: string
  title: string
  startTime: Date
  endTime: Date
  type: string
  color: string | null
}

export default function WeekViewPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-dawn-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-border-light shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient-sunset">Daybreak</h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/week" className="text-sunset-500 font-semibold border-b-2 border-sunset-500 pb-1">
                Week
              </a>
              <a href="/today" className="text-bark-200 hover:text-sunset-500 transition-all duration-fast hover:-translate-y-0.5">
                Today
              </a>
              <a href="/explore" className="text-bark-200 hover:text-sunset-500 transition-all duration-fast hover:-translate-y-0.5">
                Explore
              </a>
              <a href="/settings" className="text-bark-200 hover:text-sunset-500 transition-all duration-fast hover:-translate-y-0.5">
                Settings
              </a>
              <StartFlowButton variant="icon" />
            </div>
          </div>
        </div>
      </nav>

      {/* Week View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousWeek}
            className="p-2 hover:bg-dawn-200 rounded-lg transition-all duration-fast text-bark-400 hover:text-sunset-500 hover:-translate-y-0.5 shadow-warm-sm hover:shadow-warm-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-h2 text-bark-500">
            {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
          </h2>
          <button
            onClick={nextWeek}
            className="p-2 hover:bg-dawn-200 rounded-lg transition-all duration-fast text-bark-400 hover:text-sunset-500 hover:-translate-y-0.5 shadow-warm-sm hover:shadow-warm-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-body text-bark-300">Loading your week...</p>
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
                    isToday ? 'border-2 border-sunset-400 shadow-glow-amber' : ''
                  }`}
                >
                  <div className="mb-4">
                    <div className="text-overline text-bark-200">{format(day, 'EEE')}</div>
                    <div
                      className={`text-h1 ${
                        isToday ? 'text-gradient-sunset' : 'text-bark-500'
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
                    className="w-full mt-4 p-2 border-2 border-dashed border-border-DEFAULT rounded-warm-lg hover:border-sunset-400 hover:bg-sunset-50 transition-all duration-fast flex items-center justify-center text-bark-200 hover:text-sunset-500 group"
                    onClick={() => {
                      // Handle adding new block
                    }}
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
        className="fixed bottom-8 right-8 bg-gradient-to-br from-sunset-400 to-gold-400 hover:from-sunset-500 hover:to-gold-500 text-white rounded-full p-4 shadow-warm-2xl hover:shadow-glow-sunset transition-all duration-fast hover:scale-110 animate-pulse-glow"
        onClick={() => (window.location.href = '/capture')}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )
}