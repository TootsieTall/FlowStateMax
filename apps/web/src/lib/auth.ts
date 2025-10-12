import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { 
  isOAuthEnabled, 
  isGuestOnboardingAllowed, 
  isDevMode,
  createGuestUser,
  createDevUser,
} from './guest-auth'

/**
 * NextAuth Configuration with Optional OAuth
 * 
 * Features:
 * - Google OAuth (can be disabled via env var)
 * - Guest onboarding mode
 * - Development test user mode
 * - Feature flag driven authentication
 */

// Build providers array dynamically based on feature flags
function getAuthProviders() {
  const providers: any[] = []

  // Always include credentials provider for guest/dev mode
  if (isGuestOnboardingAllowed() || isDevMode()) {
    providers.push(
      CredentialsProvider({
        name: isDevMode() ? 'Development Login' : 'Guest Login',
        credentials: {
          name: { label: "Name", type: "text", placeholder: "Enter your name" }
        },
        async authorize(credentials) {
          // For development or guest mode, accept any name
          if (credentials?.name) {
            if (isDevMode()) {
              return createDevUser(credentials.name)
            }
            return createGuestUser(credentials.name)
          }
          return null
        }
      })
    )
  }

  // Conditionally add Google OAuth provider
  if (isOAuthEnabled()) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (googleClientId && googleClientSecret) {
      providers.push(
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        })
      )
    } else {
      console.warn(
        '⚠️  Google OAuth is enabled but credentials are missing. ' +
        'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET or disable OAuth with NEXT_PUBLIC_ENABLE_OAUTH=false'
      )
    }
  }

  return providers
}

export const authOptions: NextAuthOptions = {
  providers: getAuthProviders(),
  pages: {
    signIn: '/login',
    // Show different error pages based on mode
    error: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        // Preserve guest flag in session
        if (token.isGuest) {
          (session.user as any).isGuest = true
        }
        // Preserve onboarding status in session
        if (typeof token.onboardingComplete !== 'undefined') {
          (session.user as any).onboardingComplete = token.onboardingComplete
        }
      }
      return session
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.sub = user.id
        // Store guest flag in token
        if ((user as any).isGuest) {
          token.isGuest = true
        }
        // Store OAuth provider info
        if (account?.provider) {
          token.provider = account.provider
        }
      }

      // Fetch onboarding status from database if not in token or on update trigger
      if (token.sub && (trigger === 'update' || typeof token.onboardingComplete === 'undefined')) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub as string },
            select: { onboardingComplete: true }
          })
          
          if (dbUser) {
            token.onboardingComplete = dbUser.onboardingComplete
          } else {
            // User doesn't exist in DB yet (e.g., guest user)
            token.onboardingComplete = false
          }
        } catch (error) {
          console.error('Error fetching onboarding status:', error)
          // Default to false if we can't fetch
          token.onboardingComplete = false
        }
      }

      return token
    },
    async signIn({ user, account, profile }) {
      // Allow all sign-ins in dev/guest mode
      if (isDevMode() || isGuestOnboardingAllowed()) {
        return true
      }

      // In production with OAuth only, validate the sign-in
      if (account?.provider === 'google') {
        // Add any additional validation here
        return true
      }

      return true
    }
  },
  session: {
    strategy: 'jwt',
    // Shorter session for guest users
    maxAge: isGuestOnboardingAllowed() ? 24 * 60 * 60 : 30 * 24 * 60 * 60, // 1 day vs 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: isDevMode(), // Enable debug mode in development
}

// Log current auth configuration (helpful for debugging)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔐 Auth Configuration:')
  console.log(`   OAuth Enabled: ${isOAuthEnabled()}`)
  console.log(`   Guest Onboarding: ${isGuestOnboardingAllowed()}`)
  console.log(`   Dev Mode: ${isDevMode()}`)
  console.log(`   Available Providers: ${getAuthProviders().map(p => p.name || p.id).join(', ')}`)
}