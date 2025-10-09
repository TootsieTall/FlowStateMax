import { BlockType } from '@prisma/client'

export interface TimeBlock {
  id: string
  userId: string
  title: string
  description?: string | null
  startTime: Date
  endTime: Date
  type: BlockType
  color?: string | null
  completed: boolean
  taskId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface DragData {
  blockId: string
  originalDay: number
  originalStartTime: Date
}

export interface DropResult {
  day: number
  startTime: Date
}

export type ViewMode = 'day' | 'week'

export const BLOCK_COLORS: Record<BlockType, string> = {
  DEEP_WORK: 'bg-blue-500 border-blue-600 text-white',
  MEETING: 'bg-gray-500 border-gray-600 text-white',
  BREAK: 'bg-green-500 border-green-600 text-white',
  GYM: 'bg-orange-500 border-orange-600 text-white',
  SHALLOW: 'bg-purple-500 border-purple-600 text-white',
}

export const BLOCK_HOVER_COLORS: Record<BlockType, string> = {
  DEEP_WORK: 'hover:bg-blue-600',
  MEETING: 'hover:bg-gray-600',
  BREAK: 'hover:bg-green-600',
  GYM: 'hover:bg-orange-600',
  SHALLOW: 'hover:bg-purple-600',
}

export const HOURS = Array.from({ length: 24 }, (_, i) => i)
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const HOUR_HEIGHT = 60 // pixels per hour
export const MIN_BLOCK_DURATION = 15 // minutes
