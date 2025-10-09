import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/sessions/pause
 * Pause the current active session
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
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const flowSession = await prisma.flowSession.findUnique({
      where: { id: sessionId },
    })

    if (!flowSession || flowSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (flowSession.endTime) {
      return NextResponse.json(
        { error: 'Session already ended' },
        { status: 400 }
      )
    }

    // Calculate duration
    const now = new Date()
    const duration = Math.floor(
      (now.getTime() - flowSession.startTime.getTime()) / (1000 * 60)
    )

    // End the session (paused sessions are just ended sessions with shorter duration)
    const updatedSession = await prisma.flowSession.update({
      where: { id: sessionId },
      data: {
        endTime: now,
        duration: duration,
      },
    })

    return NextResponse.json({
      success: true,
      session: updatedSession,
    })
  } catch (error) {
    console.error('Error pausing session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

