interface StorageData {
  auth?: {
    token: string
    userId: string
  }
  activeSession?: any
  monochromeEnabled?: boolean
  blockedApps?: Array<{
    name: string
    domain: string
    enabled: boolean
  }>
}

export const storage = {
  async init() {
    const data = await chrome.storage.local.get(null)
    if (!data.blockedApps) {
      await this.set('blockedApps', [])
    }
    if (!data.monochromeEnabled) {
      await this.set('monochromeEnabled', false)
    }
  },

  async get<K extends keyof StorageData>(key: K): Promise<StorageData[K] | undefined> {
    const result = await chrome.storage.local.get(key)
    return result[key]
  },

  async set<K extends keyof StorageData>(key: K, value: StorageData[K]): Promise<void> {
    await chrome.storage.local.set({ [key]: value })
  },

  async remove(key: keyof StorageData): Promise<void> {
    await chrome.storage.local.remove(key)
  },

  async clear(): Promise<void> {
    await chrome.storage.local.clear()
  },
}