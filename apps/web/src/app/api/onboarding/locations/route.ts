import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/onboarding/locations
 * Save user's flow locations during onboarding
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { locations } = body

    if (!Array.isArray(locations)) {
      return NextResponse.json({ error: 'Invalid locations format' }, { status: 400 })
    }

    // Delete existing locations for this user
    await prisma.flowLocation.deleteMany({
      where: { userId: session.user.id },
    })

    // Create new flow locations
    const createdLocations = await prisma.flowLocation.createMany({
      data: locations.map((loc: {
        name: string
        latitude?: number
        longitude?: number
        radius: number
      }) => ({
        userId: session.user.id,
        name: loc.name,
        latitude: loc.latitude || 0, // Default to 0 if not provided
        longitude: loc.longitude || 0,
        radius: Math.round((loc.radius || 50) * 0.3048), // Convert feet to meters
        enabled: true,
      })),
    })

    console.log(`[LocationsAPI] Created ${createdLocations.count} flow locations for user ${session.user.id}`)

    return NextResponse.json({
      success: true,
      count: createdLocations.count,
    })
  } catch (error) {
    console.error('[LocationsAPI] Error saving locations:', error)
    return NextResponse.json(
      {
        error: 'Failed to save locations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/onboarding/locations
 * Get user's flow locations
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locations = await prisma.flowLocation.findMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({
      locations,
    })
  } catch (error) {
    console.error('[LocationsAPI] Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}
