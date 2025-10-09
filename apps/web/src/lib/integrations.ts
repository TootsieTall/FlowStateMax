/**
 * Integration Utilities
 * Helper functions for DND and Music service integrations
 */

/**
 * DND (Do Not Disturb) Integration
 * Currently browser-level, future: OS-level via native app
 */
export class DNDService {
  private static instance: DNDService
  private dndEnabled: boolean = false

  private constructor() {}

  static getInstance(): DNDService {
    if (!DNDService.instance) {
      DNDService.instance = new DNDService()
    }
    return DNDService.instance
  }

  /**
   * Enable Do Not Disturb mode
   * Current: Request browser notification permission
   * Future: Native app integration for system-level DND
   */
  async enable(): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window === 'undefined') {
        return { success: false, error: 'Not in browser environment' }
      }

      // Browser-level DND (notification permission)
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()

        if (permission === 'granted') {
          this.dndEnabled = true

          // Future: Send message to native app
          // if (window.nativeApp) {
          //   await window.nativeApp.enableDND()
          // }

          return { success: true }
        }

        return { success: false, error: 'Notification permission denied' }
      }

      return { success: false, error: 'Notifications not supported' }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Disable Do Not Disturb mode
   */
  async disable(): Promise<{ success: boolean; error?: string }> {
    try {
      this.dndEnabled = false

      // Future: Send message to native app
      // if (window.nativeApp) {
      //   await window.nativeApp.disableDND()
      // }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get current DND status
   */
  isEnabled(): boolean {
    return this.dndEnabled
  }
}

/**
 * Music Service Integration
 * Future: Spotify, Apple Music, YouTube Music
 */
export class MusicService {
  private static instance: MusicService
  private isPlaying: boolean = false
  private currentProvider: 'spotify' | 'apple' | 'youtube' | null = null

  private constructor() {}

  static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService()
    }
    return MusicService.instance
  }

  /**
   * Start focus music playlist
   * Future: Integrate with music service APIs
   */
  async start(provider: 'spotify' | 'apple' | 'youtube' = 'spotify'): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      // Placeholder implementation
      console.log(`[Music] Starting focus playlist on ${provider}`)

      // Future: Spotify SDK
      // if (provider === 'spotify' && window.Spotify) {
      //   const player = new window.Spotify.Player({
      //     name: 'FlowState Focus',
      //     getOAuthToken: cb => cb(token),
      //   })
      //   await player.connect()
      //   await player.play('spotify:playlist:37i9dQZF1DWZeKCadgRdKQ') // Deep Focus
      // }

      // Future: Apple Music
      // if (provider === 'apple' && window.MusicKit) {
      //   const music = window.MusicKit.getInstance()
      //   await music.setQueue({ playlist: 'focus-playlist-id' })
      //   await music.play()
      // }

      this.isPlaying = true
      this.currentProvider = provider

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Stop focus music
   */
  async stop(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[Music] Stopping focus playlist')

      // Future: Stop playback via SDK
      // if (window.Spotify?.player) {
      //   await window.Spotify.player.pause()
      // }

      this.isPlaying = false
      this.currentProvider = null

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get current playback status
   */
  getStatus(): { isPlaying: boolean; provider: string | null } {
    return {
      isPlaying: this.isPlaying,
      provider: this.currentProvider,
    }
  }
}

/**
 * Integration Manager
 * Coordinates all integration services
 */
export class IntegrationManager {
  private static instance: IntegrationManager
  private dnd: DNDService
  private music: MusicService

  private constructor() {
    this.dnd = DNDService.getInstance()
    this.music = MusicService.getInstance()
  }

  static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager()
    }
    return IntegrationManager.instance
  }

  /**
   * Enable all integrations for Flow session
   */
  async enableAll(): Promise<{
    dnd: { success: boolean; error?: string }
    music: { success: boolean; error?: string }
  }> {
    const dndResult = await this.dnd.enable()
    const musicResult = await this.music.start()

    return {
      dnd: dndResult,
      music: musicResult,
    }
  }

  /**
   * Disable all integrations
   */
  async disableAll(): Promise<{
    dnd: { success: boolean; error?: string }
    music: { success: boolean; error?: string }
  }> {
    const dndResult = await this.dnd.disable()
    const musicResult = await this.music.stop()

    return {
      dnd: dndResult,
      music: musicResult,
    }
  }

  /**
   * Get integration status
   */
  getStatus(): {
    dnd: boolean
    music: { isPlaying: boolean; provider: string | null }
  } {
    return {
      dnd: this.dnd.isEnabled(),
      music: this.music.getStatus(),
    }
  }
}

// Export singleton instances
export const dndService = DNDService.getInstance()
export const musicService = MusicService.getInstance()
export const integrationManager = IntegrationManager.getInstance()
