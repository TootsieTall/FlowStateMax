import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/onboarding')
  }
  
  // Check if user has completed onboarding
  // For now, always redirect to today view
  redirect('/today')
}