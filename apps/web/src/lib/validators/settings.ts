import { z } from 'zod'

// Location validation
export const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(100, 'Location name too long'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(10).max(5000), // meters
  enabled: z.boolean().optional()
})

export type LocationInput = z.infer<typeof locationSchema>

// Blocked app validation
export const blockedAppSchema = z.object({
  name: z.string().min(1, 'App name is required').max(100, 'App name too long'),
  identifier: z.string().min(1, 'App identifier is required'),
  domain: z.string().optional(),
  category: z.string().optional(),
  enabled: z.boolean().optional()
})

export type BlockedAppInput = z.infer<typeof blockedAppSchema>

// Ritual item validation
export const ritualItemSchema = z.object({
  text: z.string().min(1, 'Ritual text is required').max(200, 'Ritual text too long')
})

export type RitualItemInput = z.infer<typeof ritualItemSchema>

// Ritual reorder validation
export const ritualReorderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    order: z.number().int().nonnegative()
  }))
})

export type RitualReorderInput = z.infer<typeof ritualReorderSchema>

// Notification preferences validation
export const notificationPreferencesSchema = z.object({
  locationAlerts: z.boolean(),
  sessionAlerts: z.boolean(),
  integrationSync: z.boolean(),
  dailyPrompts: z.boolean(),
  streakTracking: z.boolean()
})

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>

// Profile update validation
export const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  image: z.string().url('Invalid image URL').optional()
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

// Integration provider validation
export const integrationProviderSchema = z.enum([
  'google_calendar',
  'gmail',
  'canvas',
  'spotify',
  'apple_music'
])

export type IntegrationProvider = z.infer<typeof integrationProviderSchema>

// Canvas LMS API key validation
export const canvasApiKeySchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  institutionUrl: z.string().url('Invalid institution URL')
})

export type CanvasApiKeyInput = z.infer<typeof canvasApiKeySchema>
