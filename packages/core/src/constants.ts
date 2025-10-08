// Block Types with Colors
export const BLOCK_TYPES = {
  DEEP_WORK: {
    label: 'Deep Work',
    color: '#1E3A8A',
    description: 'Focused, distraction-free work on cognitively demanding tasks',
  },
  MEETING: {
    label: 'Meeting',
    color: '#6B7280',
    description: 'Collaborative work, calls, and discussions',
  },
  BREAK: {
    label: 'Break',
    color: '#10B981',
    description: 'Rest and recovery',
  },
  GYM: {
    label: 'Gym/Exercise',
    color: '#F97316',
    description: 'Physical activity and workout',
  },
  SHALLOW: {
    label: 'Shallow Work',
    color: '#94A3B8',
    description: 'Administrative tasks and email',
  },
} as const

// Default Flow Locations Suggestions
export const DEFAULT_LOCATIONS = [
  'Home Office',
  'Local Library',
  'Coffee Shop',
  'Co-working Space',
  'University Library',
  'Park Bench',
  'Quiet Cafe',
]

// Common Apps to Block
export const SUGGESTED_BLOCKED_APPS = [
  { name: 'Instagram', identifier: 'com.instagram.android', iosBundleId: 'com.burbn.instagram' },
  { name: 'TikTok', identifier: 'com.zhiliaoapp.musically', iosBundleId: 'com.zhiliaoapp.musically' },
  { name: 'Twitter/X', identifier: 'com.twitter.android', iosBundleId: 'com.atebits.Tweetie2' },
  { name: 'Facebook', identifier: 'com.facebook.katana', iosBundleId: 'com.facebook.Facebook' },
  { name: 'YouTube', identifier: 'com.google.android.youtube', iosBundleId: 'com.google.ios.youtube' },
  { name: 'Reddit', identifier: 'com.reddit.frontpage', iosBundleId: 'com.reddit.Reddit' },
  { name: 'Snapchat', identifier: 'com.snapchat.android', iosBundleId: 'com.toyopagroup.picaboo' },
  { name: 'LinkedIn', identifier: 'com.linkedin.android', iosBundleId: 'com.linkedin.LinkedIn' },
]

// Default Ritual Checklist
export const DEFAULT_RITUAL = [
  'Make coffee ☕',
  'Clear desk 🗂️',
  'Start music 🎵',
  'Enable DND 📵',
  'Close email 📧',
  'Take 3 deep breaths 🧘',
]

// Podcast Genres
export const PODCAST_GENRES = [
  'Technology',
  'Business',
  'Science',
  'Health & Fitness',
  'Personal Development',
  'History',
  'True Crime',
  'Comedy',
  'Arts',
  'News & Politics',
  'Education',
  'Sports',
]

// Focus Area Options
export const FOCUS_AREAS = [
  'Career Growth',
  'Side Project',
  'School/Studies',
  'Research',
  'Creative Work',
  'Skill Development',
  'Health & Fitness',
  'Personal Projects',
]

// Time Estimates
export const TIME_ESTIMATES = {
  ONBOARDING: 5, // minutes
  DAILY_PLANNING: 10, // minutes
  WEEKLY_PLANNING: 30, // minutes
  SHUTDOWN_RITUAL: 15, // minutes
  MORNING_REVIEW: 3, // minutes
  MIN_FLOW_SESSION: 30, // minutes
  IDEAL_FLOW_SESSION: 90, // minutes
  MAX_FLOW_SESSION: 240, // minutes (4 hours)
}

// Ambient Sounds
export const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Rain', file: '/sounds/rain.mp3' },
  { id: 'cafe', name: 'Coffee Shop', file: '/sounds/cafe.mp3' },
  { id: 'white-noise', name: 'White Noise', file: '/sounds/white-noise.mp3' },
  { id: 'ocean', name: 'Ocean Waves', file: '/sounds/ocean.mp3' },
  { id: 'forest', name: 'Forest', file: '/sounds/forest.mp3' },
]

// Success Messages
export const SUCCESS_MESSAGES = {
  SESSION_COMPLETE: [
    'Amazing focus! 🎯',
    'Flow state achieved! 🌊',
    'Deep work complete! 💪',
    'You crushed it! 🔥',
    'Productivity unlocked! ⚡',
  ],
  SHUTDOWN_COMPLETE: [
    "You're done for the day! 🌙",
    'Work mode: OFF ✓',
    'Time to relax! 🎉',
    'Day successfully shut down! 🔒',
  ],
  GOAL_ACHIEVED: [
    'Goal crushed! 🎯',
    'Another win! ✓',
    'Keep the momentum! 🚀',
  ],
}

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Please sign in to continue',
  SESSION_NOT_FOUND: 'Session not found',
  BLOCK_NOT_FOUND: 'Time block not found',
  INVALID_INPUT: 'Invalid input provided',
  SERVER_ERROR: 'Something went wrong. Please try again.',
}