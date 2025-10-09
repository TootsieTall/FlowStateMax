import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { FlowSessionView } from '@/components/FlowSessionView'
import { prisma } from '@/lib/prisma'

export default async function FlowPage() {
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

