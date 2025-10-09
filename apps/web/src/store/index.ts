/**
 * Zustand Store
 * Enhanced session state management with full integration support
 */

import { create } from 'zustand';
import { Session, Block, SessionStatus } from '@flowstate/core';

interface FlowSessionData {
  id: string;
  blockId: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  monochromeEnabled: boolean;
  appsBlocked: boolean;
  musicPlaying: boolean;
  dndEnabled: boolean;
}

interface AppState {
  // Current session state
  currentSession: FlowSessionData | null;
  isInFlow: boolean;
  monochromeEnabled: boolean;
  extensionConnected: boolean;
  sessionError: string | null;

  // UI state
  sidebarOpen: boolean;
  quickCaptureOpen: boolean;

  // Enhanced session actions
  startFlowSession: (blockId: string, duration: number) => Promise<{ success: boolean; error?: string }>;
  endFlowSession: (feedback?: string) => Promise<{ success: boolean; error?: string }>;
  pauseFlowSession: () => Promise<{ success: boolean; error?: string }>;
  resumeFlowSession: () => Promise<{ success: boolean; error?: string }>;

  // Integration actions
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
  sessionError: null,
  sidebarOpen: false,
  quickCaptureOpen: false,

  // Enhanced Flow Session Management
  startFlowSession: async (blockId: string, duration: number) => {
    try {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

      // 1. Create session in database
      const response = await fetch('/api/sessions/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockId,
          startTime: startTime.toISOString(),
          duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const session = await response.json();

      // 2. Enable Chrome extension features
      const state = get();
      if (state.extensionConnected && typeof window !== 'undefined' && 'chrome' in window) {
        const chromeAPI = (window as any).chrome;

        // Enable app blocking
        await chromeAPI.runtime.sendMessage({
          type: 'START_SESSION',
          blockId: session.id,
        });

        // Enable monochrome/grayscale
        await chromeAPI.runtime.sendMessage({
          type: 'ENABLE_GLOBAL_GRAYSCALE',
          payload: { intensity: 100 },
        });
      }

      // 3. Enable Do Not Disturb (browser notifications API)
      if (typeof window !== 'undefined' && 'Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            // Store DND state (actual DND would be OS-level via native app)
            console.log('DND mode conceptually enabled');
          }
        } catch (error) {
          console.warn('Could not enable DND:', error);
        }
      }

      // 4. Start music (would integrate with Spotify/Apple Music API)
      // Placeholder for music integration
      console.log('Music integration placeholder - would start focus playlist');

      // 5. Update local state
      set({
        currentSession: {
          id: session.id,
          blockId,
          duration,
          startTime,
          endTime,
          monochromeEnabled: true,
          appsBlocked: true,
          musicPlaying: true,
          dndEnabled: true,
        },
        isInFlow: true,
        monochromeEnabled: true,
        sessionError: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ sessionError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  endFlowSession: async (feedback?: string) => {
    try {
      const state = get();
      if (!state.currentSession) {
        return { success: false, error: 'No active session' };
      }

      const { id: sessionId } = state.currentSession;
      const endTime = new Date();

      // 1. Update session in database
      const response = await fetch('/api/sessions/flow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          endTime: endTime.toISOString(),
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to end session');
      }

      // 2. Disable Chrome extension features
      if (state.extensionConnected && typeof window !== 'undefined' && 'chrome' in window) {
        const chromeAPI = (window as any).chrome;

        // Disable app blocking
        await chromeAPI.runtime.sendMessage({
          type: 'END_SESSION',
          sessionId,
        });

        // Disable monochrome
        await chromeAPI.runtime.sendMessage({
          type: 'DISABLE_GLOBAL_GRAYSCALE',
        });
      }

      // 3. Disable DND
      console.log('DND mode conceptually disabled');

      // 4. Stop music
      console.log('Music integration placeholder - would stop focus playlist');

      // 5. Update local state
      set({
        currentSession: null,
        isInFlow: false,
        monochromeEnabled: false,
        sessionError: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ sessionError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  pauseFlowSession: async () => {
    try {
      const state = get();
      if (!state.currentSession) {
        return { success: false, error: 'No active session' };
      }

      // Disable integrations but keep session active
      if (state.extensionConnected && typeof window !== 'undefined' && 'chrome' in window) {
        const chromeAPI = (window as any).chrome;
        await chromeAPI.runtime.sendMessage({
          type: 'DISABLE_GLOBAL_GRAYSCALE',
        });
      }

      set({ monochromeEnabled: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  },

  resumeFlowSession: async () => {
    try {
      const state = get();
      if (!state.currentSession) {
        return { success: false, error: 'No active session' };
      }

      // Re-enable integrations
      if (state.extensionConnected && typeof window !== 'undefined' && 'chrome' in window) {
        const chromeAPI = (window as any).chrome;
        await chromeAPI.runtime.sendMessage({
          type: 'ENABLE_GLOBAL_GRAYSCALE',
          payload: { intensity: 100 },
        });
      }

      set({ monochromeEnabled: true });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
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
      // Check if extension is available (browser only)
      if (typeof window !== 'undefined' && 'chrome' in window) {
        const chromeAPI = (window as any).chrome;
        if (chromeAPI?.runtime?.id) {
          const response = await chromeAPI.runtime.sendMessage({ type: 'GET_SESSION_STATUS' });
          set({ extensionConnected: response.success });
          return response.success;
        }
      }
      return false;
    } catch (error) {
      set({ extensionConnected: false });
      return false;
    }
  },

  enableGlobalGrayscale: async (intensity = 100) => {
    try {
      if (typeof window !== 'undefined' && 'chrome' in window) {
        const chromeAPI = (window as any).chrome;
        if (chromeAPI?.runtime) {
          await chromeAPI.runtime.sendMessage({
            type: 'ENABLE_GLOBAL_GRAYSCALE',
            payload: { intensity }
          });
        }
      }
    } catch (error) {
      console.error('Failed to enable global grayscale:', error);
    }
  },

  disableGlobalGrayscale: async () => {
    try {
      if (typeof window !== 'undefined' && 'chrome' in window) {
        const chromeAPI = (window as any).chrome;
        if (chromeAPI?.runtime) {
          await chromeAPI.runtime.sendMessage({
            type: 'DISABLE_GLOBAL_GRAYSCALE'
          });
        }
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
