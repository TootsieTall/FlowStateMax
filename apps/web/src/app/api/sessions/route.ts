import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { blockId, startTime } = body

    // Create flow session
    const flowSession = await prisma.flowSession.create({
      data: {
        userId: session.user.id,
        startTime: new Date(startTime),
        monochromeOn: true,
        appsBlocked: true,
        musicPlayed: false,
      },
    })

    return NextResponse.json(flowSession)
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    if (active === 'true') {
      // Get active sessions (no end time)
      const sessions = await prisma.flowSession.findMany({
        where: {
          userId: session.user.id,
          endTime: null,
        },
        orderBy: {
          startTime: 'desc',
        },
      })
      return NextResponse.json(sessions[0] || null)
    }

    // Get all sessions
    const sessions = await prisma.flowSession.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        startTime: 'desc',
      },
      take: 20,
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, endTime, feedback, duration } = body

    // Update flow session
    const flowSession = await prisma.flowSession.update({
      where: { id: sessionId },
      data: {
        endTime: endTime ? new Date(endTime) : undefined,
        feedback,
        duration,
      },
    })

    return NextResponse.json(flowSession)
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}