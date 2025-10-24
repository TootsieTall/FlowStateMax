import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/extension/session-status
 * Returns current active session status for extension
 * Polled every 5 seconds by extension during active flow
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get active session (no end time)
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
      return NextResponse.json({
        active: false,
        session: null,
        monochromeEnabled: false,
        appsBlocked: false,
      })
    }

    return NextResponse.json({
      active: true,
      session: {
        id: activeSession.id,
        startTime: activeSession.startTime,
        monochromeOn: activeSession.monochromeOn,
        appsBlocked: activeSession.appsBlocked,
        musicPlayed: activeSession.musicPlayed,
      },
      monochromeEnabled: activeSession.monochromeOn,
      appsBlocked: activeSession.appsBlocked,
    })
  } catch (error) {
    console.error('Error fetching session status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
