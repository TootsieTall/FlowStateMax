import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/extension/log-break
 * Logs when user chooses "Open Anyway" on a blocked app
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { appName, url, timestamp } = body

    // Get active session
    const activeSession = await prisma.flowSession.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
      orderBy: {
        startTime: 'desc',
      },
    })

    if (!activeSession) {
      return NextResponse.json({ error: 'No active session' }, { status: 400 })
    }

    // Log the break
    const blockBreak = await prisma.sessionBlockBreak.create({
      data: {
        sessionId: activeSession.id,
        appName,
        url,
        timestamp: new Date(timestamp),
      },
    })

    return NextResponse.json({
      success: true,
      break: blockBreak
    })
  } catch (error) {
    console.error('Error logging block break:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
