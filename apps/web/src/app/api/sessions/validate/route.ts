import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    // Only validate critical prerequisites
    // Location and ritual are handled by their respective components
    if (!user.onboardingComplete) {
      errors.push('Please complete onboarding first')
      return NextResponse.json({
        isValid: false,
        errors,
        redirectTo: '/onboarding',
      })
    }

    // Flow locations are OPTIONAL - LocationCheck component handles this
    // Ritual items are OPTIONAL - RitualChecklist component handles this
    // The multi-step flow is designed to be self-configuring

    return NextResponse.json({
      isValid: true,
      errors: [],
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