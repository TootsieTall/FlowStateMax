import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { FlowSessionView } from '@/components/FlowSessionView'
import { prisma } from '@/lib/prisma'

const DEV_MOCK_SESSION = {
  id: 'dev-session-1',
  userId: 'dev-bypass-user',
  startTime: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
  endTime: null,
  duration: null,
  locationId: null,
  feedback: null,
  monochromeOn: false,
  appsBlocked: false,
  musicPlayed: false,
  ritualCompleted: true,
  locationConfirmed: true,
  originalDuration: 90,
  extendedDuration: 0,
  createdAt: new Date(Date.now() - 25 * 60 * 1000),
  blockBreaks: [],
}

const DEV_MOCK_USER = {
  id: 'dev-bypass-user',
  name: 'Dev User',
  email: 'dev@daybreak.local',
}

export default async function FlowPage() {
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    const cookieStore = cookies()
    if (cookieStore.get('dev_bypass')?.value === 'true') {
      return (
        <FlowSessionView
          session={DEV_MOCK_SESSION as any}
          timeBlock={null}
          user={DEV_MOCK_USER as any}
        />
      )
    }
  }

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/onboarding')
  }

  // Fetch active session
  const activeSession = await prisma.flowSession.findFirst({
    where: {
      userId: session.user.id,
      endTime: null,
    },
    orderBy: {
      startTime: 'desc',
    },
  }).catch(() => null)

  // If no active session, redirect to today view
  if (!activeSession) {
    redirect('/today')
  }

  // Find associated time block
  const timeBlock = await prisma.timeBlock.findFirst({
    where: {
      userId: session.user.id,
      startTime: { lte: activeSession.startTime },
      endTime: { gte: activeSession.startTime },
      type: 'DEEP_WORK',
    },
    include: {
      task: true,
    },
  }).catch(() => null)

  return (
    <FlowSessionView
      session={activeSession}
      timeBlock={timeBlock}
      user={session.user}
    />
  )
}

