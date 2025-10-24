import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ritualItemSchema } from '@/lib/validators/settings'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/settings/ritual/[id]
 * Update ritual item
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = ritualItemSchema.partial().safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Verify ownership
    const existing = await prisma.ritualItem.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Ritual item not found' }, { status: 404 })
    }

    const updated = await prisma.ritualItem.update({
      where: { id: params.id },
      data: validation.data
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Ritual item updated successfully'
    })
  } catch (error) {
    console.error('Ritual PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/settings/ritual/[id]
 * Delete ritual item
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const existing = await prisma.ritualItem.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Ritual item not found' }, { status: 404 })
    }

    await prisma.ritualItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Ritual item deleted successfully'
    })
  } catch (error) {
    console.error('Ritual DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
