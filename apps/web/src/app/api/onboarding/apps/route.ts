import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/onboarding/apps
 * Save user's blocked apps during onboarding
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { blockedApps } = body

    if (!Array.isArray(blockedApps)) {
      return NextResponse.json({ error: 'Invalid blocked apps format' }, { status: 400 })
    }

    // Delete existing blocked apps for this user
    await prisma.blockedApp.deleteMany({
      where: { userId: session.user.id },
    })

    // Create new blocked apps
    const createdApps = await prisma.blockedApp.createMany({
      data: blockedApps.map((app: {
        name: string
        identifier: string
        domain?: string
        category?: string
      }) => ({
        userId: session.user.id,
        name: app.name,
        identifier: app.identifier,
        domain: app.domain || null,
        category: app.category || 'social',
        enabled: true,
      })),
    })

    console.log(`[BlockedAppsAPI] Created ${createdApps.count} blocked apps for user ${session.user.id}`)

    return NextResponse.json({
      success: true,
      count: createdApps.count,
    })
  } catch (error) {
    console.error('[BlockedAppsAPI] Error saving blocked apps:', error)
    return NextResponse.json(
      {
        error: 'Failed to save blocked apps',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/onboarding/apps
 * Get user's blocked apps
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blockedApps = await prisma.blockedApp.findMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({
      blockedApps,
    })
  } catch (error) {
    console.error('[BlockedAppsAPI] Error fetching blocked apps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blocked apps' },
      { status: 500 }
    )
  }
}
