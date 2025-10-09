import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FlowSessionOrchestrator } from '@flowstate/core'

/**
 * GET /api/sessions/flow/status
 * Get detailed status of the active flow session including adapter states
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get active session
    const flowSession = await prisma.flowSession.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
      orderBy: {
        startTime: 'desc',
      },
    })

    if (!flowSession) {
      return NextResponse.json({
        hasActiveSession: false,
      })
    }

    // Calculate remaining time
    const now = new Date()
    const startTime = new Date(flowSession.startTime)
    const duration = flowSession.duration || 60 // Default 60 minutes
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000)
    const remainingMinutes = Math.max(
      0,
      Math.ceil((endTime.getTime() - now.getTime()) / (60 * 1000))
    )

    // Try to restore orchestrator state for detailed adapter info
    let adapterStates = null
    let orchestratorStatus = 'unknown'

    try {
      const orchestratorState = flowSession.feedback as any
      if (orchestratorState && typeof orchestratorState === 'string') {
        const orchestrator = await FlowSessionOrchestrator.deserialize(orchestratorState)
        const state = orchestrator.getState()
        adapterStates = state.adapters
        orchestratorStatus = state.status
      }
    } catch (error) {
      console.error('[FlowSessionAPI] Error restoring orchestrator state:', error)
    }

    return NextResponse.json({
      hasActiveSession: true,
      sessionId: flowSession.id,
      startTime: flowSession.startTime,
      endTime: endTime,
      remainingMinutes,
      monochromeOn: flowSession.monochromeOn,
      appsBlocked: flowSession.appsBlocked,
      musicPlayed: flowSession.musicPlayed,
      locationId: flowSession.locationId,
      orchestratorStatus,
      adapters: adapterStates,
    })
  } catch (error) {
    console.error('Error getting flow session status:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
