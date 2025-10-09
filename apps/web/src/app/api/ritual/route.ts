import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/ritual
 * Get user's ritual items sorted by order
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ritualItems = await prisma.ritualItem.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        text: true,
        order: true,
        completed: true,
      },
    })

    return NextResponse.json(ritualItems)
  } catch (error) {
    console.error('Error fetching ritual items:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/ritual
 * Create a new ritual item
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Get current max order
    const maxOrderItem = await prisma.ritualItem.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const nextOrder = (maxOrderItem?.order ?? 0) + 1

    const ritualItem = await prisma.ritualItem.create({
      data: {
        userId: session.user.id,
        text: text.trim(),
        order: nextOrder,
        completed: false,
      },
    })

    return NextResponse.json(ritualItem)
  } catch (error) {
    console.error('Error creating ritual item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/ritual
 * Update ritual item order or text
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, text, order, completed } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existingItem = await prisma.ritualItem.findUnique({
      where: { id },
    })

    if (!existingItem || existingItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Ritual item not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (text !== undefined) updateData.text = text
    if (order !== undefined) updateData.order = order
    if (completed !== undefined) updateData.completed = completed

    const updatedItem = await prisma.ritualItem.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating ritual item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/ritual
 * Delete a ritual item
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existingItem = await prisma.ritualItem.findUnique({
      where: { id },
    })

    if (!existingItem || existingItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Ritual item not found' },
        { status: 404 }
      )
    }

    await prisma.ritualItem.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ritual item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

