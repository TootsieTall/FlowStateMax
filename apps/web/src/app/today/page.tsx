import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TodayView } from '@/components/TodayView'
import { prisma } from '@/lib/prisma'

export default async function TodayPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/onboarding')
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
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
  })

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
  })

  return (
    <TodayView
      user={user}
      blocks={blocks}
      dailyGoals={user?.dailyGoals[0]?.goals || []}
    />
  )
}