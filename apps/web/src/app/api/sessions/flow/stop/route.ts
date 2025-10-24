import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/sessions/flow/stop
 * Stop the current flow session with feedback
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, feedback } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    if (!feedback || !['on_time', 'needed_more', 'finished_early'].includes(feedback)) {
      return NextResponse.json(
        { error: 'Valid feedback required (on_time, needed_more, finished_early)' },
        { status: 400 }
      )
    }

    // Find the session
    const flowSession = await prisma.flowSession.findUnique({
      where: { id: sessionId },
    })

    if (!flowSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (flowSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (flowSession.endTime) {
      return NextResponse.json(
        { error: 'Session already completed' },
        { status: 400 }
      )
    }

    // Calculate actual duration
    const now = new Date()
    const startTime = new Date(flowSession.startTime)
    const actualDuration = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60))

    // Stop the session
    await prisma.flowSession.update({
      where: { id: sessionId },
      data: {
        endTime: now,
        duration: actualDuration,
        feedback,
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: flowSession.id,
      completedAt: now.toISOString(),
      actualDuration,
      feedback,
    })
  } catch (error) {
    console.error('Error stopping flow session:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}