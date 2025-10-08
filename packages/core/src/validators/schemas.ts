import { z } from 'zod'

// Time Block Schema
export const timeBlockSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  type: z.enum(['DEEP_WORK', 'MEETING', 'BREAK', 'GYM', 'SHALLOW']),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  taskId: z.string().optional(),
})

// Task Schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  impact: z.enum(['HIGH', 'LOW']),
  deadline: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),
})

// Daily Goal Schema
export const dailyGoalSchema = z.object({
  date: z.coerce.date(),
  goals: z.array(z.string().min(1).max(200)).min(1).max(3),
})

// Flow Location Schema
export const flowLocationSchema = z.object({
  name: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(50).max(1000).default(100),
})

// Blocked App Schema
export const blockedAppSchema = z.object({
  name: z.string().min(1).max(100),
  identifier: z.string().min(1),
})

// Session Feedback Schema
export const sessionFeedbackSchema = z.object({
  sessionId: z.string(),
  feedback: z.enum(['on_time', 'needed_more', 'finished_early']),
  duration: z.number().min(1),
})

// Shutdown Log Schema
export const shutdownLogSchema = z.object({
  brainDump: z.string().max(5000).optional(),
  tomorrowTop: z.array(z.string().min(1).max(200)).min(1).max(3),
  alarmsSet: z.array(z.string().regex(/^\d{1,2}:\d{2}$/)),
})

// Quick Capture Schema
export const quickCaptureSchema = z.object({
  text: z.string().min(1).max(500),
  type: z.enum(['task', 'note', 'schedule']).default('task'),
})