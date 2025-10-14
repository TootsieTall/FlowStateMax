import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/onboarding/ritual
 * Save user's ritual items during onboarding
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ritualItems } = body

    if (!Array.isArray(ritualItems)) {
      return NextResponse.json({ error: 'Invalid ritual items format' }, { status: 400 })
    }

    // Delete existing ritual items for this user
    await prisma.ritualItem.deleteMany({
      where: { userId: session.user.id },
    })

    // Create new ritual items
    const createdItems = await prisma.ritualItem.createMany({
      data: ritualItems.map((item: { text: string }, index: number) => ({
        userId: session.user.id,
        text: item.text,
        order: index,
        completed: false,
      })),
    })

    console.log(`[RitualAPI] Created ${createdItems.count} ritual items for user ${session.user.id}`)

    return NextResponse.json({
      success: true,
      count: createdItems.count,
    })
  } catch (error) {
    console.error('[RitualAPI] Error saving ritual items:', error)
    return NextResponse.json(
      {
        error: 'Failed to save ritual items',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/onboarding/ritual
 * Get user's ritual items
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ritualItems = await prisma.ritualItem.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({
      ritualItems,
    })
  } catch (error) {
    console.error('[RitualAPI] Error fetching ritual items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ritual items' },
      { status: 500 }
    )
  }
}
