import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ritualItemSchema } from '@/lib/validators/settings'

export const dynamic = 'force-dynamic'

/**
 * GET /api/settings/ritual
 * Get all ritual items
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.ritualItem.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ data: items })
  } catch (error) {
    console.error('Ritual GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings/ritual
 * Add new ritual item
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = ritualItemSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Get current max order
    const maxOrder = await prisma.ritualItem.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const item = await prisma.ritualItem.create({
      data: {
        userId: session.user.id,
        text: validation.data.text,
        order: (maxOrder?.order ?? -1) + 1
      }
    })

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Ritual item created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Ritual POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
