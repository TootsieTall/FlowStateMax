import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/sessions/flow/pause
 * Pause the current flow session
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
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

    // Pause the session by setting endTime to now
    const now = new Date()
    await prisma.flowSession.update({
      where: { id: sessionId },
      data: {
        endTime: now,
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: flowSession.id,
      pausedAt: now.toISOString(),
    })
  } catch (error) {
    console.error('Error pausing flow session:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}