import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { TodayView } from '@/components/TodayView'
import { prisma } from '@/lib/prisma'

// Dev mock user — used only when devBypass cookie is set and DEV_MODE is true
const DEV_MOCK_USER = {
  id: 'dev-bypass-user',
  name: 'Dev User',
  email: 'dev@daybreak.local',
  onboardingComplete: true,
  goals: ['Ship features', 'Stay focused'],
  podcastGenres: [],
  dailyGoals: [],
  ritualCompletionCount: 0,
  locationConfirmationCount: 0,
}

export default async function TodayPage() {
  // DEV BYPASS: skip auth when dev_bypass cookie is set
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    const cookieStore = cookies()
    if (cookieStore.get('dev_bypass')?.value === 'true') {
      return (
        <TodayView
          user={DEV_MOCK_USER}
          blocks={[]}
          dailyGoals={DEV_MOCK_USER.goals}
        />
      )
    }
  }

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/onboarding')
  }

  // Fetch or create user data
  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      dailyGoals: {
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
        take: 1,
      },
    },
  }).catch((error) => {
    console.error('Error fetching user:', error)
    return null
  })

  // If user doesn't exist in DB, create them (this should rarely happen in production)
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: session.user.id,
        email: session.user.email || `user-${session.user.id}@flowstate.app`,
        name: session.user.name || 'User',
        onboardingComplete: false, // Changed from true - they should go through onboarding
        goals: [],
        podcastGenres: [],
      },
      include: {
        dailyGoals: true,
      },
    }).catch((error) => {
      console.error('Error creating user:', error)
      return null
    })
  }

  // Check if user needs to complete onboarding
  if (!user?.onboardingComplete) {
    redirect('/onboarding')
  }

  // Fetch today's time blocks
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  const blocks = await prisma.timeBlock.findMany({
    where: {
      userId: session.user.id,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      startTime: 'asc',
    },
    include: {
      task: true,
    },
  }).catch((error) => {
    console.error('Error fetching blocks:', error)
    return []
  })

  return (
    <TodayView
      user={user}
      blocks={blocks}
      dailyGoals={user?.dailyGoals[0]?.goals || []}
    />
  )
}