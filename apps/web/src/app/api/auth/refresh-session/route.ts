import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

/**
 * GET /api/auth/refresh-session
 *
 * Forces a session refresh by fetching the latest user data
 * This is useful after completing onboarding to ensure the JWT token
 * has the updated onboardingComplete status
 */
export async function GET(request: Request) {
  try {
    console.log('[RefreshSession] Refreshing session...')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      console.log('[RefreshSession] No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[RefreshSession] Session refreshed successfully for user:', session.user.id)
    
    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        onboardingComplete: (session.user as any).onboardingComplete,
      },
    })
  } catch (error) {
    console.error('[RefreshSession] Error refreshing session:', error)
    return NextResponse.json(
      { error: 'Failed to refresh session' },
      { status: 500 }
    )
  }
}


