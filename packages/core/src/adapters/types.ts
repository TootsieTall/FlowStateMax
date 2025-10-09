/**
 * Adapter Types for Flow Session Orchestration
 *
 * Defines interfaces for all adapters that coordinate the flow session experience.
 * Each adapter is responsible for a specific aspect of the focus environment.
 */

export type AdapterStatus = 'idle' | 'initializing' | 'active' | 'paused' | 'stopping' | 'error'

export interface AdapterConfig {
  enabled: boolean
  [key: string]: any
}

export interface AdapterState {
  status: AdapterStatus
  error?: string
  metadata?: Record<string, any>
}

/**
 * Base Adapter Interface
 * All adapters must implement this interface
 */
export interface BaseAdapter<TConfig extends AdapterConfig = AdapterConfig> {
  name: string
  config: TConfig
  state: AdapterState

  /**
   * Initialize the adapter with configuration
   */
  initialize(config: TConfig): Promise<void>

  /**
   * Start the adapter's functionality
   */
  start(): Promise<void>

  /**
   * Pause the adapter (if supported)
   */
  pause?(): Promise<void>

  /**
   * Resume the adapter from paused state
   */
  resume?(): Promise<void>

  /**
   * Stop and cleanup the adapter
   */
  stop(): Promise<void>

  /**
   * Get current adapter status
   */
  getStatus(): AdapterState

  /**
   * Health check - returns true if adapter is functioning correctly
   */
  healthCheck(): Promise<boolean>
}

/**
 * Timer Adapter - Manages session duration tracking
 */
export interface TimerConfig extends AdapterConfig {
  durationMinutes: number
  warningThresholdMinutes?: number
}

export interface TimerState extends AdapterState {
  startTime?: Date
  endTime?: Date
  remainingMinutes?: number
  isWarning?: boolean
}

export interface TimerAdapter extends BaseAdapter<TimerConfig> {
  getRemainingTime(): number
  onWarning?(callback: () => void): void
  onComplete?(callback: () => void): void
}

/**
 * App Blocking Adapter - Manages application blocking via Chrome extension
 */
export interface AppBlockingConfig extends AdapterConfig {
  blockedApps: Array<{
    id: string
    name: string
    identifier: string
  }>
  extensionEndpoint?: string
}

export interface AppBlockingState extends AdapterState {
  blockedCount?: number
  blockingActive?: boolean
  extensionConnected?: boolean
}

export interface AppBlockingAdapter extends BaseAdapter<AppBlockingConfig> {
  verifyExtension(): Promise<boolean>
  syncBlockedApps(): Promise<void>
}

/**
 * Monochrome Adapter - Manages grayscale mode via Chrome extension
 */
export interface MonochromeConfig extends AdapterConfig {
  intensity?: number // 0-100, default 100 (full grayscale)
  extensionEndpoint?: string
}

export interface MonochromeState extends AdapterState {
  monochromeActive?: boolean
  intensity?: number
  extensionConnected?: boolean
}

export interface MonochromeAdapter extends BaseAdapter<MonochromeConfig> {
  verifyExtension(): Promise<boolean>
  setIntensity(intensity: number): Promise<void>
}

/**
 * Notification Adapter - Manages Do Not Disturb mode
 */
export interface NotificationConfig extends AdapterConfig {
  mode: 'dnd' | 'priority' | 'silent'
  allowedContacts?: string[]
}

export interface NotificationState extends AdapterState {
  dndActive?: boolean
  mode?: string
  systemSupported?: boolean
}

export interface NotificationAdapter extends BaseAdapter<NotificationConfig> {
  checkSystemSupport(): Promise<boolean>
}

/**
 * Music Adapter - Manages music streaming integration
 */
export type MusicProvider = 'spotify' | 'apple' | 'youtube' | 'none'

export interface MusicConfig extends AdapterConfig {
  provider: MusicProvider
  playlistId?: string
  autoStart?: boolean
  volume?: number // 0-100
  allowControls?: boolean // Allow play/pause/skip during session
}

export interface MusicState extends AdapterState {
  provider?: MusicProvider
  isPlaying?: boolean
  currentTrack?: {
    id: string
    title: string
    artist: string
    duration: number
  }
  playlistId?: string
  authenticated?: boolean
}

export interface MusicAdapter extends BaseAdapter<MusicConfig> {
  authenticate(): Promise<boolean>
  loadPlaylist(playlistId: string): Promise<void>
  play(): Promise<void>
  pause(): Promise<void>
  skip(): Promise<void>
  setVolume(volume: number): Promise<void>
  getCurrentTrack(): Promise<MusicState['currentTrack']>
}

/**
 * Adapter Event Types
 */
export type AdapterEvent =
  | { type: 'initialized'; adapter: string }
  | { type: 'started'; adapter: string }
  | { type: 'paused'; adapter: string }
  | { type: 'resumed'; adapter: string }
  | { type: 'stopped'; adapter: string }
  | { type: 'error'; adapter: string; error: string }
  | { type: 'timer:warning'; remainingMinutes: number }
  | { type: 'timer:complete' }
  | { type: 'music:track_changed'; track: MusicState['currentTrack'] }

export type AdapterEventHandler = (event: AdapterEvent) => void
