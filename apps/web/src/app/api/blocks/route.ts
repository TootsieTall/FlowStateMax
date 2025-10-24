import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const blocks = await prisma.timeBlock.findMany({
      where: {
        userId: session.user.id,
        startTime: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      include: {
        task: true,
      },
    })

    console.log(`[BlocksAPI] Fetched ${blocks.length} blocks for user ${session.user.id}`)
    return NextResponse.json(blocks)
  } catch (error) {
    console.error('[BlocksAPI] Error fetching blocks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, startTime, endTime, type, color, taskId } = body

    // Validate required fields
    if (!title || !startTime || !endTime) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, startTime, endTime' 
      }, { status: 400 })
    }

    const block = await prisma.timeBlock.create({
      data: {
        userId: session.user.id,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type: type || 'DEEP_WORK',
        color,
        taskId,
      },
    })

    console.log(`[BlocksAPI] Block ${block.id} created by user ${session.user.id}`)
    return NextResponse.json(block)
  } catch (error) {
    console.error('[BlocksAPI] Error creating block:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Block ID required' }, { status: 400 })
    }

    // Verify ownership before updating
    const existingBlock = await prisma.timeBlock.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 })
    }

    if (existingBlock.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Convert date strings to Date objects
    if (updates.startTime) updates.startTime = new Date(updates.startTime)
    if (updates.endTime) updates.endTime = new Date(updates.endTime)

    const block = await prisma.timeBlock.update({
      where: { id },
      data: updates,
    })

    console.log(`[BlocksAPI] Block ${id} updated by user ${session.user.id}`)
    return NextResponse.json(block)
  } catch (error) {
    console.error('[BlocksAPI] Error updating block:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Block ID required' }, { status: 400 })
    }

    // Verify ownership before deleting
    const existingBlock = await prisma.timeBlock.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 })
    }

    if (existingBlock.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.timeBlock.delete({
      where: { id },
    })

    console.log(`[BlocksAPI] Block ${id} deleted by user ${session.user.id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[BlocksAPI] Error deleting block:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}