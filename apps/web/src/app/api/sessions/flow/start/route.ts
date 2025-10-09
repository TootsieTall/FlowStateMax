import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FlowSessionOrchestrator, OrchestratorConfig } from '@flowstate/core'

/**
 * POST /api/sessions/flow/start
 * Start a new flow session with full adapter orchestration
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { timeBlockId } = body

    // Check for active session
    const activeSession = await prisma.flowSession.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
    })

    if (activeSession) {
      return NextResponse.json(
        { error: 'Active session already exists', sessionId: activeSession.id },
        { status: 409 }
      )
    }

    // Get time block if provided
    let timeBlock = null
    if (timeBlockId) {
      timeBlock = await prisma.timeBlock.findUnique({
        where: { id: timeBlockId },
      })

      if (!timeBlock || timeBlock.userId !== session.user.id) {
        return NextResponse.json({ error: 'Invalid time block' }, { status: 400 })
      }
    } else {
      // Find current deep work block
      const now = new Date()
      timeBlock = await prisma.timeBlock.findFirst({
        where: {
          userId: session.user.id,
          type: 'DEEP_WORK',
          startTime: { lte: now },
          endTime: { gte: now },
        },
        orderBy: {
          startTime: 'desc',
        },
      })
    }

    // Calculate session duration
    const now = new Date()
    const endTime = timeBlock
      ? new Date(timeBlock.endTime)
      : new Date(now.getTime() + 60 * 60 * 1000) // Default 1 hour

    const durationMinutes = Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60))

    // Fetch user's blocked apps
    const blockedApps = await prisma.blockedApp.findMany({
      where: {
        userId: session.user.id,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        identifier: true,
      },
    })

    // Create flow session in database
    const flowSession = await prisma.flowSession.create({
      data: {
        userId: session.user.id,
        startTime: now,
        monochromeOn: true,
        appsBlocked: blockedApps.length > 0,
        musicPlayed: false,
        locationId: null,
      },
    })

    // Create orchestrator configuration
    const orchestratorConfig: OrchestratorConfig = {
      sessionId: flowSession.id,
      userId: session.user.id,
      durationMinutes,
      timeBlockId: timeBlock?.id,
      blockedApps,
      enableMonochrome: true,
      enableMusic: false, // TODO: Enable when OAuth is configured
      enableDND: true,
    }

    // Initialize and start orchestrator
    const orchestrator = new FlowSessionOrchestrator(orchestratorConfig)
    await orchestrator.initialize()
    await orchestrator.start()

    // Store orchestrator state for recovery
    const orchestratorState = orchestrator.serialize()

    // Update session with orchestrator state (stored as JSON)
    await prisma.flowSession.update({
      where: { id: flowSession.id },
      data: {
        // Store orchestrator state in feedback field temporarily
        // TODO: Add dedicated orchestratorState field to schema
        feedback: orchestratorState as any,
      },
    })

    console.log('[FlowSessionAPI] Session started:', flowSession.id)

    return NextResponse.json({
      success: true,
      sessionId: flowSession.id,
      startTime: flowSession.startTime,
      endTime: endTime,
      duration: durationMinutes,
      monochromeEnabled: flowSession.monochromeOn,
      appsBlocked: flowSession.appsBlocked,
      timeBlockId: timeBlock?.id,
      adapters: orchestrator.getState().adapters,
    })
  } catch (error) {
    console.error('Error starting flow session:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
