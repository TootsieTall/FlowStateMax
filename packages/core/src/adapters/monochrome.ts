/**
 * Monochrome Adapter Implementation
 *
 * Manages grayscale/monochrome mode via Chrome extension.
 * Applies visual filtering to reduce distractions during flow sessions.
 */

import { MonochromeAdapter, MonochromeConfig, MonochromeState } from './types'

export class MonochromeAdapterImpl implements MonochromeAdapter {
  name = 'monochrome'
  config: MonochromeConfig
  state: MonochromeState

  private extensionConnected = false

  constructor(config?: MonochromeConfig) {
    this.config = config || {
      enabled: true,
      intensity: 100,
      extensionEndpoint: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    }
    this.state = {
      status: 'idle',
      monochromeActive: false,
      intensity: 100,
      extensionConnected: false,
    }
  }

  async initialize(config: MonochromeConfig): Promise<void> {
    this.config = config
    this.state = {
      status: 'initializing',
      monochromeActive: false,
      intensity: config.intensity || 100,
      extensionConnected: false,
    }

    // Verify extension connection
    const connected = await this.verifyExtension()
    this.state.extensionConnected = connected

    if (!connected) {
      console.warn('[MonochromeAdapter] Extension not connected - monochrome will be disabled')
    }

    this.state.status = 'idle'
  }

  async start(): Promise<void> {
    if (!this.config.enabled) {
      console.log('[MonochromeAdapter] Disabled, skipping start')
      return
    }

    this.state.status = 'active'

    try {
      // Enable monochrome via extension API
      await this.enableMonochrome()

      this.state.monochromeActive = true
      console.log(`[MonochromeAdapter] Started - intensity: ${this.config.intensity}%`)
    } catch (error) {
      this.state = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to start monochrome',
        monochromeActive: false,
        extensionConnected: this.extensionConnected,
      }
      throw error
    }
  }

  async stop(): Promise<void> {
    this.state.status = 'stopping'

    try {
      // Disable monochrome via extension API
      await this.disableMonochrome()

      this.state = {
        status: 'idle',
        monochromeActive: false,
        intensity: this.config.intensity,
        extensionConnected: this.extensionConnected,
      }

      console.log('[MonochromeAdapter] Stopped - color restored')
    } catch (error) {
      console.error('[MonochromeAdapter] Error stopping:', error)
      this.state = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to stop monochrome',
        monochromeActive: false,
        extensionConnected: this.extensionConnected,
      }
    }
  }

  getStatus(): MonochromeState {
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
      console.error('[MonochromeAdapter] Extension verification failed:', error)
      this.extensionConnected = false
      return false
    }
  }

  async setIntensity(intensity: number): Promise<void> {
    if (intensity < 0 || intensity > 100) {
      throw new Error('Intensity must be between 0 and 100')
    }

    this.config.intensity = intensity
    this.state.intensity = intensity

    // If currently active, update extension
    if (this.state.monochromeActive) {
      await this.enableMonochrome()
    }

    console.log(`[MonochromeAdapter] Intensity set to ${intensity}%`)
  }

  private async enableMonochrome(): Promise<void> {
    if (!this.extensionConnected) {
      console.log('[MonochromeAdapter] Extension not connected, skipping enable')
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
          action: 'enable_monochrome',
          intensity: this.config.intensity,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to enable monochrome')
      }

      console.log('[MonochromeAdapter] Monochrome enabled')
    } catch (error) {
      console.error('[MonochromeAdapter] Enable monochrome failed:', error)
      throw error
    }
  }

  private async disableMonochrome(): Promise<void> {
    if (!this.extensionConnected) {
      console.log('[MonochromeAdapter] Extension not connected, skipping disable')
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
          action: 'disable_monochrome',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to disable monochrome')
      }

      console.log('[MonochromeAdapter] Monochrome disabled')
    } catch (error) {
      console.error('[MonochromeAdapter] Disable monochrome failed:', error)
      throw error
    }
  }
}
