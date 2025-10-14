import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/sessions/flow/[sessionId]
 * Get details of a specific flow session
 */
export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = params

    // Fetch the session
    const flowSession = await prisma.flowSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            ritualCompletionCount: true,
            locationConfirmationCount: true,
          },
        },
      },
    })

    if (!flowSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (flowSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user stats
    const userStats = await prisma.flowSession.aggregate({
      where: {
        userId: session.user.id,
        endTime: { not: null },
      },
      _count: {
        id: true,
      },
      _sum: {
        duration: true,
      },
    })

    return NextResponse.json({
      session: {
        id: flowSession.id,
        startTime: flowSession.startTime,
        endTime: flowSession.endTime,
        duration: flowSession.duration,
        originalDuration: flowSession.originalDuration,
        extendedDuration: flowSession.extendedDuration,
        feedback: flowSession.feedback,
        ritualCompleted: flowSession.ritualCompleted,
        locationConfirmed: flowSession.locationConfirmed,
        monochromeOn: flowSession.monochromeOn,
        appsBlocked: flowSession.appsBlocked,
        musicPlayed: flowSession.musicPlayed,
      },
      userStats: {
        ritualCompletionCount: flowSession.user.ritualCompletionCount,
        locationConfirmationCount: flowSession.user.locationConfirmationCount,
        totalSessions: userStats._count.id || 0,
        totalMinutes: userStats._sum.duration || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching session details:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
