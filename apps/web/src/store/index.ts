/**
 * Zustand Store
 * In-memory state management for the app
 */

import { create } from 'zustand';
import { Session, Block, SessionStatus } from '@flowstate/core';

interface AppState {
  // Current session state
  currentSession: Session | null;
  isInFlow: boolean;
  monochromeEnabled: boolean;
  extensionConnected: boolean;
  
  // UI state
  sidebarOpen: boolean;
  quickCaptureOpen: boolean;
  
  // Actions
  startSession: (blockId?: string) => void;
  endSession: (realityCheck?: string) => void;
  setMonochrome: (enabled: boolean) => void;
  toggleSidebar: () => void;
  toggleQuickCapture: () => void;
  checkExtensionConnection: () => Promise<boolean>;
  enableGlobalGrayscale: (intensity?: number) => Promise<void>;
  disableGlobalGrayscale: () => Promise<void>;
  
  // Reset
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentSession: null,
  isInFlow: false,
  monochromeEnabled: false,
  extensionConnected: false,
  sidebarOpen: false,
  quickCaptureOpen: false,

  // Actions
  startSession: (blockId) => {
    const session: Session = {
      id: `session-${Date.now()}`,
      userId: '',
      blockId,
      startedAt: new Date(),
      status: 'active',
      streakCount: 0,
      wallStrength: 0,
      ritualCompleted: false,
      monochromeUsed: false,
    };

    set({
      currentSession: session,
      isInFlow: true,
    });
  },

  endSession: (realityCheck) => {
    set((state) => {
      if (!state.currentSession) return state;

      return {
        currentSession: {
          ...state.currentSession,
          endedAt: new Date(),
          status: 'completed' as SessionStatus,
          realityCheck: realityCheck as any,
        },
        isInFlow: false,
        monochromeEnabled: false,
      };
    });
  },

  setMonochrome: (enabled) => {
    set({ monochromeEnabled: enabled });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  toggleQuickCapture: () => {
    set((state) => ({ quickCaptureOpen: !state.quickCaptureOpen }));
  },

  checkExtensionConnection: async () => {
    try {
      // Check if extension is available
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        const response = await chrome.runtime.sendMessage({ type: 'GET_SESSION_STATUS' });
        set({ extensionConnected: response.success });
        return response.success;
      }
      return false;
    } catch (error) {
      set({ extensionConnected: false });
      return false;
    }
  },

  enableGlobalGrayscale: async (intensity = 100) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        await chrome.runtime.sendMessage({
          type: 'ENABLE_GLOBAL_GRAYSCALE',
          payload: { intensity }
        });
      }
    } catch (error) {
      console.error('Failed to enable global grayscale:', error);
    }
  },

  disableGlobalGrayscale: async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        await chrome.runtime.sendMessage({
          type: 'DISABLE_GLOBAL_GRAYSCALE'
        });
      }
    } catch (error) {
      console.error('Failed to disable global grayscale:', error);
    }
  },

  reset: () => {
    set({
      currentSession: null,
      isInFlow: false,
      monochromeEnabled: false,
      extensionConnected: false,
      sidebarOpen: false,
      quickCaptureOpen: false,
    });
  },
}));
