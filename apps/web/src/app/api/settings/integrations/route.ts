import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getUserIntegrations } from '@/lib/integrations'

/**
 * GET /api/settings/integrations
 * List all user integrations
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const integrations = await getUserIntegrations(session.user.id)

    // Sanitize: don't send tokens to client
    const sanitized = integrations.map(int => ({
      id: int.id,
      provider: int.provider,
      isActive: int.isActive,
      createdAt: int.createdAt,
      updatedAt: int.updatedAt,
      metadata: int.metadata
    }))

    return NextResponse.json({ data: sanitized })
  } catch (error) {
    console.error('Integrations GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
