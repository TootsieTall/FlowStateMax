import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/sessions/current
 * Get current active session status
 * Polled every 5 seconds by StartFlowButton
 */
export async function GET(request: Request) {
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
      orderBy: {
        startTime: 'desc',
      },
    })

    if (!activeSession) {
      return NextResponse.json({
        hasActiveSession: false,
      })
    }

    // Calculate remaining time
    const now = new Date()
    const elapsed = now.getTime() - activeSession.startTime.getTime()
    const estimatedDuration = activeSession.duration || 60 // Default 60 minutes
    const estimatedEndTime = new Date(activeSession.startTime.getTime() + estimatedDuration * 60 * 1000)
    const remainingMs = estimatedEndTime.getTime() - now.getTime()
    const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (1000 * 60)))

    // Find associated time block
    const timeBlock = await prisma.timeBlock.findFirst({
      where: {
        userId: session.user.id,
        startTime: { lte: activeSession.startTime },
        endTime: { gte: activeSession.startTime },
        type: 'DEEP_WORK',
      },
    })

    return NextResponse.json({
      hasActiveSession: true,
      sessionId: activeSession.id,
      startTime: activeSession.startTime,
      endTime: estimatedEndTime,
      remainingMinutes: remainingMinutes,
      monochromeEnabled: activeSession.monochromeOn,
      appsBlocked: activeSession.appsBlocked,
      musicPlayed: activeSession.musicPlayed,
      timeBlockId: timeBlock?.id,
    })
  } catch (error) {
    console.error('Error fetching current session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

