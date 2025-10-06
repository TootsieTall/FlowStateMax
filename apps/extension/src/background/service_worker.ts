/**
 * Service Worker (Background Script)
 * Handles blocking logic and communication with web app
 * Enhanced for global grayscale control
 */

import { ExtensionMessage, SessionState } from '@flowstate/core';
import { getBlockedDomains, getSessionStatus, logIntervention } from '../shared/api';

// State
let blockedDomains: string[] = [];
let sessionState: SessionState = {
  isActive: false,
  isShutdownLocked: false,
  monochromeEnabled: false,
};
let globalGrayscaleEnabled = false;
let grayscaleIntensity = 100;

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('FlowState extension installed');
  syncWithWebApp();
});

// Sync with web app every 5 minutes
setInterval(syncWithWebApp, 5 * 60 * 1000);

/**
 * Sync blocked domains and session state from web app
 */
async function syncWithWebApp() {
  try {
    const [domains, session] = await Promise.all([
      getBlockedDomains(),
      getSessionStatus(),
    ]);

    blockedDomains = domains;
    sessionState = session;

    // Update badge
    updateBadge();

    console.log('Synced with web app', { blockedDomains, sessionState });
  } catch (error) {
    console.error('Failed to sync with web app:', error);
  }
}

/**
 * Update extension badge based on state
 */
function updateBadge() {
  if (sessionState.isActive) {
    chrome.action.setBadgeText({ text: '🎯' });
    chrome.action.setBadgeBackgroundColor({ color: '#1e3a8a' });
  } else if (sessionState.isShutdownLocked) {
    chrome.action.setBadgeText({ text: '🌙' });
    chrome.action.setBadgeBackgroundColor({ color: '#4c1d95' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

/**
 * Check if domain is blocked
 */
function isDomainBlocked(url: string): boolean {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return blockedDomains.some((blocked) => 
      domain === blocked.replace('www.', '') || 
      domain.endsWith('.' + blocked.replace('www.', ''))
    );
  } catch {
    return false;
  }
}

/**
 * Handle navigation to check for blocked sites
 */
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // Only main frame

  const isBlocked = isDomainBlocked(details.url);

  if (isBlocked && (sessionState.isActive || sessionState.isShutdownLocked)) {
    // Inject breath overlay
    chrome.tabs.sendMessage(details.tabId, {
      type: 'SHOW_BREATH_OVERLAY',
      payload: {
        url: details.url,
        reason: sessionState.isActive ? 'flow_session' : 'shutdown_lock',
      },
    });

    // Log intervention
    logIntervention(details.url);
  }
});

/**
 * Handle new tabs to apply grayscale if globally enabled
 */
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
 * Apply grayscale to all tabs
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

/**
 * Handle messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_SESSION_STATUS':
      sendResponse({ success: true, data: sessionState });
      break;

    case 'GET_BLOCKED_DOMAINS':
      sendResponse({ success: true, data: blockedDomains });
      break;

    case 'ENABLE_GLOBAL_GRAYSCALE':
      globalGrayscaleEnabled = true;
      grayscaleIntensity = message.payload?.intensity || 100;
      applyGrayscaleToAllTabs(true, grayscaleIntensity);
      sendResponse({ success: true });
      break;

    case 'DISABLE_GLOBAL_GRAYSCALE':
      globalGrayscaleEnabled = false;
      applyGrayscaleToAllTabs(false);
      sendResponse({ success: true });
      break;

    case 'SET_GLOBAL_GRAYSCALE_INTENSITY':
      grayscaleIntensity = message.payload?.intensity || 100;
      if (globalGrayscaleEnabled) {
        applyGrayscaleToAllTabs(true, grayscaleIntensity);
      }
      sendResponse({ success: true });
      break;

    case 'TOGGLE_GLOBAL_GRAYSCALE':
      globalGrayscaleEnabled = !globalGrayscaleEnabled;
      applyGrayscaleToAllTabs(globalGrayscaleEnabled, grayscaleIntensity);
      sendResponse({ 
        success: true, 
        data: { 
          enabled: globalGrayscaleEnabled,
          intensity: grayscaleIntensity
        }
      });
      break;

    case 'GET_GLOBAL_GRAYSCALE_STATUS':
      sendResponse({ 
        success: true, 
        data: { 
          enabled: globalGrayscaleEnabled,
          intensity: grayscaleIntensity
        }
      });
      break;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }

  return true; // Keep message channel open
});

// Initial sync
syncWithWebApp();
