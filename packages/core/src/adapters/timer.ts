/**
 * Timer Adapter Implementation
 *
 * Manages session duration tracking with warning thresholds and completion events.
 */

import { TimerAdapter, TimerConfig, TimerState, AdapterStatus } from './types'

export class TimerAdapterImpl implements TimerAdapter {
  name = 'timer'
  config: TimerConfig
  state: TimerState

  private intervalId?: NodeJS.Timeout
  private warningCallbacks: Array<() => void> = []
  private completeCallbacks: Array<() => void> = []
  private hasWarned = false

  constructor(config?: TimerConfig) {
    this.config = config || {
      enabled: true,
      durationMinutes: 60,
      warningThresholdMinutes: 5,
    }
    this.state = {
      status: 'idle',
    }
  }

  async initialize(config: TimerConfig): Promise<void> {
    this.config = config
    this.state = {
      status: 'initializing',
    }

    // Validate configuration
    if (config.durationMinutes <= 0) {
      this.state = {
        status: 'error',
        error: 'Duration must be greater than 0',
      }
      throw new Error('Invalid timer duration')
    }

    this.state.status = 'idle'
  }

  async start(): Promise<void> {
    if (!this.config.enabled) {
      console.log('[TimerAdapter] Disabled, skipping start')
      return
    }

    const now = new Date()
    const endTime = new Date(now.getTime() + this.config.durationMinutes * 60 * 1000)

    this.state = {
      status: 'active',
      startTime: now,
      endTime: endTime,
      remainingMinutes: this.config.durationMinutes,
      isWarning: false,
    }

    this.hasWarned = false

    // Start timer interval (update every minute)
    this.intervalId = setInterval(() => {
      this.updateTimer()
    }, 60000) // 60 seconds

    console.log(`[TimerAdapter] Started - ${this.config.durationMinutes} minutes`)
  }

  private updateTimer(): void {
    if (!this.state.endTime) return

    const now = new Date()
    const remaining = Math.max(
      0,
      Math.ceil((this.state.endTime.getTime() - now.getTime()) / (60 * 1000))
    )

    this.state.remainingMinutes = remaining

    // Check for warning threshold
    const warningThreshold = this.config.warningThresholdMinutes || 5
    if (remaining <= warningThreshold && !this.hasWarned && remaining > 0) {
      this.state.isWarning = true
      this.hasWarned = true
      this.warningCallbacks.forEach(cb => cb())
      console.log(`[TimerAdapter] Warning: ${remaining} minutes remaining`)
    }

    // Check for completion
    if (remaining === 0) {
      this.handleCompletion()
    }
  }

  private handleCompletion(): void {
    console.log('[TimerAdapter] Session completed')
    this.completeCallbacks.forEach(cb => cb())
    this.stop()
  }

  async pause(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
    this.state.status = 'paused'
    console.log('[TimerAdapter] Paused')
  }

  async resume(): Promise<void> {
    if (this.state.status !== 'paused') {
      throw new Error('Cannot resume timer that is not paused')
    }

    this.state.status = 'active'

    // Restart interval
    this.intervalId = setInterval(() => {
      this.updateTimer()
    }, 60000)

    console.log('[TimerAdapter] Resumed')
  }

  async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }

    this.state = {
      status: 'idle',
    }

    this.warningCallbacks = []
    this.completeCallbacks = []
    this.hasWarned = false

    console.log('[TimerAdapter] Stopped')
  }

  getStatus(): TimerState {
    return { ...this.state }
  }

  async healthCheck(): Promise<boolean> {
    return this.state.status !== 'error'
  }

  getRemainingTime(): number {
    if (!this.state.endTime) return 0

    const now = new Date()
    return Math.max(
      0,
      Math.ceil((this.state.endTime.getTime() - now.getTime()) / (60 * 1000))
    )
  }

  onWarning(callback: () => void): void {
    this.warningCallbacks.push(callback)
  }

  onComplete(callback: () => void): void {
    this.completeCallbacks.push(callback)
  }
}
