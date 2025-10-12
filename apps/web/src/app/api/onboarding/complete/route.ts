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
    console.log('[OnboardingAPI] Starting onboarding completion...')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      console.log('[OnboardingAPI] No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[OnboardingAPI] Session user:', {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    })

    const body = await request.json()
    const { goals, recoveryActivities, trackRecovery, hobbiesToTry } = body

    console.log('[OnboardingAPI] Request body:', {
      goals: typeof goals,
      recoveryActivities: typeof recoveryActivities,
      trackRecovery: typeof trackRecovery,
      hobbiesToTry: typeof hobbiesToTry
    })

    // Parse goals if it's a string
    let parsedGoals = goals
    if (typeof goals === 'string') {
      try {
        parsedGoals = JSON.parse(goals)
      } catch (err) {
        console.warn('[OnboardingAPI] Failed to parse goals:', err)
        parsedGoals = []
      }
    }
    
    // Ensure goals is an array
    const goalsArray = Array.isArray(parsedGoals) ? parsedGoals : []
    console.log('[OnboardingAPI] Parsed goals array:', goalsArray)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true }
    })

    console.log('[OnboardingAPI] Existing user:', existingUser)

    // Update or create user with onboarding complete
    const user = await prisma.user.upsert({
      where: { id: session.user.id },
      update: {
        onboardingComplete: true,
        goals: goalsArray,
      },
      create: {
        id: session.user.id,
        email: session.user.email || `user-${session.user.id}@flowstate.app`,
        name: session.user.name || 'User',
        onboardingComplete: true,
        goals: goalsArray,
        podcastGenres: [],
      },
    })

    console.log(`[OnboardingAPI] ✅ User ${user.id} completed onboarding successfully`)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        onboardingComplete: user.onboardingComplete,
        goals: user.goals,
      },
    })
  } catch (error) {
    console.error('[OnboardingAPI] ❌ Error completing onboarding:', error)
    console.error('[OnboardingAPI] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to complete onboarding',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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

