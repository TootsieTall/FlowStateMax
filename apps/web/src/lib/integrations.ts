/**
 * Integration Helper Library
 * OAuth and API integration functions for external services
 */

import { prisma } from '@/lib/prisma'

export type IntegrationProvider =
  | 'google_calendar'
  | 'gmail'
  | 'canvas'
  | 'spotify'
  | 'apple_music'

/**
 * OAuth URLs for different providers
 */
export const OAUTH_URLS = {
  google_calendar: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL || '',
  spotify: process.env.NEXT_PUBLIC_SPOTIFY_OAUTH_URL || '',
  apple_music: process.env.NEXT_PUBLIC_APPLE_MUSIC_URL || ''
} as const

/**
 * Check if user has an active integration
 */
export async function hasIntegration(
  userId: string,
  provider: IntegrationProvider
): Promise<boolean> {
  const integration = await prisma.integration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider
      }
    }
  })

  return integration?.isActive ?? false
}

/**
 * Get user integration
 */
export async function getIntegration(
  userId: string,
  provider: IntegrationProvider
) {
  return await prisma.integration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider
      }
    }
  })
}

/**
 * Save integration tokens
 */
export async function saveIntegration(
  userId: string,
  provider: IntegrationProvider,
  data: {
    providerAccountId?: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    scope?: string
    metadata?: any
  }
) {
  return await prisma.integration.upsert({
    where: {
      userId_provider: {
        userId,
        provider
      }
    },
    update: {
      ...data,
      isActive: true,
      updatedAt: new Date()
    },
    create: {
      userId,
      provider,
      ...data,
      isActive: true
    }
  })
}

/**
 * Disconnect integration
 */
export async function disconnectIntegration(
  userId: string,
  provider: IntegrationProvider
) {
  return await prisma.integration.update({
    where: {
      userId_provider: {
        userId,
        provider
      }
    },
    data: {
      isActive: false,
      accessToken: null,
      refreshToken: null
    }
  })
}

/**
 * Delete integration completely
 */
export async function deleteIntegration(
  userId: string,
  provider: IntegrationProvider
) {
  return await prisma.integration.delete({
    where: {
      userId_provider: {
        userId,
        provider
      }
    }
  })
}

/**
 * Get all user integrations
 */
export async function getUserIntegrations(userId: string) {
  return await prisma.integration.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })
}

/**
 * Canvas LMS specific functions
 */
export async function saveCanvasIntegration(
  userId: string,
  apiKey: string,
  institutionUrl: string
) {
  return await saveIntegration(userId, 'canvas', {
    accessToken: apiKey,
    metadata: { institutionUrl }
  })
}

/**
 * Check if access token is expired
 */
export function isTokenExpired(expiresAt?: number | null): boolean {
  if (!expiresAt) return false
  return Date.now() >= expiresAt * 1000
}

/**
 * Refresh OAuth token (placeholder - implement per provider)
 */
export async function refreshOAuthToken(
  userId: string,
  provider: IntegrationProvider
): Promise<boolean> {
  const integration = await getIntegration(userId, provider)

  if (!integration || !integration.refreshToken) {
    return false
  }

  // TODO: Implement provider-specific token refresh
  // For now, just return false
  console.warn(\`Token refresh not implemented for \${provider}\`)
  return false
}
