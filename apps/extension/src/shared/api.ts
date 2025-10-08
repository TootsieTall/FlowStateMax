const API_URL = process.env.API_URL || 'http://localhost:3000'

class API {
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const storage = await chrome.storage.local.get('auth')
    const token = storage.auth?.token

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }

  async startSession(blockId: string) {
    return this.fetch('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({
        blockId,
        startTime: new Date().toISOString(),
      }),
    })
  }

  async endSession(sessionId: string) {
    return this.fetch('/api/sessions', {
      method: 'PATCH',
      body: JSON.stringify({
        sessionId,
        endTime: new Date().toISOString(),
      }),
    })
  }

  async getBlockedApps() {
    return this.fetch('/api/extension/blocked-apps')
  }

  async getSessionStatus() {
    return this.fetch('/api/extension/session-status')
  }

  async authenticate(token: string) {
    await chrome.storage.local.set({
      auth: { token },
    })
  }
}

export const api = new API()