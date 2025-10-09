import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OnboardingStep {
  id: string
  title: string
  required: boolean
  completed: boolean
}

export interface FlowLocation {
  name: string
  latitude: number
  longitude: number
  radius: number
}

export interface RitualItem {
  text: string
  order: number
}

export interface BlockedApp {
  name: string
  domain: string
  category: string
  enabled: boolean
}

export interface MusicPreferences {
  service: 'spotify' | 'apple-music' | 'youtube-music' | 'none' | null
  genres: string[]
}

interface OnboardingState {
  // Current state
  currentStep: number
  direction: number // For animation direction
  steps: OnboardingStep[]

  // Data
  goals: string[]
  locations: FlowLocation[]
  ritualItems: RitualItem[]
  blockedApps: BlockedApp[]
  musicPreferences: MusicPreferences | null
  podcastGenres: string[]

  // Progress
  isComplete: boolean

  // Actions
  nextStep: () => void
  prevStep: () => void
  skipStep: () => void
  goToStep: (step: number) => void

  // Data setters
  setGoals: (goals: string[]) => void
  setLocations: (locations: FlowLocation[]) => void
  setRitualItems: (items: RitualItem[]) => void
  setBlockedApps: (apps: BlockedApp[]) => void
  setMusicPreferences: (prefs: MusicPreferences | null) => void
  setPodcastGenres: (genres: string[]) => void

  // Completion
  setComplete: (complete: boolean) => void

  // Validation
  canContinue: () => boolean
  canSkip: () => boolean
  validateStep: (step: number) => boolean
  getProgress: () => { completed: number; total: number; percent: number }

  // Reset
  reset: () => void
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    required: false,
    completed: false,
  },
  {
    id: 'goals',
    title: 'Focus Areas',
    required: true,
    completed: false,
  },
  {
    id: 'locations',
    title: 'Flow Locations',
    required: true,
    completed: false,
  },
  {
    id: 'ritual',
    title: 'Shutdown Ritual',
    required: true,
    completed: false,
  },
  {
    id: 'blocked-apps',
    title: 'Blocked Apps',
    required: false,
    completed: false,
  },
  {
    id: 'music',
    title: 'Music',
    required: false,
    completed: false,
  },
  {
    id: 'podcasts',
    title: 'Podcasts',
    required: false,
    completed: false,
  },
  {
    id: 'ready',
    title: 'Ready',
    required: false,
    completed: false,
  },
]

const initialState = {
  currentStep: 0,
  direction: 1,
  steps: ONBOARDING_STEPS,
  goals: [],
  locations: [],
  ritualItems: [],
  blockedApps: [],
  musicPreferences: null,
  podcastGenres: [],
  isComplete: false,
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      nextStep: () => {
        const { currentStep, steps, validateStep } = get()

        // Validate current step before proceeding
        if (!validateStep(currentStep)) {
          return
        }

        // Mark current step as completed
        const updatedSteps = [...steps]
        updatedSteps[currentStep].completed = true

        if (currentStep < steps.length - 1) {
          set({
            currentStep: currentStep + 1,
            direction: 1,
            steps: updatedSteps,
          })
        } else {
          // Last step completed
          set({
            isComplete: true,
            steps: updatedSteps,
          })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 0) {
          set({
            currentStep: currentStep - 1,
            direction: -1,
          })
        }
      },

      skipStep: () => {
        const { currentStep, steps, canSkip } = get()

        if (!canSkip()) {
          return
        }

        // Mark as completed (skipped)
        const updatedSteps = [...steps]
        updatedSteps[currentStep].completed = true

        if (currentStep < steps.length - 1) {
          set({
            currentStep: currentStep + 1,
            direction: 1,
            steps: updatedSteps,
          })
        }
      },

      goToStep: (step: number) => {
        const { steps } = get()
        if (step >= 0 && step < steps.length) {
          set({
            currentStep: step,
            direction: step > get().currentStep ? 1 : -1,
          })
        }
      },

      setGoals: (goals: string[]) => {
        set({ goals })
      },

      setLocations: (locations: FlowLocation[]) => {
        set({ locations })
      },

      setRitualItems: (items: RitualItem[]) => {
        set({ ritualItems: items })
      },

      setBlockedApps: (apps: BlockedApp[]) => {
        set({ blockedApps: apps })
      },

      setMusicPreferences: (prefs: MusicPreferences | null) => {
        set({ musicPreferences: prefs })
      },

      setPodcastGenres: (genres: string[]) => {
        set({ podcastGenres: genres })
      },

      setComplete: (complete: boolean) => {
        set({ isComplete: complete })
      },

      canContinue: () => {
        const { currentStep, validateStep } = get()
        return validateStep(currentStep)
      },

      canSkip: () => {
        const { currentStep, steps } = get()
        return !steps[currentStep].required
      },

      validateStep: (step: number) => {
        const state = get()

        switch (step) {
          case 0: // Welcome
            return true

          case 1: // Goals
            return state.goals.length >= 1 && state.goals.length <= 5

          case 2: // Locations
            return state.locations.length >= 1

          case 3: // Ritual
            return state.ritualItems.length >= 1

          case 4: // Blocked Apps (optional)
            return true

          case 5: // Music (optional)
            return true

          case 6: // Podcasts (optional)
            return true

          case 7: // Ready
            return true

          default:
            return false
        }
      },

      getProgress: () => {
        const { steps } = get()
        const completed = steps.filter((s) => s.completed).length
        const total = steps.length
        const percent = Math.round((completed / total) * 100)

        return { completed, total, percent }
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        // Only persist essential data
        currentStep: state.currentStep,
        goals: state.goals,
        locations: state.locations,
        ritualItems: state.ritualItems,
        blockedApps: state.blockedApps,
        musicPreferences: state.musicPreferences,
        podcastGenres: state.podcastGenres,
        steps: state.steps,
        isComplete: state.isComplete,
      }),
    }
  )
)
