import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/sessions/validate
 * Validate prerequisites for starting a flow session
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for active session
    const activeSession = await prisma.flowSession.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
    })

    if (activeSession) {
      return NextResponse.json({
        isValid: false,
        errors: ['Active session already exists'],
        redirectTo: '/flow',
      })
    }

    // Check onboarding completion
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        onboardingComplete: true,
        ritualCompletionCount: true,
        locationConfirmationCount: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const errors: string[] = []

    if (!user.onboardingComplete) {
      errors.push('Please complete onboarding first')
    }

    // Check if user has any flow locations
    const flowLocations = await prisma.flowLocation.count({
      where: {
        userId: session.user.id,
        enabled: true,
      },
    })

    if (flowLocations === 0) {
      errors.push('Please add at least one flow location')
    }

    // Check if user has any ritual items
    const ritualItems = await prisma.ritualItem.count({
      where: {
        userId: session.user.id,
      },
    })

    if (ritualItems === 0) {
      errors.push('Please set up your pre-flow ritual')
    }

    return NextResponse.json({
      isValid: errors.length === 0,
      errors,
      redirectTo: errors.length > 0 ? '/onboarding' : undefined,
    })
  } catch (error) {
    console.error('Error validating session prerequisites:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}