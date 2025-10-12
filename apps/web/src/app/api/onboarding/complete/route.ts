import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/onboarding/complete
 * Mark user's onboarding as complete
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { goals, recoveryActivities, trackRecovery, hobbiesToTry } = body

    // Update or create user with onboarding complete
    const user = await prisma.user.upsert({
      where: { id: session.user.id },
      update: {
        onboardingComplete: true,
        goals: goals || [],
      },
      create: {
        id: session.user.id,
        email: session.user.email || `user-${session.user.id}@flowstate.app`,
        name: session.user.name || 'User',
        onboardingComplete: true,
        goals: goals || [],
        podcastGenres: [],
      },
    })

    console.log(`[OnboardingAPI] User ${user.id} completed onboarding`)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        onboardingComplete: user.onboardingComplete,
      },
    })
  } catch (error) {
    console.error('[OnboardingAPI] Error completing onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/onboarding/complete
 * Check if user has completed onboarding
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        onboardingComplete: true,
        goals: true,
      },
    })

    if (!user) {
      return NextResponse.json({
        onboardingComplete: false,
      })
    }

    return NextResponse.json({
      onboardingComplete: user.onboardingComplete,
      goals: user.goals,
    })
  } catch (error) {
    console.error('[OnboardingAPI] Error checking onboarding status:', error)
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    )
  }
}

