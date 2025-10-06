import { storage } from '../shared/storage'
import { api } from '../shared/api'

// Service worker lifecycle
chrome.runtime.onInstalled.addListener(async () => {
  console.log('FlowState extension installed')
  
  // Initialize storage
  await storage.init()
})

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse)
  return true // Keep channel open for async response
})

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'session_check') {
    checkActiveSession()
  }
})

async function handleMessage(message: any, sender: chrome.runtime.MessageSender) {
  switch (message.type) {
    case 'CHECK_BLOCK':
      return await checkIfBlocked(message.url)
    
    case 'GET_SESSION_STATUS':
      return await getSessionStatus()
    
    case 'TOGGLE_MONOCHROME':
      return await toggleMonochrome(message.enabled)
    
    case 'START_SESSION':
      return await startSession(message.blockId)
    
    case 'END_SESSION':
      return await endSession(message.sessionId)
    
    default:
      return { error: 'Unknown message type' }
  }
}

async function checkIfBlocked(url: string): Promise<{ blocked: boolean; appName?: string }> {
  try {
    // Get session status
    const session = await storage.get('activeSession')
    if (!session) {
      return { blocked: false }
    }

    // Get blocked apps
    const blockedApps = await storage.get('blockedApps') || []
    
    // Check if URL matches blocked domain
    for (const app of blockedApps) {
      if (app.enabled && url.includes(app.domain)) {
        return { blocked: true, appName: app.name }
      }
    }

    return { blocked: false }
  } catch (error) {
    console.error('Error checking block:', error)
    return { blocked: false }
  }
}

async function getSessionStatus() {
  try {
    const session = await storage.get('activeSession')
    const monochromeEnabled = await storage.get('monochromeEnabled')
    
    return {
      sessionActive: !!session,
      monochromeEnabled: !!monochromeEnabled,
      session,
    }
  } catch (error) {
    console.error('Error getting session status:', error)
    return { sessionActive: false, monochromeEnabled: false }
  }
}

async function toggleMonochrome(enabled: boolean) {
  try {
    await storage.set('monochromeEnabled', enabled)
    
    // Update all tabs
    const tabs = await chrome.tabs.query({})
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_GRAYSCALE',
          enabled,
        })
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error toggling monochrome:', error)
    return { success: false, error: error.message }
  }
}

async function startSession(blockId: string) {
  try {
    const auth = await storage.get('auth')
    if (!auth?.token) {
      return { error: 'Not authenticated' }
    }

    // Call API to start session
    const session = await api.startSession(blockId)
    
    // Store active session
    await storage.set('activeSession', session)
    
    // Enable monochrome
    await toggleMonochrome(true)
    
    // Set alarm to check session periodically
    chrome.alarms.create('session_check', { periodInMinutes: 1 })
    
    return { success: true, session }
  } catch (error) {
    console.error('Error starting session:', error)
    return { error: error.message }
  }
}

async function endSession(sessionId: string) {
  try {
    const auth = await storage.get('auth')
    if (!auth?.token) {
      return { error: 'Not authenticated' }
    }

    // Call API to end session
    await api.endSession(sessionId)
    
    // Clear active session
    await storage.remove('activeSession')
    
    // Disable monochrome
    await toggleMonochrome(false)
    
    // Clear alarm
    chrome.alarms.clear('session_check')
    
    return { success: true }
  } catch (error) {
    console.error('Error ending session:', error)
    return { error: error.message }
  }
}

async function checkActiveSession() {
  try {
    const session = await storage.get('activeSession')
    if (!session) return

    // Check if session should have ended
    const endTime = new Date(session.endTime)
    if (endTime < new Date()) {
      // Session expired
      await endSession(session.id)
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Flow Session Complete',
        message: 'Your focus session has ended. Great work!',
      })
    }
  } catch (error) {
    console.error('Error checking session:', error)
  }
}