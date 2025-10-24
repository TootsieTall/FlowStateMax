import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { locationSchema } from '@/lib/validators/settings'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/settings/locations/[id]
 * Update location
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
    const validation = locationSchema.partial().safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Verify ownership
    const existing = await prisma.flowLocation.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const updated = await prisma.flowLocation.update({
      where: { id: params.id },
      data: validation.data
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Location updated successfully'
    })
  } catch (error) {
    console.error('Location PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/settings/locations/[id]
 * Delete location
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
    const existing = await prisma.flowLocation.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    await prisma.flowLocation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Location deleted successfully'
    })
  } catch (error) {
    console.error('Location DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
