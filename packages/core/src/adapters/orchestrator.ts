/**
 * Flow Session Orchestrator
 *
 * Central coordinator for all flow session adapters.
 * Manages lifecycle, state synchronization, and error recovery.
 */

import {
  BaseAdapter,
  AdapterEvent,
  AdapterEventHandler,
  AdapterStatus,
} from './types'
import { TimerAdapterImpl } from './timer'
import { AppBlockingAdapterImpl } from './app-blocking'
import { MonochromeAdapterImpl } from './monochrome'
import { NotificationAdapterImpl } from './notifications'
import { MusicAdapterImpl } from './music'

export interface OrchestratorConfig {
  sessionId: string
  userId: string
  durationMinutes: number
  timeBlockId?: string
  blockedApps: Array<{ id: string; name: string; identifier: string }>
  enableMonochrome?: boolean
  enableMusic?: boolean
  musicProvider?: 'spotify' | 'apple' | 'youtube' | 'none'
  playlistId?: string
  enableDND?: boolean
}

export interface OrchestratorState {
  status: 'idle' | 'initializing' | 'active' | 'paused' | 'stopping' | 'error'
  sessionId?: string
  startTime?: Date
  endTime?: Date
  adapters: {
    timer: AdapterStatus
    appBlocking: AdapterStatus
    monochrome: AdapterStatus
    notifications: AdapterStatus
    music: AdapterStatus
  }
  error?: string
}

export class FlowSessionOrchestrator {
  private config: OrchestratorConfig
  private state: OrchestratorState

  // Adapters
  private timer: TimerAdapterImpl
  private appBlocking: AppBlockingAdapterImpl
  private monochrome: MonochromeAdapterImpl
  private notifications: NotificationAdapterImpl
  private music: MusicAdapterImpl

  // Event handlers
  private eventHandlers: AdapterEventHandler[] = []

  constructor(config: OrchestratorConfig) {
    this.config = config

    // Initialize state
    this.state = {
      status: 'idle',
      sessionId: config.sessionId,
      adapters: {
        timer: 'idle',
        appBlocking: 'idle',
        monochrome: 'idle',
        notifications: 'idle',
        music: 'idle',
      },
    }

    // Initialize adapters
    this.timer = new TimerAdapterImpl({
      enabled: true,
      durationMinutes: config.durationMinutes,
      warningThresholdMinutes: 5,
    })

    this.appBlocking = new AppBlockingAdapterImpl({
      enabled: config.blockedApps.length > 0,
      blockedApps: config.blockedApps,
    })

    this.monochrome = new MonochromeAdapterImpl({
      enabled: config.enableMonochrome !== false,
      intensity: 100,
    })

    this.notifications = new NotificationAdapterImpl({
      enabled: config.enableDND !== false,
      mode: 'dnd',
    })

    this.music = new MusicAdapterImpl({
      enabled: config.enableMusic === true,
      provider: config.musicProvider || 'none',
      playlistId: config.playlistId,
      autoStart: true,
      volume: 50,
      allowControls: true,
    })

    // Register event handlers
    this.registerEventHandlers()
  }

  /**
   * Initialize all adapters
   */
  async initialize(): Promise<void> {
    this.state.status = 'initializing'
    this.emitEvent({ type: 'initialized', adapter: 'orchestrator' })

    try {
      // Initialize all adapters in parallel
      await Promise.all([
        this.timer.initialize(this.timer.config),
        this.appBlocking.initialize(this.appBlocking.config),
        this.monochrome.initialize(this.monochrome.config),
        this.notifications.initialize(this.notifications.config),
        this.music.initialize(this.music.config),
      ])

      this.updateAdapterStates()
      this.state.status = 'idle'

      console.log('[FlowSessionOrchestrator] Initialized all adapters')
    } catch (error) {
      this.state.status = 'error'
      this.state.error = error instanceof Error ? error.message : 'Initialization failed'
      console.error('[FlowSessionOrchestrator] Initialization error:', error)
      throw error
    }
  }

  /**
   * Start flow session - activates all enabled adapters
   */
  async start(): Promise<void> {
    if (this.state.status === 'active') {
      throw new Error('Session already active')
    }

    this.state.status = 'initializing'
    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + this.config.durationMinutes * 60 * 1000)

    this.state.startTime = startTime
    this.state.endTime = endTime

    try {
      // Start adapters in sequence (some may depend on others)
      // 1. Timer (tracks session duration)
      await this.timer.start()
      this.emitEvent({ type: 'started', adapter: 'timer' })

      // 2. Monochrome (visual environment)
      await this.monochrome.start()
      this.emitEvent({ type: 'started', adapter: 'monochrome' })

      // 3. App Blocking (distractions)
      await this.appBlocking.start()
      this.emitEvent({ type: 'started', adapter: 'app-blocking' })

      // 4. Notifications (DND)
      await this.notifications.start()
      this.emitEvent({ type: 'started', adapter: 'notifications' })

      // 5. Music (optional, last to start)
      await this.music.start()
      this.emitEvent({ type: 'started', adapter: 'music' })

      this.updateAdapterStates()
      this.state.status = 'active'

      console.log('[FlowSessionOrchestrator] Session started successfully')
    } catch (error) {
      // Rollback on error
      console.error('[FlowSessionOrchestrator] Start error, rolling back:', error)
      await this.handleStartupError(error)
      throw error
    }
  }

  /**
   * Pause flow session - pauses adapters that support it
   */
  async pause(): Promise<void> {
    if (this.state.status !== 'active') {
      throw new Error('Cannot pause session that is not active')
    }

    this.state.status = 'paused'

    try {
      // Pause adapters that support it
      if (this.timer.pause) await this.timer.pause()
      if (this.music.pause) await this.music.pause()

      this.updateAdapterStates()
      this.emitEvent({ type: 'paused', adapter: 'orchestrator' })

      console.log('[FlowSessionOrchestrator] Session paused')
    } catch (error) {
      console.error('[FlowSessionOrchestrator] Pause error:', error)
      throw error
    }
  }

  /**
   * Resume flow session from paused state
   */
  async resume(): Promise<void> {
    if (this.state.status !== 'paused') {
      throw new Error('Cannot resume session that is not paused')
    }

    try {
      // Resume adapters
      if (this.timer.resume) await this.timer.resume()
      if (this.music.resume) await this.music.resume()

      this.updateAdapterStates()
      this.state.status = 'active'
      this.emitEvent({ type: 'resumed', adapter: 'orchestrator' })

      console.log('[FlowSessionOrchestrator] Session resumed')
    } catch (error) {
      console.error('[FlowSessionOrchestrator] Resume error:', error)
      throw error
    }
  }

  /**
   * Stop flow session - gracefully stops all adapters
   */
  async stop(): Promise<void> {
    if (this.state.status === 'idle') {
      console.log('[FlowSessionOrchestrator] Already stopped')
      return
    }

    this.state.status = 'stopping'

    try {
      // Stop adapters in reverse order (last started, first stopped)
      await this.music.stop()
      await this.notifications.stop()
      await this.appBlocking.stop()
      await this.monochrome.stop()
      await this.timer.stop()

      this.updateAdapterStates()
      this.state.status = 'idle'
      this.emitEvent({ type: 'stopped', adapter: 'orchestrator' })

      console.log('[FlowSessionOrchestrator] Session stopped successfully')
    } catch (error) {
      console.error('[FlowSessionOrchestrator] Stop error:', error)
      this.state.status = 'error'
      this.state.error = error instanceof Error ? error.message : 'Stop failed'
      throw error
    }
  }

  /**
   * Get current orchestrator state
   */
  getState(): OrchestratorState {
    return { ...this.state }
  }

  /**
   * Get remaining session time in minutes
   */
  getRemainingTime(): number {
    return this.timer.getRemainingTime()
  }

  /**
   * Register event handler
   */
  on(handler: AdapterEventHandler): void {
    this.eventHandlers.push(handler)
  }

  /**
   * Remove event handler
   */
  off(handler: AdapterEventHandler): void {
    this.eventHandlers = this.eventHandlers.filter(h => h !== handler)
  }

  /**
   * Health check - verifies all adapters are functioning
   */
  async healthCheck(): Promise<boolean> {
    const checks = await Promise.all([
      this.timer.healthCheck(),
      this.appBlocking.healthCheck(),
      this.monochrome.healthCheck(),
      this.notifications.healthCheck(),
      this.music.healthCheck(),
    ])

    return checks.every(check => check === true)
  }

  /**
   * Serialize state for persistence
   */
  serialize(): string {
    return JSON.stringify({
      config: this.config,
      state: this.state,
      adapterStates: {
        timer: this.timer.getStatus(),
        appBlocking: this.appBlocking.getStatus(),
        monochrome: this.monochrome.getStatus(),
        notifications: this.notifications.getStatus(),
        music: this.music.getStatus(),
      },
    })
  }

  /**
   * Deserialize and restore state
   */
  static async deserialize(data: string): Promise<FlowSessionOrchestrator> {
    const parsed = JSON.parse(data)
    const orchestrator = new FlowSessionOrchestrator(parsed.config)

    await orchestrator.initialize()

    // Restore state
    orchestrator.state = parsed.state

    // If session was active, resume it
    if (parsed.state.status === 'active') {
      await orchestrator.start()
    }

    return orchestrator
  }

  // Private methods

  private registerEventHandlers(): void {
    // Timer events
    this.timer.onWarning?.(() => {
      const remaining = this.timer.getRemainingTime()
      this.emitEvent({ type: 'timer:warning', remainingMinutes: remaining })
    })

    this.timer.onComplete?.(() => {
      this.emitEvent({ type: 'timer:complete' })
      this.stop() // Auto-stop session when timer completes
    })
  }

  private updateAdapterStates(): void {
    this.state.adapters = {
      timer: this.timer.getStatus().status,
      appBlocking: this.appBlocking.getStatus().status,
      monochrome: this.monochrome.getStatus().status,
      notifications: this.notifications.getStatus().status,
      music: this.music.getStatus().status,
    }
  }

  private emitEvent(event: AdapterEvent): void {
    this.eventHandlers.forEach(handler => {
      try {
        handler(event)
      } catch (error) {
        console.error('[FlowSessionOrchestrator] Event handler error:', error)
      }
    })
  }

  private async handleStartupError(error: unknown): Promise<void> {
    console.log('[FlowSessionOrchestrator] Performing graceful rollback')

    // Attempt to stop all adapters (ignore errors)
    await Promise.allSettled([
      this.timer.stop(),
      this.appBlocking.stop(),
      this.monochrome.stop(),
      this.notifications.stop(),
      this.music.stop(),
    ])

    this.state.status = 'error'
    this.state.error = error instanceof Error ? error.message : 'Startup failed'
    this.emitEvent({
      type: 'error',
      adapter: 'orchestrator',
      error: this.state.error,
    })
  }
}
