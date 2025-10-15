import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { blockedAppSchema } from '@/lib/validators/settings'

/**
 * PATCH /api/settings/blocked-apps/[id]
 * Update blocked app
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
    const validation = blockedAppSchema.partial().safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Verify ownership
    const existing = await prisma.blockedApp.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Blocked app not found' }, { status: 404 })
    }

    const updated = await prisma.blockedApp.update({
      where: { id: params.id },
      data: validation.data
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Blocked app updated successfully'
    })
  } catch (error) {
    console.error('Blocked app PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/settings/blocked-apps/[id]
 * Delete blocked app
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
    const existing = await prisma.blockedApp.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Blocked app not found' }, { status: 404 })
    }

    await prisma.blockedApp.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Blocked app deleted successfully'
    })
  } catch (error) {
    console.error('Blocked app DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
