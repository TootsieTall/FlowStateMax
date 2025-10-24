import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { locationSchema } from '@/lib/validators/settings'

export const dynamic = 'force-dynamic'

/**
 * GET /api/settings/locations
 * List all user locations
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locations = await prisma.flowLocation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ data: locations })
  } catch (error) {
    console.error('Locations GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings/locations
 * Create new location
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = locationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const location = await prisma.flowLocation.create({
      data: {
        userId: session.user.id,
        ...validation.data
      }
    })

    return NextResponse.json({
      success: true,
      data: location,
      message: 'Location created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Locations POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
