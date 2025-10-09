import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const errors: string[] = []
    let redirectTo: string | undefined

    // 1. Check for Flow Zone locations
    const locationCount = await prisma.flowLocation.count({
      where: {
        userId: session.user.id,
        enabled: true,
      },
    })

    if (locationCount === 0) {
      errors.push('No Flow Zone locations configured')
      redirectTo = '/onboarding/locations'
    }

    // 2. Check for blocked apps
    if (!redirectTo) {
      const blockedAppCount = await prisma.blockedApp.count({
        where: {
          userId: session.user.id,
          enabled: true,
        },
      })

      if (blockedAppCount === 0) {
        errors.push('No blocked apps configured')
        redirectTo = '/onboarding/blocked-apps'
      }
    }

    // 3. Check for ritual setup
    if (!redirectTo) {
      const ritualItemCount = await prisma.ritualItem.count({
        where: {
          userId: session.user.id,
        },
      })

      if (ritualItemCount === 0) {
        errors.push('Ritual not configured')
        redirectTo = '/onboarding/ritual'
      }
    }

    // 4. Check for current deep work time block
    if (!redirectTo) {
      const now = new Date()
      const currentTimeBlock = await prisma.timeBlock.findFirst({
        where: {
          userId: session.user.id,
          startTime: { lte: now },
          endTime: { gte: now },
          type: 'DEEP_WORK',
        },
      })

      if (!currentTimeBlock) {
        errors.push('No active Deep Work time block scheduled')
        // Don't redirect, show modal to create one
      }
    }

    // 5. Check for active session
    if (!redirectTo) {
      const activeSession = await prisma.flowSession.findFirst({
        where: {
          userId: session.user.id,
          endTime: null,
        },
      })

      if (activeSession) {
        errors.push('Flow session already in progress')
        // This is handled differently - show Resume instead
      }
    }

    return NextResponse.json({
      isValid: errors.length === 0,
      errors,
      redirectTo,
    })
  } catch (error) {
    console.error('Error validating flow prerequisites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
