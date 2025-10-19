import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { authenticateUser } from './auth-helpers'

/**
 * NextAuth Configuration with Email/Password Authentication
 *
 * Features:
 * - Email/password authentication (primary)
 * - Google OAuth (optional, can be added later)
 * - Secure password hashing with bcrypt
 * - Persistent database sessions
 */

// Build providers array dynamically
function getAuthProviders() {
  const providers: any[] = []

  // Email/Password provider (always available)
  providers.push(
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const user = await authenticateUser(
            credentials.email,
            credentials.password
          )

          if (!user) {
            throw new Error('Invalid email or password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('[Auth] Authentication error:', error)
          throw new Error('Authentication failed')
        }
      }
    })
  )

  // Google OAuth (optional - only if credentials are configured)
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
  }

  return providers
}

export const authOptions: NextAuthOptions = {
  providers: getAuthProviders(),
  pages: {
    signIn: '/onboarding',
    error: '/onboarding',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub

        // Add onboarding status to session
        if (typeof token.onboardingComplete !== 'undefined') {
          (session.user as any).onboardingComplete = token.onboardingComplete
        }
      }
      return session
    },

    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.sub = user.id

        // Store OAuth provider info
        if (account?.provider) {
          token.provider = account.provider
        }
      }

      // Fetch onboarding status from database
      if (token.sub && (trigger === 'update' || typeof token.onboardingComplete === 'undefined')) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub as string },
            select: { onboardingComplete: true }
          })

          if (dbUser) {
            token.onboardingComplete = dbUser.onboardingComplete
          } else {
            token.onboardingComplete = false
          }
        } catch (error) {
          console.error('[Auth] Error fetching onboarding status:', error)
          token.onboardingComplete = false
        }
      }

      return token
    },

    async signIn({ user, account, profile }) {
      // For OAuth providers, create or update user in database
      if (account?.provider === 'google' && user.email) {
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              image: user.image,
            },
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
              onboardingComplete: false,
              goals: [],
              podcastGenres: [],
            },
          })
        } catch (error) {
          console.error('[Auth] Error creating/updating OAuth user:', error)
          return false
        }
      }

      return true
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

// Log current auth configuration
if (process.env.NODE_ENV !== 'production') {
  console.log('🔐 Auth Configuration:')
  console.log(`   Email/Password: Enabled`)
  console.log(`   Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Enabled' : 'Disabled'}`)
  console.log(`   Available Providers: ${getAuthProviders().map(p => p.name || p.id).join(', ')}`)
}
