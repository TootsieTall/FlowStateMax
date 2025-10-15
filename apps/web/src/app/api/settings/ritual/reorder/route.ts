import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ritualReorderSchema } from '@/lib/validators/settings'

/**
 * PUT /api/settings/ritual/reorder
 * Reorder ritual items
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = ritualReorderSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Update orders in transaction
    await prisma.$transaction(
      validation.data.items.map(item =>
        prisma.ritualItem.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: 'Ritual items reordered successfully'
    })
  } catch (error) {
    console.error('Ritual reorder error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
