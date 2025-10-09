import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/extension/blocked-apps
 * Returns list of apps to block during flow sessions
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's blocked apps configuration
    const blockedApps = await prisma.blockedApp.findMany({
      where: {
        userId: session.user.id,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        domain: true,
        category: true,
        enabled: true,
      },
    })

    return NextResponse.json({ apps: blockedApps })
  } catch (error) {
    console.error('Error fetching blocked apps:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
