import { startOfWeek, addDays, format, differenceInMinutes, addMinutes, isSameDay } from 'date-fns'
import { TimeBlock } from './types'

/**
 * Get the start of the current week (Sunday)
 */
export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 0 })
}

/**
 * Get array of dates for the current week
 */
export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

/**
 * Calculate the top position of a time block based on start time
 */
export function getBlockTopPosition(startTime: Date, hourHeight: number): number {
  const hours = startTime.getHours()
  const minutes = startTime.getMinutes()
  return (hours + minutes / 60) * hourHeight
}

/**
 * Calculate the height of a time block based on duration
 */
export function getBlockHeight(startTime: Date, endTime: Date, hourHeight: number): number {
  const durationMinutes = differenceInMinutes(endTime, startTime)
  return (durationMinutes / 60) * hourHeight
}

/**
 * Convert pixel position to time
 */
export function pixelsToTime(pixels: number, hourHeight: number, baseDate: Date): Date {
  const totalMinutes = (pixels / hourHeight) * 60
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.floor(totalMinutes % 60)

  // Round to nearest 15 minutes
  const roundedMinutes = Math.round(minutes / 15) * 15

  const result = new Date(baseDate)
  result.setHours(hours, roundedMinutes, 0, 0)
  return result
}

/**
 * Snap time to 15-minute intervals
 */
export function snapToInterval(date: Date, intervalMinutes: number = 15): Date {
  const minutes = date.getMinutes()
  const roundedMinutes = Math.round(minutes / intervalMinutes) * intervalMinutes
  const result = new Date(date)
  result.setMinutes(roundedMinutes, 0, 0)
  return result
}

/**
 * Check if two time blocks overlap
 */
export function blocksOverlap(block1: TimeBlock, block2: TimeBlock): boolean {
  return (
    block1.id !== block2.id &&
    isSameDay(block1.startTime, block2.startTime) &&
    ((block1.startTime >= block2.startTime && block1.startTime < block2.endTime) ||
      (block1.endTime > block2.startTime && block1.endTime <= block2.endTime) ||
      (block1.startTime <= block2.startTime && block1.endTime >= block2.endTime))
  )
}

/**
 * Calculate block positions to avoid overlaps
 */
export function calculateBlockPositions(blocks: TimeBlock[]): Map<string, { width: number; left: number }> {
  const positions = new Map<string, { width: number; left: number }>()

  // Group blocks by day
  const blocksByDay = blocks.reduce((acc, block) => {
    const day = format(block.startTime, 'yyyy-MM-dd')
    if (!acc[day]) acc[day] = []
    acc[day].push(block)
    return acc
  }, {} as Record<string, TimeBlock[]>)

  // Calculate positions for each day
  Object.values(blocksByDay).forEach((dayBlocks) => {
    // Sort by start time
    const sorted = [...dayBlocks].sort((a, b) =>
      a.startTime.getTime() - b.startTime.getTime()
    )

    // Find overlapping groups
    const groups: TimeBlock[][] = []
    sorted.forEach((block) => {
      const overlappingGroup = groups.find((group) =>
        group.some((b) => blocksOverlap(block, b))
      )

      if (overlappingGroup) {
        overlappingGroup.push(block)
      } else {
        groups.push([block])
      }
    })

    // Assign positions within each group
    groups.forEach((group) => {
      const columns = group.length
      group.forEach((block, index) => {
        positions.set(block.id, {
          width: 100 / columns,
          left: (100 / columns) * index,
        })
      })
    })
  })

  return positions
}

/**
 * Format time for display (e.g., "9:00 AM")
 */
export function formatTime(date: Date): string {
  return format(date, 'h:mm a')
}

/**
 * Format duration (e.g., "1h 30m")
 */
export function formatDuration(startTime: Date, endTime: Date): string {
  const minutes = differenceInMinutes(endTime, startTime)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Get day index (0-6) from date
 */
export function getDayIndex(date: Date, weekStart: Date): number {
  return differenceInMinutes(date, weekStart) / (24 * 60)
}

/**
 * Create a new time based on day index and time
 */
export function createTimeFromDayAndPixels(
  weekStart: Date,
  dayIndex: number,
  pixels: number,
  hourHeight: number
): Date {
  const dayStart = addDays(weekStart, dayIndex)
  return pixelsToTime(pixels, hourHeight, dayStart)
}
