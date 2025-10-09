import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const createSessionSchema = z.object({
  blockId: z.string().min(1),
  startTime: z.string().datetime(),
  duration: z.number().min(1).max(480), // 1 min to 8 hours
})

const updateSessionSchema = z.object({
  sessionId: z.string().min(1),
  endTime: z.string().datetime().optional(),
  feedback: z.enum(['on_time', 'needed_more', 'finished_early']).optional(),
})

/**
 * POST /api/sessions/flow
 * Create a new flow session with full integration
 */
export async function POST(request: Request) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Validate input
    const body = await request.json()
    const validation = createSessionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { blockId, startTime, duration } = validation.data

    // 3. Check for active sessions
    const activeSession = await prisma.flowSession.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
    })

    if (activeSession) {
      return NextResponse.json(
        { error: 'Active session already exists. End it before starting a new one.' },
        { status: 409 }
      )
    }

    // 4. Verify time block exists and belongs to user
    const timeBlock = await prisma.timeBlock.findFirst({
      where: {
        id: blockId,
        userId: session.user.id,
      },
    })

    if (!timeBlock) {
      return NextResponse.json(
        { error: 'Time block not found' },
        { status: 404 }
      )
    }

    // 5. Create flow session
    const flowSession = await prisma.flowSession.create({
      data: {
        userId: session.user.id,
        startTime: new Date(startTime),
        duration,
        monochromeOn: true,
        appsBlocked: true,
        musicPlayed: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    // 6. Log session start for analytics
    console.log(`Flow session started: ${flowSession.id} for user ${session.user.id}`)

    return NextResponse.json(flowSession, { status: 201 })
  } catch (error) {
    console.error('Error creating flow session:', error)

    // Security: Don't leak internal errors
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/sessions/flow
 * Update/end a flow session
 */
export async function PATCH(request: Request) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Validate input
    const body = await request.json()
    const validation = updateSessionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { sessionId, endTime, feedback } = validation.data

    // 3. Verify session exists and belongs to user
    const existingSession = await prisma.flowSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // 4. Calculate actual duration if ending session
    const updateData: any = {}

    if (endTime) {
      const start = new Date(existingSession.startTime)
      const end = new Date(endTime)
      const actualDuration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))

      updateData.endTime = end
      updateData.duration = actualDuration
    }

    if (feedback) {
      updateData.feedback = feedback
    }

    // 5. Update session
    const updatedSession = await prisma.flowSession.update({
      where: { id: sessionId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    // 6. Log session end for analytics
    if (endTime) {
      console.log(`Flow session ended: ${sessionId} - Duration: ${updateData.duration} minutes`)
    }

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error('Error updating flow session:', error)

    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sessions/flow
 * Get active flow session
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const activeSession = await prisma.flowSession.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(activeSession || null)
  } catch (error) {
    console.error('Error fetching active session:', error)

    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}
