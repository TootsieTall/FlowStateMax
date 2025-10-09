import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateAIResponse } from '@/lib/ai';

/**
 * POST /api/ai/brainstorm
 * AI thinking partner for brainstorming and problem-solving
 * 
 * This endpoint provides an interactive AI assistant to help users:
 * - Think through complex problems
 * - Generate creative ideas
 * - Break down ambiguous tasks
 * - Plan approaches to challenges
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, context, conversationHistory } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Build conversation context
    const messages = [];

    // System message to set AI behavior
    messages.push({
      role: 'user' as const,
      content: `You are a thoughtful productivity assistant helping with deep work and creative problem-solving. 
      
Your role is to:
1. Ask clarifying questions when needed
2. Break down complex problems into manageable steps
3. Suggest creative approaches and alternatives
4. Help identify potential blockers or dependencies
5. Encourage deep thinking and focus

Be concise but insightful. Prioritize actionable advice over general platitudes.`,
    });

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory);
    }

    // Add current prompt with context
    let fullPrompt = prompt;
    if (context) {
      fullPrompt = `Context: ${context}\n\nUser: ${prompt}`;
    }

    messages.push({
      role: 'user' as const,
      content: fullPrompt,
    });

    // Get AI response
    const aiResponse = await generateAIResponse(messages);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Brainstorm error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/brainstorm/prompts
 * Get suggested brainstorming prompts to help users get started
 */
export async function GET(req: NextRequest) {
  const prompts = [
    {
      category: 'Problem Solving',
      prompts: [
        "I'm stuck on [problem]. What approaches could I try?",
        "How would you break down [complex task] into smaller steps?",
        "What am I not considering about [situation]?",
      ],
    },
    {
      category: 'Creative Thinking',
      prompts: [
        "Help me brainstorm ideas for [project]",
        "What are some unconventional approaches to [goal]?",
        "How could I make [task] more interesting or effective?",
      ],
    },
    {
      category: 'Planning',
      prompts: [
        "What should I prioritize for [project]?",
        "Help me create a plan to achieve [goal] by [deadline]",
        "What dependencies should I consider for [task]?",
      ],
    },
    {
      category: 'Decision Making',
      prompts: [
        "I'm deciding between [option A] and [option B]. What factors should I consider?",
        "What are the pros and cons of [approach]?",
        "How do I evaluate which [option] is best?",
      ],
    },
    {
      category: 'Deep Work',
      prompts: [
        "How can I get into flow state for [type of work]?",
        "What's causing my distraction during [activity]?",
        "How can I structure my day for maximum deep work?",
      ],
    },
  ];

  return NextResponse.json({
    success: true,
    prompts,
  });
}

