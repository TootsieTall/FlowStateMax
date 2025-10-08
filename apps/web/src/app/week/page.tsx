'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { BlockCard, Button } from '@flowstate/ui'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">FlowState</h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/week" className="text-primary font-semibold border-b-2 border-primary pb-1">
                Week
              </a>
              <a href="/today" className="text-gray-600 hover:text-gray-900">
                Today
              </a>
              <a href="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </a>
              <a href="/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </a>
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
          </h2>
          <button
            onClick={nextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => {
              const dayBlocks = getBlocksForDay(day)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toISOString()}
                  className={`bg-white rounded-lg border-2 p-4 min-h-[400px] ${
                    isToday ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
                    <div
                      className={`text-2xl font-bold ${
                        isToday ? 'text-primary' : 'text-gray-900'
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
                    className="w-full mt-4 p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors flex items-center justify-center text-gray-500 hover:text-primary"
                    onClick={() => {
                      // Handle adding new block
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
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
        className="fixed bottom-8 right-8 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
        onClick={() => (window.location.href = '/capture')}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )
}