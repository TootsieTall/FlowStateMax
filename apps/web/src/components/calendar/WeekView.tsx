'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, ZoomIn, ZoomOut, Calendar as CalendarIcon } from 'lucide-react'
import { TimeBlock, ViewMode, HOURS, DAYS_OF_WEEK, HOUR_HEIGHT } from './types'
import { DraggableTimeBlock } from './DraggableTimeBlock'
import {
  getWeekStart,
  getWeekDays,
  calculateBlockPositions,
  snapToInterval,
  createTimeFromDayAndPixels,
  getDayIndex,
} from './utils'
import { cn } from '@/lib/utils'
import { Button } from '@flowstate/ui'
import { StartFlowButton } from '../StartFlowButton'

interface WeekViewProps {
  blocks: TimeBlock[]
  onBlockMove?: (blockId: string, newStartTime: Date, newEndTime: Date) => void
  onBlockResize?: (blockId: string, newStartTime: Date, newEndTime: Date) => void
  onBlockClick?: (block: TimeBlock) => void
  onCreateBlock?: (startTime: Date, endTime: Date, dayIndex: number) => void
}

export function WeekView({
  blocks,
  onBlockMove,
  onBlockResize,
  onBlockClick,
  onCreateBlock,
}: WeekViewProps) {
  const [weekStart, setWeekStart] = useState(getWeekStart())
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [selectedDay, setSelectedDay] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [activeBlock, setActiveBlock] = useState<TimeBlock | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  )

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])
  const hourHeight = HOUR_HEIGHT * zoom
  const blockPositions = useMemo(() => calculateBlockPositions(blocks), [blocks])

  // Pinch-to-zoom gesture
  useEffect(() => {
    if (!gridRef.current) return

    let lastDistance = 0

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )

        if (lastDistance > 0) {
          const delta = distance - lastDistance
          setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta * 0.005)))
        }

        lastDistance = distance
      }
    }

    const handleTouchEnd = () => {
      lastDistance = 0
    }

    const element = gridRef.current
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd)

    return () => {
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || !active.data.current?.block) return

    const block = active.data.current.block as TimeBlock
    const overData = over.data.current

    if (overData?.type === 'day-column') {
      const dayIndex = overData.dayIndex
      const dropY = event.delta.y

      // Calculate new start time based on drop position
      const originalTop = event.activatorEvent.target as HTMLElement
      const rect = originalTop.getBoundingClientRect()
      const gridRect = gridRef.current?.getBoundingClientRect()

      if (gridRect) {
        const relativeY = rect.top - gridRect.top + dropY
        const newStartTime = createTimeFromDayAndPixels(weekStart, dayIndex, relativeY, hourHeight)
        const duration = block.endTime.getTime() - block.startTime.getTime()
        const newEndTime = new Date(newStartTime.getTime() + duration)

        onBlockMove?.(block.id, snapToInterval(newStartTime), snapToInterval(newEndTime))
      }
    }

    setActiveBlock(null)
  }

  const handleDayClick = (dayIndex: number, clickY: number) => {
    const gridRect = gridRef.current?.getBoundingClientRect()
    if (!gridRect || !onCreateBlock) return

    const relativeY = clickY - gridRect.top
    const startTime = createTimeFromDayAndPixels(weekStart, dayIndex, relativeY, hourHeight)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour default

    onCreateBlock(snapToInterval(startTime), snapToInterval(endTime), dayIndex)
  }

  const displayDays = viewMode === 'week' ? weekDays : [weekDays[selectedDay]]

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekStart(getWeekStart())}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <h2 className="text-lg font-semibold">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </h2>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
          </div>

          {/* Zoom controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.25))}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((prev) => Math.min(2, prev + 0.25))}
            disabled={zoom >= 2}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day selector for day view */}
      {viewMode === 'day' && (
        <div className="flex items-center gap-1 p-2 border-b dark:border-gray-700 overflow-x-auto">
          {weekDays.map((day, index) => (
            <Button
              key={index}
              variant={selectedDay === index ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedDay(index)}
              className="flex-shrink-0"
            >
              <div className="flex flex-col items-center">
                <span className="text-xs">{DAYS_OF_WEEK[index]}</span>
                <span className={cn(
                  'text-lg',
                  isSameDay(day, new Date()) && 'font-bold text-blue-600'
                )}>{format(day, 'd')}</span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto" ref={gridRef}>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={(e) => setActiveBlock(e.active.data.current?.block)}>
          <div className="relative min-h-full">
            {/* Time labels */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 z-10">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="relative text-xs text-gray-500 text-right pr-2"
                  style={{ height: hourHeight, lineHeight: `${hourHeight}px` }}
                >
                  {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="ml-16 relative" style={{ height: HOURS.length * hourHeight }}>
              {/* Day columns */}
              <div className="flex h-full">
                {displayDays.map((day, dayIndex) => (
                  <DayColumn
                    key={day.toISOString()}
                    date={day}
                    dayIndex={viewMode === 'week' ? dayIndex : selectedDay}
                    blocks={blocks.filter((b) => isSameDay(b.startTime, day))}
                    blockPositions={blockPositions}
                    hourHeight={hourHeight}
                    onClick={handleDayClick}
                    onBlockResize={onBlockResize}
                    onBlockClick={onBlockClick}
                  />
                ))}
              </div>

              {/* Current time indicator */}
              <CurrentTimeIndicator hourHeight={hourHeight} weekStart={weekStart} viewMode={viewMode} selectedDay={selectedDay} />
            </div>
          </div>

          {/* Drag overlay */}
          <DragOverlay>
            {activeBlock && (
              <div className="opacity-80">
                <DraggableTimeBlock
                  block={activeBlock}
                  hourHeight={hourHeight}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      
      {/* Floating Start Flow Button */}
      <StartFlowButton variant="floating" />
    </div>
  )
}

// Day Column Component
interface DayColumnProps {
  date: Date
  dayIndex: number
  blocks: TimeBlock[]
  blockPositions: Map<string, { width: number; left: number }>
  hourHeight: number
  onClick: (dayIndex: number, clickY: number) => void
  onBlockResize?: (blockId: string, newStartTime: Date, newEndTime: Date) => void
  onBlockClick?: (block: TimeBlock) => void
}

function DayColumn({ date, dayIndex, blocks, blockPositions, hourHeight, onClick, onBlockResize, onBlockClick }: DayColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `day-${dayIndex}`,
    data: { type: 'day-column', dayIndex },
  })

  const isToday = isSameDay(date, new Date())

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 relative border-r dark:border-gray-700 last:border-r-0',
        isToday && 'bg-blue-50/50 dark:bg-blue-900/10'
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        onClick(dayIndex, e.clientY - rect.top)
      }}
    >
      {/* Hour lines */}
      {HOURS.map((hour) => (
        <div
          key={hour}
          className="border-b border-gray-200 dark:border-gray-700"
          style={{ height: hourHeight }}
        />
      ))}

      {/* Blocks */}
      <AnimatePresence>
        {blocks.map((block) => {
          const position = blockPositions.get(block.id) || { width: 100, left: 0 }
          return (
            <DraggableTimeBlock
              key={block.id}
              block={block}
              hourHeight={hourHeight}
              width={position.width}
              left={position.left}
              onResize={onBlockResize}
              onClick={onBlockClick}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Current Time Indicator
function CurrentTimeIndicator({ hourHeight, weekStart, viewMode, selectedDay }: { hourHeight: number; weekStart: Date; viewMode: ViewMode; selectedDay: number }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const weekDays = getWeekDays(weekStart)
  const currentDayIndex = getDayIndex(now, weekStart)
  const shouldShow = viewMode === 'week'
    ? currentDayIndex >= 0 && currentDayIndex < 7
    : selectedDay === currentDayIndex

  if (!shouldShow) return null

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const top = (hours + minutes / 60) * hourHeight

  const dayWidth = viewMode === 'week' ? `${100 / 7}%` : '100%'
  const left = viewMode === 'week' ? `${(currentDayIndex / 7) * 100}%` : '0%'

  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      style={{ top, left, width: dayWidth }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-1.5 -top-1.5" />
        <div className="h-0.5 bg-red-500" />
      </div>
    </motion.div>
  )
}

// Droppable hook (inline implementation)
function useDroppable({ id, data }: { id: string; data: any }) {
  return {
    setNodeRef: (node: HTMLElement | null) => {
      // Implementation handled by DndContext
    },
  }
}
