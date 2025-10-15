import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { blockedAppSchema } from '@/lib/validators/settings'

/**
 * GET /api/settings/blocked-apps
 * List all blocked apps
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apps = await prisma.blockedApp.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ data: apps })
  } catch (error) {
    console.error('Blocked apps GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings/blocked-apps
 * Add blocked app
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = blockedAppSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const app = await prisma.blockedApp.create({
      data: {
        userId: session.user.id,
        ...validation.data
      }
    })

    return NextResponse.json({
      success: true,
      data: app,
      message: 'Blocked app created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Blocked apps POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
