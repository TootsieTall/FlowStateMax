import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      redirect('/onboarding')
    }
    
    // Check if user has completed onboarding
    // For now, always redirect to today view
    redirect('/today')
  } catch (error) {
    console.error('Error in Home component:', error)
    // If there's an error with auth, redirect to onboarding
    redirect('/onboarding')
  }
}