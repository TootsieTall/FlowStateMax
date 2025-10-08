// User Types
export interface User {
  id: string
  email: string
  name?: string
  image?: string
  onboardingComplete: boolean
  goals: string[]
  podcastGenres: string[]
}

// Time Block Types
export type BlockType = 'DEEP_WORK' | 'MEETING' | 'BREAK' | 'GYM' | 'SHALLOW'

export interface TimeBlock {
  id: string
  userId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  type: BlockType
  color?: string
  completed: boolean
  taskId?: string
}

// Task Types
export type TaskImpact = 'HIGH' | 'LOW'

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  impact: TaskImpact
  deadline?: Date
  completed: boolean
  scheduledAt?: Date
}

// Flow Session Types
export interface FlowSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  duration?: number
  locationId?: string
  feedback?: 'on_time' | 'needed_more' | 'finished_early'
  monochromeOn: boolean
  appsBlocked: boolean
  musicPlayed: boolean
}

// Session Status Types (for runtime state management)
export type SessionStatus = 'active' | 'paused' | 'completed' | 'cancelled'

export interface Session {
  id: string
  userId: string
  blockId?: string
  startedAt: Date
  endedAt?: Date
  status: SessionStatus
  streakCount: number
  wallStrength: number
  ritualCompleted: boolean
  monochromeUsed: boolean
  realityCheck?: string
}

// Block type alias for backward compatibility
export type Block = TimeBlock

// Location Types
export interface FlowLocation {
  id: string
  userId: string
  name: string
  latitude: number
  longitude: number
  radius: number
  enabled: boolean
}

// Blocked App Types
export interface BlockedApp {
  id: string
  userId: string
  name: string
  identifier: string
  enabled: boolean
}

// Ritual Types
export interface RitualItem {
  id: string
  userId: string
  text: string
  order: number
  completed: boolean
}

// Daily Goal Types
export interface DailyGoal {
  id: string
  userId: string
  date: Date
  goals: string[]
  completed: boolean
}

// Shutdown Log Types
export interface ShutdownLog {
  id: string
  userId: string
  date: Date
  brainDump?: string
  tomorrowTop: string[]
  alarmsSet: string[]
  completed: boolean
}

// Extension Types
export interface ExtensionMessage {
  type: 'BLOCK_CHECK' | 'SESSION_STATUS' | 'MONOCHROME_TOGGLE' | 'FOCUS_START' | 'FOCUS_END'
  payload?: any
}

export interface ExtensionResponse {
  blocked: boolean
  appName?: string
  sessionActive?: boolean
  monochromeEnabled?: boolean
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}