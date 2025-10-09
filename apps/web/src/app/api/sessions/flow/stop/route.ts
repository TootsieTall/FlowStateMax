import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FlowSessionOrchestrator } from '@flowstate/core'

/**
 * POST /api/sessions/flow/stop
 * Stop the active flow session and cleanup all adapters
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, feedback } = body

    // Get active session
    const flowSession = await prisma.flowSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
        endTime: null,
      },
    })

    if (!flowSession) {
      return NextResponse.json({ error: 'No active session found' }, { status: 404 })
    }

    try {
      // Restore orchestrator from stored state
      const orchestratorState = flowSession.feedback as any
      if (orchestratorState && typeof orchestratorState === 'string') {
        const orchestrator = await FlowSessionOrchestrator.deserialize(orchestratorState)
        await orchestrator.stop()
        console.log('[FlowSessionAPI] Orchestrator stopped gracefully')
      } else {
        console.warn('[FlowSessionAPI] No orchestrator state found, skipping cleanup')
      }
    } catch (error) {
      console.error('[FlowSessionAPI] Error stopping orchestrator:', error)
      // Continue with database update even if orchestrator cleanup fails
    }

    // Update session end time and feedback
    const endTime = new Date()
    const duration = Math.floor(
      (endTime.getTime() - flowSession.startTime.getTime()) / (1000 * 60)
    )

    await prisma.flowSession.update({
      where: { id: flowSession.id },
      data: {
        endTime,
        duration,
        feedback: feedback || null,
      },
    })

    console.log('[FlowSessionAPI] Session stopped:', flowSession.id)

    return NextResponse.json({
      success: true,
      sessionId: flowSession.id,
      duration,
      endTime,
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
