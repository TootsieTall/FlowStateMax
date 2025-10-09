/**
 * App Blocking Adapter Implementation
 *
 * Manages application blocking via Chrome extension.
 * Communicates with extension to enable/disable blocking of specified apps.
 */

import { AppBlockingAdapter, AppBlockingConfig, AppBlockingState } from './types'

export class AppBlockingAdapterImpl implements AppBlockingAdapter {
  name = 'app-blocking'
  config: AppBlockingConfig
  state: AppBlockingState

  private extensionConnected = false

  constructor(config?: AppBlockingConfig) {
    this.config = config || {
      enabled: true,
      blockedApps: [],
      extensionEndpoint: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    }
    this.state = {
      status: 'idle',
      blockedCount: 0,
      blockingActive: false,
      extensionConnected: false,
    }
  }

  async initialize(config: AppBlockingConfig): Promise<void> {
    this.config = config
    this.state = {
      status: 'initializing',
      blockedCount: config.blockedApps.length,
      blockingActive: false,
      extensionConnected: false,
    }

    // Verify extension connection
    const connected = await this.verifyExtension()
    this.state.extensionConnected = connected

    if (!connected) {
      console.warn('[AppBlockingAdapter] Extension not connected - blocking will be disabled')
    }

    this.state.status = 'idle'
  }

  async start(): Promise<void> {
    if (!this.config.enabled) {
      console.log('[AppBlockingAdapter] Disabled, skipping start')
      return
    }

    this.state.status = 'active'

    try {
      // Sync blocked apps to extension
      await this.syncBlockedApps()

      // Enable blocking via extension API
      await this.enableBlocking()

      this.state.blockingActive = true
      console.log(`[AppBlockingAdapter] Started - ${this.config.blockedApps.length} apps blocked`)
    } catch (error) {
      this.state = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to start app blocking',
        blockingActive: false,
        extensionConnected: this.extensionConnected,
      }
      throw error
    }
  }

  async stop(): Promise<void> {
    this.state.status = 'stopping'

    try {
      // Disable blocking via extension API
      await this.disableBlocking()

      this.state = {
        status: 'idle',
        blockedCount: this.config.blockedApps.length,
        blockingActive: false,
        extensionConnected: this.extensionConnected,
      }

      console.log('[AppBlockingAdapter] Stopped - apps unblocked')
    } catch (error) {
      console.error('[AppBlockingAdapter] Error stopping:', error)
      this.state = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to stop app blocking',
        blockingActive: false,
        extensionConnected: this.extensionConnected,
      }
    }
  }

  getStatus(): AppBlockingState {
    return { ...this.state }
  }

  async healthCheck(): Promise<boolean> {
    if (this.state.status === 'error') return false
    if (!this.config.enabled) return true

    // Check extension connection
    const connected = await this.verifyExtension()
    return connected
  }

  async verifyExtension(): Promise<boolean> {
    if (!this.config.enabled) return true

    try {
      // Try to communicate with extension via session status endpoint
      const response = await fetch(`${this.config.extensionEndpoint}/api/extension/session-status`, {
        method: 'GET',
        credentials: 'include',
      })

      this.extensionConnected = response.ok
      return response.ok
    } catch (error) {
      console.error('[AppBlockingAdapter] Extension verification failed:', error)
      this.extensionConnected = false
      return false
    }
  }

  async syncBlockedApps(): Promise<void> {
    if (!this.config.enabled || !this.extensionConnected) {
      console.log('[AppBlockingAdapter] Skipping sync - disabled or not connected')
      return
    }

    try {
      // Send blocked apps list to extension
      const response = await fetch(`${this.config.extensionEndpoint}/api/extension/blocked-apps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          apps: this.config.blockedApps,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to sync blocked apps with extension')
      }

      console.log('[AppBlockingAdapter] Synced blocked apps with extension')
    } catch (error) {
      console.error('[AppBlockingAdapter] Sync failed:', error)
      throw error
    }
  }

  private async enableBlocking(): Promise<void> {
    if (!this.extensionConnected) {
      console.log('[AppBlockingAdapter] Extension not connected, skipping enable')
      return
    }

    try {
      const response = await fetch(`${this.config.extensionEndpoint}/api/extension/session-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'enable_blocking',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to enable blocking')
      }

      console.log('[AppBlockingAdapter] Blocking enabled')
    } catch (error) {
      console.error('[AppBlockingAdapter] Enable blocking failed:', error)
      throw error
    }
  }

  private async disableBlocking(): Promise<void> {
    if (!this.extensionConnected) {
      console.log('[AppBlockingAdapter] Extension not connected, skipping disable')
      return
    }

    try {
      const response = await fetch(`${this.config.extensionEndpoint}/api/extension/session-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'disable_blocking',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to disable blocking')
      }

      console.log('[AppBlockingAdapter] Blocking disabled')
    } catch (error) {
      console.error('[AppBlockingAdapter] Disable blocking failed:', error)
      throw error
    }
  }
}
