import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/sessions/start
 * Start a new flow session
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
        { error: 'Active session already exists' },
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
        return NextResponse.json(
          { error: 'Invalid time block' },
          { status: 400 }
        )
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

    const duration = Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60))

    // Create flow session
    const flowSession = await prisma.flowSession.create({
      data: {
        userId: session.user.id,
        startTime: now,
        monochromeOn: true,
        appsBlocked: true,
        musicPlayed: false, // Will be updated when music integration is added
        locationId: null, // Will be set if location is verified
      },
    })

    return NextResponse.json({
      sessionId: flowSession.id,
      startTime: flowSession.startTime,
      endTime: endTime,
      duration: duration,
      monochromeEnabled: flowSession.monochromeOn,
      appsBlocked: flowSession.appsBlocked,
      timeBlockId: timeBlock?.id,
    })
  } catch (error) {
    console.error('Error starting flow session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

