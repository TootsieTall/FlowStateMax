import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notificationPreferencesSchema } from '@/lib/validators/settings'

/**
 * GET /api/settings/notifications
 * Get notification preferences
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prefs = await prisma.notificationPreferences.findUnique({
      where: { userId: session.user.id }
    })

    // Return default preferences if none exist
    if (!prefs) {
      return NextResponse.json({
        data: {
          locationAlerts: true,
          sessionAlerts: true,
          integrationSync: true,
          dailyPrompts: true,
          streakTracking: true
        }
      })
    }

    return NextResponse.json({ data: prefs })
  } catch (error) {
    console.error('Notification prefs GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/settings/notifications
 * Update notification preferences
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = notificationPreferencesSchema.partial().safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const updated = await prisma.notificationPreferences.upsert({
      where: { userId: session.user.id },
      update: validation.data,
      create: {
        userId: session.user.id,
        ...validation.data
      }
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Notification preferences updated successfully'
    })
  } catch (error) {
    console.error('Notification prefs PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
