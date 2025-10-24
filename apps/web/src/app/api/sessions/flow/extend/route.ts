import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/sessions/flow/extend
 * Extend the current flow session by adding additional time
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, additionalMinutes } = body

    if (!sessionId || !additionalMinutes) {
      return NextResponse.json(
        { error: 'Session ID and additional minutes required' },
        { status: 400 }
      )
    }

    if (additionalMinutes < 5 || additionalMinutes > 120) {
      return NextResponse.json(
        { error: 'Additional minutes must be between 5 and 120' },
        { status: 400 }
      )
    }

    // Fetch the session
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
        { error: 'Cannot extend a completed session' },
        { status: 400 }
      )
    }

    // Calculate new end time
    const currentEndTime = flowSession.endTime 
      ? new Date(flowSession.endTime)
      : new Date(new Date(flowSession.startTime).getTime() + (flowSession.duration || 60) * 60 * 1000)
    
    const newEndTime = new Date(currentEndTime.getTime() + additionalMinutes * 60 * 1000)

    // Update session
    const updatedSession = await prisma.flowSession.update({
      where: { id: sessionId },
      data: {
        extendedDuration: (flowSession.extendedDuration || 0) + additionalMinutes,
        // Store original duration if not already set
        originalDuration: flowSession.originalDuration || flowSession.duration,
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: updatedSession.id,
      newEndTime: newEndTime.toISOString(),
      totalExtendedMinutes: updatedSession.extendedDuration,
      originalDuration: updatedSession.originalDuration,
    })
  } catch (error) {
    console.error('Error extending flow session:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

