import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FlowSessionOrchestrator } from '@flowstate/core'

/**
 * POST /api/sessions/flow/resume
 * Resume a paused flow session
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId } = body

    // Get paused session
    const flowSession = await prisma.flowSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
        endTime: null,
      },
    })

    if (!flowSession) {
      return NextResponse.json({ error: 'No paused session found' }, { status: 404 })
    }

    try {
      // Restore and resume orchestrator
      const orchestratorState = flowSession.feedback as any
      if (orchestratorState && typeof orchestratorState === 'string') {
        const orchestrator = await FlowSessionOrchestrator.deserialize(orchestratorState)
        await orchestrator.resume()

        // Update stored state
        await prisma.flowSession.update({
          where: { id: flowSession.id },
          data: {
            feedback: orchestrator.serialize() as any,
          },
        })

        console.log('[FlowSessionAPI] Session resumed:', flowSession.id)
      }
    } catch (error) {
      console.error('[FlowSessionAPI] Error resuming orchestrator:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      sessionId: flowSession.id,
      status: 'active',
    })
  } catch (error) {
    console.error('Error resuming flow session:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
