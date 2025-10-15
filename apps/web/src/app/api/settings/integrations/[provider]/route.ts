import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { disconnectIntegration, deleteIntegration, saveCanvasIntegration } from '@/lib/integrations'
import { integrationProviderSchema, canvasApiKeySchema } from '@/lib/validators/settings'

/**
 * POST /api/settings/integrations/[provider]
 * Connect integration (Canvas API key for now)
 */
export async function POST(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const providerValidation = integrationProviderSchema.safeParse(params.provider)
    if (!providerValidation.success) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    const body = await request.json()

    // Handle Canvas LMS specifically
    if (params.provider === 'canvas') {
      const validation = canvasApiKeySchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.errors },
          { status: 400 }
        )
      }

      await saveCanvasIntegration(
        session.user.id,
        validation.data.apiKey,
        validation.data.institutionUrl
      )

      return NextResponse.json({
        success: true,
        message: 'Canvas integration connected successfully'
      })
    }

    // Other providers would use OAuth flow
    return NextResponse.json(
      { error: 'OAuth flow not implemented for this provider' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Integration POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/settings/integrations/[provider]
 * Disconnect integration
 */
export async function DELETE(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const providerValidation = integrationProviderSchema.safeParse(params.provider)
    if (!providerValidation.success) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    const url = new URL(request.url)
    const permanent = url.searchParams.get('permanent') === 'true'

    if (permanent) {
      await deleteIntegration(session.user.id, params.provider as any)
    } else {
      await disconnectIntegration(session.user.id, params.provider as any)
    }

    return NextResponse.json({
      success: true,
      message: permanent ? 'Integration deleted successfully' : 'Integration disconnected successfully'
    })
  } catch (error) {
    console.error('Integration DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
