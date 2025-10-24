import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { quickCaptureSchema } from '@flowstate/core';

export const dynamic = 'force-dynamic'

/**
 * POST /api/quick-capture
 * Create a task, note, or scheduled item from quick capture input
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = quickCaptureSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { text, type } = validation.data;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse the text to extract details using AI
    let parsedIntent;
    try {
      const parseResponse = await fetch(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/ai/parse-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        }
      );

      if (parseResponse.ok) {
        parsedIntent = await parseResponse.json();
      }
    } catch (error) {
      console.error('Failed to parse intent:', error);
      // Continue without AI parsing
    }

    // Create based on type
    if (type === 'task') {
      const task = await prisma.task.create({
        data: {
          userId: user.id,
          title: parsedIntent?.title || text.slice(0, 100),
          description: parsedIntent?.description || text,
          impact: parsedIntent?.impact || 'LOW',
          deadline: parsedIntent?.deadline ? new Date(parsedIntent.deadline) : null,
          scheduledAt: parsedIntent?.scheduledAt ? new Date(parsedIntent.scheduledAt) : null,
        },
      });

      return NextResponse.json({
        success: true,
        task,
        message: 'Task captured successfully',
      });
    } else if (type === 'schedule') {
      // Create a time block for scheduled items
      const scheduledTime = parsedIntent?.scheduledAt
        ? new Date(parsedIntent.scheduledAt)
        : new Date(Date.now() + 86400000); // Default to tomorrow

      const endTime = new Date(scheduledTime.getTime() + 60 * 60 * 1000); // 1 hour default duration

      const block = await prisma.timeBlock.create({
        data: {
          userId: user.id,
          title: parsedIntent?.title || text.slice(0, 100),
          description: parsedIntent?.description || text,
          startTime: scheduledTime,
          endTime: endTime,
          type: 'SHALLOW', // Default type for scheduled items
        },
      });

      return NextResponse.json({
        success: true,
        block,
        message: 'Scheduled successfully',
      });
    } else if (type === 'note') {
      // For notes, we'll just create a task marked as low impact for now
      // In the future, we could add a separate Notes model
      const note = await prisma.task.create({
        data: {
          userId: user.id,
          title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
          description: text,
          impact: 'LOW',
        },
      });

      return NextResponse.json({
        success: true,
        note,
        message: 'Note captured successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid capture type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Quick capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/quick-capture
 * Get recently captured items
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get recent tasks (last 7 days)
    const recentTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      items: recentTasks,
    });
  } catch (error) {
    console.error('Get captured items error:', error);
    return NextResponse.json(
      { error: 'Failed to get items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


