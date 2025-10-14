/**
 * Service Worker (Background Script)
 * Handles blocking logic, session management, and global grayscale control
 * Merged from main (session/API) and development (enhanced grayscale)
 */

import { storage } from '../shared/storage'
import { api } from '../shared/api'

// State - from main (session management)
let globalGrayscaleEnabled = false;
let grayscaleIntensity = 100;

// Service worker lifecycle
chrome.runtime.onInstalled.addListener(async () => {
  console.log('FlowState extension installed')

  // Initialize storage
  await storage.init()

  // Start session polling alarm (every 5 seconds)
  chrome.alarms.create('session_poll', { periodInMinutes: 1/12 }) // 5 seconds
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
  } else if (alarm.name === 'session_poll') {
    pollSessionStatus()
  }
})

// Handle new tabs to apply grayscale if globally enabled (from development)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && globalGrayscaleEnabled && tab.url) {
    // Wait a bit for content script to load
    setTimeout(async () => {
      try {
        await chrome.tabs.sendMessage(tabId, {
          type: 'ENABLE_GRAYSCALE',
          payload: { intensity: grayscaleIntensity }
        });
      } catch (error) {
        // Content script might not be ready yet, ignore
        console.log(`Could not apply grayscale to new tab ${tabId}:`, error);
      }
    }, 100);
  }
});

/**
 * Apply grayscale to all tabs (from development)
 */
async function applyGrayscaleToAllTabs(enabled: boolean, intensity: number = 100) {
  try {
    const tabs = await chrome.tabs.query({});
    
    for (const tab of tabs) {
      if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        try {
          if (enabled) {
            await chrome.tabs.sendMessage(tab.id, {
              type: 'ENABLE_GRAYSCALE',
              payload: { intensity }
            });
          } else {
            await chrome.tabs.sendMessage(tab.id, {
              type: 'DISABLE_GRAYSCALE'
            });
          }
        } catch (error) {
          // Tab might not have content script loaded yet, ignore
          console.log(`Could not apply grayscale to tab ${tab.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Failed to apply grayscale to all tabs:', error);
  }
}

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
    
    // Enhanced grayscale controls from development
    case 'ENABLE_GLOBAL_GRAYSCALE':
      globalGrayscaleEnabled = true;
      grayscaleIntensity = message.payload?.intensity || 100;
      await applyGrayscaleToAllTabs(true, grayscaleIntensity);
      return { success: true };

    case 'DISABLE_GLOBAL_GRAYSCALE':
      globalGrayscaleEnabled = false;
      await applyGrayscaleToAllTabs(false);
      return { success: true };

    case 'SET_GLOBAL_GRAYSCALE_INTENSITY':
      grayscaleIntensity = message.payload?.intensity || 100;
      if (globalGrayscaleEnabled) {
        await applyGrayscaleToAllTabs(true, grayscaleIntensity);
      }
      return { success: true };

    case 'TOGGLE_GLOBAL_GRAYSCALE':
      globalGrayscaleEnabled = !globalGrayscaleEnabled;
      await applyGrayscaleToAllTabs(globalGrayscaleEnabled, grayscaleIntensity);
      return { 
        success: true, 
        data: { 
          enabled: globalGrayscaleEnabled,
          intensity: grayscaleIntensity
        }
      };

    case 'GET_GLOBAL_GRAYSCALE_STATUS':
      return {
        success: true,
        data: {
          enabled: globalGrayscaleEnabled,
          intensity: grayscaleIntensity
        }
      };

    case 'LOG_BLOCK_BREAK':
      return await logBlockBreak(message.appName, message.url, message.timestamp)

    case 'FLOW_SESSION_START':
      // Triggered from web app when user starts flow session
      return await handleWebAppFlowStart(message.sessionId, message.duration)

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
      globalGrayscaleEnabled,
      grayscaleIntensity,
      session,
      success: true,
    }
  } catch (error) {
    console.error('Error getting session status:', error)
    return { sessionActive: false, monochromeEnabled: false, success: false }
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

async function logBlockBreak(appName: string, url: string | undefined, timestamp: string) {
  try {
    const auth = await storage.get('auth')
    if (!auth?.token) {
      return { error: 'Not authenticated' }
    }

    await api.logBlockBreak(appName, url || '', timestamp)
    return { success: true }
  } catch (error) {
    console.error('Error logging block break:', error)
    return { error: error.message }
  }
}

/**
 * Handle flow session start from web app
 * Auto-activates extension blocking and monochrome
 */
async function handleWebAppFlowStart(sessionId: string, duration: number) {
  try {
    console.log('[Extension] Flow session started from web app:', sessionId)
    
    // Create session object
    const now = new Date()
    const endTime = new Date(now.getTime() + duration * 60 * 1000)
    
    const session = {
      id: sessionId,
      startTime: now.toISOString(),
      endTime: endTime.toISOString(),
      duration,
    }
    
    // Store active session
    await storage.set('activeSession', session)
    
    // Enable global grayscale (monochrome mode)
    globalGrayscaleEnabled = true
    grayscaleIntensity = 100
    await applyGrayscaleToAllTabs(true, grayscaleIntensity)
    
    // Fetch and store blocked apps
    try {
      const auth = await storage.get('auth')
      if (auth?.token) {
        const blockedApps = await api.getBlockedApps()
        await storage.set('blockedApps', blockedApps.apps)
      }
    } catch (error) {
      console.error('[Extension] Error fetching blocked apps:', error)
    }
    
    // Set alarm to check session periodically
    chrome.alarms.create('session_check', { periodInMinutes: 1 })
    
    console.log('[Extension] Extension activated for flow session')
    
    return { 
      success: true, 
      message: 'Extension activated for flow session',
      grayscaleEnabled: true,
    }
  } catch (error) {
    console.error('[Extension] Error handling web app flow start:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Poll session status from API every 5 seconds
 * Updates local state based on server session
 */
async function pollSessionStatus() {
  try {
    const auth = await storage.get('auth')
    if (!auth?.token) {
      // Not authenticated, stop polling
      return
    }

    // Fetch current session status from API
    const status = await api.getSessionStatus()

    if (status.active) {
      // Update local session state
      await storage.set('activeSession', status.session)

      // Sync monochrome state
      if (status.monochromeEnabled !== globalGrayscaleEnabled) {
        globalGrayscaleEnabled = status.monochromeEnabled
        await applyGrayscaleToAllTabs(globalGrayscaleEnabled, grayscaleIntensity)
      }

      // Sync blocked apps
      if (status.appsBlocked) {
        const blockedApps = await api.getBlockedApps()
        await storage.set('blockedApps', blockedApps.apps)
      }
    } else {
      // No active session, clear local state
      const currentSession = await storage.get('activeSession')
      if (currentSession) {
        await storage.remove('activeSession')
        globalGrayscaleEnabled = false
        await applyGrayscaleToAllTabs(false)
      }
    }
  } catch (error) {
    console.error('Error polling session status:', error)
  }
}