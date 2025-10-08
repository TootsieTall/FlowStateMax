import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Development-friendly auth config
// TODO: Set up Google OAuth and database when ready for production
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Development Login',
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Enter any name" }
      },
      async authorize(credentials) {
        // For development, accept any name and create a demo user
        if (credentials?.name) {
          return {
            id: '1',
            name: credentials.name,
            email: 'demo@flowstate.app',
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/onboarding',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}