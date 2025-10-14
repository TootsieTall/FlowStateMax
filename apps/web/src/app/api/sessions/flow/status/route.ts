import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/sessions/flow/status
 * Get current flow session status
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find active session
    const activeSession = await prisma.flowSession.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
      include: {
        user: {
          select: {
            ritualCompletionCount: true,
            locationConfirmationCount: true,
          },
        },
      },
    })

    if (!activeSession) {
      return NextResponse.json({
        hasActiveSession: false,
      })
    }

    // Calculate remaining time
    const now = new Date()
    const startTime = new Date(activeSession.startTime)
    const totalDuration = (activeSession.originalDuration || activeSession.duration || 60) + (activeSession.extendedDuration || 0)
    const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000)
    const remainingMs = endTime.getTime() - now.getTime()
    const remainingMinutes = Math.max(0, Math.floor(remainingMs / (1000 * 60)))

    // Find associated time block
    let timeBlock = null
    if (activeSession.duration) {
      // Look for time block that matches this session
      timeBlock = await prisma.timeBlock.findFirst({
        where: {
          userId: session.user.id,
          startTime: { lte: startTime },
          endTime: { gte: endTime },
        },
      })
    }

    return NextResponse.json({
      hasActiveSession: true,
      sessionId: activeSession.id,
      startTime: activeSession.startTime,
      endTime: endTime.toISOString(),
      remainingMinutes,
      timeBlockId: timeBlock?.id,
      originalDuration: activeSession.originalDuration,
      extendedDuration: activeSession.extendedDuration,
      ritualCompleted: activeSession.ritualCompleted,
      locationConfirmed: activeSession.locationConfirmed,
      monochromeOn: activeSession.monochromeOn,
      appsBlocked: activeSession.appsBlocked,
      musicPlayed: activeSession.musicPlayed,
    })
  } catch (error) {
    console.error('Error fetching session status:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}