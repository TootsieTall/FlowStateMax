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
    <div className="min-h-screen bg-background-primary">
      {/* Navigation */}
      <nav className="bg-background-card border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-teal-500">FlowState</h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/week" className="text-teal-500 font-semibold border-b-2 border-teal-500 pb-1">
                Week
              </a>
              <a href="/today" className="text-gray-400 hover:text-teal-400 transition-colors">
                Today
              </a>
              <a href="/explore" className="text-gray-400 hover:text-teal-400 transition-colors">
                Explore
              </a>
              <a href="/settings" className="text-gray-400 hover:text-teal-400 transition-colors">
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
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors text-gray-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-200">
            {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
          </h2>
          <button
            onClick={nextWeek}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors text-gray-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => {
              const dayBlocks = getBlocksForDay(day)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toISOString()}
                  className={`bg-background-card rounded-lg border-2 p-4 min-h-[400px] ${
                    isToday ? 'border-teal-500' : 'border-gray-700'
                  }`}
                >
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 font-medium">{format(day, 'EEE')}</div>
                    <div
                      className={`text-2xl font-bold ${
                        isToday ? 'text-teal-500' : 'text-gray-200'
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
                    className="w-full mt-4 p-2 border-2 border-dashed border-gray-600 rounded-lg hover:border-teal-500 hover:bg-teal-500 hover:bg-opacity-10 transition-colors flex items-center justify-center text-gray-400 hover:text-teal-400"
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
        className="fixed bottom-8 right-8 bg-teal-600 hover:bg-teal-500 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        onClick={() => (window.location.href = '/capture')}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )
}