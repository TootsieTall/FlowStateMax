/**
 * Flow Session Client Utilities
 *
 * Client-side helpers for flow session management and orchestration.
 */

import { OrchestratorState } from '@flowstate/core'

export interface FlowSessionStatus {
  hasActiveSession: boolean
  sessionId?: string
  startTime?: string
  endTime?: string
  remainingMinutes?: number
  monochromeOn?: boolean
  appsBlocked?: boolean
  musicPlayed?: boolean
  locationId?: string | null
  orchestratorStatus?: string
  adapters?: OrchestratorState['adapters']
}

export interface StartSessionRequest {
  timeBlockId?: string
}

export interface StartSessionResponse {
  success: boolean
  sessionId: string
  startTime: Date
  endTime: Date
  duration: number
  monochromeEnabled: boolean
  appsBlocked: boolean
  timeBlockId?: string
  adapters: OrchestratorState['adapters']
}

export interface StopSessionRequest {
  sessionId: string
  feedback?: 'on_time' | 'needed_more' | 'finished_early'
}

export interface StopSessionResponse {
  success: boolean
  sessionId: string
  duration: number
  endTime: Date
}

export interface PauseSessionRequest {
  sessionId: string
}

export interface PauseSessionResponse {
  success: boolean
  sessionId: string
  status: 'paused'
}

export interface ResumeSessionRequest {
  sessionId: string
}

export interface ResumeSessionResponse {
  success: boolean
  sessionId: string
  status: 'active'
}

/**
 * Start a new flow session with full orchestration
 */
export async function startFlowSession(
  request: StartSessionRequest
): Promise<StartSessionResponse> {
  const response = await fetch('/api/sessions/flow/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to start flow session')
  }

  return response.json()
}

/**
 * Stop the active flow session
 */
export async function stopFlowSession(
  request: StopSessionRequest
): Promise<StopSessionResponse> {
  const response = await fetch('/api/sessions/flow/stop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to stop flow session')
  }

  return response.json()
}

/**
 * Pause the active flow session
 */
export async function pauseFlowSession(
  request: PauseSessionRequest
): Promise<PauseSessionResponse> {
  const response = await fetch('/api/sessions/flow/pause', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to pause flow session')
  }

  return response.json()
}

/**
 * Resume a paused flow session
 */
export async function resumeFlowSession(
  request: ResumeSessionRequest
): Promise<ResumeSessionResponse> {
  const response = await fetch('/api/sessions/flow/resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to resume flow session')
  }

  return response.json()
}

/**
 * Get current flow session status
 */
export async function getFlowSessionStatus(): Promise<FlowSessionStatus> {
  const response = await fetch('/api/sessions/flow/status', {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get flow session status')
  }

  return response.json()
}

/**
 * Format remaining time for display
 */
export function formatRemainingTime(minutes: number): string {
  if (minutes < 1) return 'Less than a minute'
  if (minutes === 1) return '1 minute'
  if (minutes < 60) return `${minutes} minutes`

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`
  }

  return `${hours}h ${mins}m`
}

/**
 * Get adapter status color for UI display
 */
export function getAdapterStatusColor(
  status: 'idle' | 'initializing' | 'active' | 'paused' | 'stopping' | 'error'
): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50'
    case 'paused':
      return 'text-yellow-600 bg-yellow-50'
    case 'error':
      return 'text-red-600 bg-red-50'
    case 'stopping':
    case 'initializing':
      return 'text-blue-600 bg-blue-50'
    case 'idle':
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

/**
 * Get adapter status icon for UI display
 */
export function getAdapterStatusIcon(
  status: 'idle' | 'initializing' | 'active' | 'paused' | 'stopping' | 'error'
): string {
  switch (status) {
    case 'active':
      return '✅'
    case 'paused':
      return '⏸️'
    case 'error':
      return '❌'
    case 'stopping':
      return '🛑'
    case 'initializing':
      return '⏳'
    case 'idle':
    default:
      return '⚪'
  }
}
