import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { date, goals } = body

    // Upsert daily goal
    const dailyGoal = await prisma.dailyGoal.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: new Date(date),
        },
      },
      update: {
        goals,
      },
      create: {
        userId: session.user.id,
        date: new Date(date),
        goals,
      },
    })

    return NextResponse.json(dailyGoal)
  } catch (error) {
    console.error('Error saving daily goals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (date) {
      const goal = await prisma.dailyGoal.findUnique({
        where: {
          userId_date: {
            userId: session.user.id,
            date: new Date(date),
          },
        },
      })
      return NextResponse.json(goal)
    }

    // Get recent goals
    const goals = await prisma.dailyGoal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
      take: 7,
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}