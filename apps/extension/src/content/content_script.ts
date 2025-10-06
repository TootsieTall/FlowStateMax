import { createBreathOverlay } from './breath_overlay'
import { applyGrayscaleFilter, removeGrayscaleFilter } from './grayscale_filter'

// Check if page should be blocked
checkBlocking()

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TOGGLE_GRAYSCALE') {
    if (message.enabled) {
      applyGrayscaleFilter()
    } else {
      removeGrayscaleFilter()
    }
  }
  sendResponse({ received: true })
})

async function checkBlocking() {
  try {
    // Ask background if this page should be blocked
    const response = await chrome.runtime.sendMessage({
      type: 'CHECK_BLOCK',
      url: window.location.href,
    })

    if (response.blocked) {
      // Show breath overlay
      showBreathOverlay(response.appName || 'this app')
    }

    // Check if monochrome should be enabled
    const status = await chrome.runtime.sendMessage({ type: 'GET_SESSION_STATUS' })
    if (status.monochromeEnabled) {
      applyGrayscaleFilter()
    }
  } catch (error) {
    console.error('Error checking blocking:', error)
  }
}

function showBreathOverlay(appName: string) {
  createBreathOverlay(appName, {
    onClose: () => {
      // User chose to go back
      window.history.back()
    },
    onContinue: () => {
      // User chose to continue anyway
      // Log this as a "break" in focus
      chrome.runtime.sendMessage({
        type: 'LOG_BLOCK_BREAK',
        appName,
        timestamp: new Date().toISOString(),
      })
    },
  })
}