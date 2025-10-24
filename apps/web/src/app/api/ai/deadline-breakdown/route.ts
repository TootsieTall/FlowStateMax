import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateAIResponse } from '@/lib/ai';

export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/deadline-breakdown
 * Break down a task with a deadline into smaller time blocks
 * 
 * This helps users plan out large projects by suggesting:
 * - Specific subtasks
 * - Recommended durations for each
 * - Suggested days/times
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, deadline } = await req.json();

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the task
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Calculate days until deadline
    const deadlineDate = deadline ? new Date(deadline) : task.deadline;
    if (!deadlineDate) {
      return NextResponse.json(
        { error: 'No deadline specified' },
        { status: 400 }
      );
    }

    const now = new Date();
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Use AI to break down the task
    const prompt = `You are a productivity assistant helping break down a large task into manageable time blocks.

Task: ${task.title}
Description: ${task.description || 'No additional details'}
Deadline: ${deadlineDate.toLocaleDateString()} (${daysUntil} days from now)

Break this down into 3-5 focused work blocks. For each block, suggest:
1. A specific subtask title
2. Recommended duration (in hours, like "2h", "3h", "1.5h")
3. Which day it should be done (relative to today, like "Today", "Tomorrow", "Monday", etc.)
4. A brief description of what to accomplish

Return a JSON object with this structure:
{
  "blocks": [
    {
      "title": string,
      "description": string,
      "duration": string (e.g., "2h"),
      "suggestedDay": string (e.g., "Monday", "Tomorrow"),
      "type": "DEEP_WORK" | "SHALLOW" | "MEETING"
    }
  ],
  "reasoning": string (brief explanation of the breakdown strategy)
}

Guidelines:
- Start with research/planning, then execution, then review/polish
- Allow buffer time before the deadline
- Suggest DEEP_WORK for focused tasks, SHALLOW for admin/coordination
- Keep durations realistic (1-4 hours per block)
- Space out blocks to avoid burnout

Return only valid JSON, no markdown or extra text.`;

    // Get AI response
    const aiResponse = await generateAIResponse([
      { role: 'user', content: prompt }
    ]);

    // Parse the AI response
    let breakdown;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        breakdown = JSON.parse(jsonMatch[0]);
      } else {
        breakdown = JSON.parse(aiResponse);
      }
    } catch (error) {
      console.error('Failed to parse AI breakdown:', aiResponse);
      // Fallback to basic breakdown
      breakdown = basicBreakdown(task, daysUntil);
    }

    // Create time blocks from the breakdown
    const createdBlocks = [];
    const today = new Date();
    today.setHours(9, 0, 0, 0); // Default start at 9 AM

    for (let i = 0; i < breakdown.blocks.length; i++) {
      const block = breakdown.blocks[i];
      
      // Parse suggested day
      const blockDate = parseSuggestedDay(block.suggestedDay, i);
      
      // Parse duration
      const durationMatch = block.duration.match(/(\d+(?:\.\d+)?)/);
      const hours = durationMatch ? parseFloat(durationMatch[1]) : 2;
      const durationMinutes = hours * 60;

      const startTime = new Date(blockDate);
      startTime.setHours(9 + (i * 3), 0, 0, 0); // Stagger blocks through the day
      
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + durationMinutes);

      // Create the time block
      const timeBlock = await prisma.timeBlock.create({
        data: {
          userId: user.id,
          taskId: task.id,
          title: block.title,
          description: block.description,
          startTime,
          endTime,
          type: block.type || 'DEEP_WORK',
        },
      });

      createdBlocks.push(timeBlock);
    }

    return NextResponse.json({
      success: true,
      blocks: createdBlocks,
      reasoning: breakdown.reasoning,
      message: `Created ${createdBlocks.length} time blocks for: ${task.title}`,
    });
  } catch (error) {
    console.error('Deadline breakdown error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to break down task',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Basic fallback breakdown when AI is unavailable
 */
function basicBreakdown(task: any, daysUntil: number) {
  if (daysUntil <= 2) {
    // Short deadline - compress into 2-3 blocks
    return {
      blocks: [
        {
          title: `Research & Plan: ${task.title}`,
          description: 'Gather information and create an outline',
          duration: '2h',
          suggestedDay: 'Today',
          type: 'DEEP_WORK',
        },
        {
          title: `Execute: ${task.title}`,
          description: 'Main work and implementation',
          duration: '3h',
          suggestedDay: daysUntil > 1 ? 'Tomorrow' : 'Today',
          type: 'DEEP_WORK',
        },
        {
          title: `Review & Finalize: ${task.title}`,
          description: 'Polish and ensure quality',
          duration: '1h',
          suggestedDay: daysUntil > 1 ? 'Tomorrow' : 'Today',
          type: 'SHALLOW',
        },
      ],
      reasoning: 'Short deadline requires focused, compressed schedule',
    };
  } else {
    // Normal deadline - spread across multiple days
    return {
      blocks: [
        {
          title: `Research: ${task.title}`,
          description: 'Initial research and information gathering',
          duration: '2h',
          suggestedDay: 'Today',
          type: 'DEEP_WORK',
        },
        {
          title: `Planning: ${task.title}`,
          description: 'Create outline and approach',
          duration: '1.5h',
          suggestedDay: 'Tomorrow',
          type: 'DEEP_WORK',
        },
        {
          title: `Main Work: ${task.title}`,
          description: 'Primary execution and development',
          duration: '4h',
          suggestedDay: Math.floor(daysUntil / 2) + ' days',
          type: 'DEEP_WORK',
        },
        {
          title: `Review: ${task.title}`,
          description: 'Review, revise, and improve',
          duration: '2h',
          suggestedDay: (daysUntil - 2) + ' days',
          type: 'DEEP_WORK',
        },
        {
          title: `Final Polish: ${task.title}`,
          description: 'Final touches and quality check',
          duration: '1h',
          suggestedDay: (daysUntil - 1) + ' days',
          type: 'SHALLOW',
        },
      ],
      reasoning: 'Balanced breakdown with research, execution, and review phases',
    };
  }
}

/**
 * Parse suggested day string into a Date object
 */
function parseSuggestedDay(dayStr: string, index: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lower = dayStr.toLowerCase();

  if (lower.includes('today')) {
    return today;
  }

  if (lower.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }

  // Check for day of week
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = days.findIndex(d => lower.includes(d));
  
  if (dayIndex !== -1) {
    const currentDay = today.getDay();
    let daysUntil = dayIndex - currentDay;
    if (daysUntil <= 0) daysUntil += 7; // Next occurrence
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntil);
    return targetDate;
  }

  // Check for "X days"
  const daysMatch = dayStr.match(/(\d+)\s*days?/);
  if (daysMatch) {
    const daysAhead = parseInt(daysMatch[1]);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysAhead);
    return targetDate;
  }

  // Default: space blocks 1-2 days apart
  const defaultDate = new Date(today);
  defaultDate.setDate(today.getDate() + (index * 2));
  return defaultDate;
}


