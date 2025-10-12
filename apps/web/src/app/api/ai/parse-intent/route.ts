import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai';

/**
 * POST /api/ai/parse-intent
 * Parse natural language input into structured task data
 * 
 * Examples:
 * - "Finish project proposal by Friday" → { type: 'task', title: 'Finish project proposal', deadline: '2024-10-13', impact: 'HIGH' }
 * - "Call Mom tomorrow at 2pm" → { type: 'schedule', title: 'Call Mom', scheduledAt: '2024-10-10T14:00:00' }
 * - "Research competitors" → { type: 'task', title: 'Research competitors', impact: 'LOW' }
 */
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use AI to parse the intent
    const prompt = `You are a helpful assistant that parses natural language input into structured task data.

Analyze this input and return a JSON object with the following structure:
{
  "type": "task" | "note" | "schedule",
  "title": string (concise title, max 100 chars),
  "description": string (optional, full context),
  "deadline": ISO date string (if mentioned),
  "scheduledAt": ISO date/time string (for scheduled items),
  "impact": "HIGH" | "LOW" (HIGH if urgent/important, LOW otherwise),
  "suggestedBlocks": array of { title, duration, day } (if the task is large and could be broken down)
}

Rules:
- Extract deadlines from phrases like "by Friday", "next week", "tomorrow"
- Identify scheduled times like "at 2pm", "tomorrow morning"
- Determine if it's a task (action item), note (reference/info), or schedule (calendar event)
- Suggest HIGH impact for urgent/important tasks, LOW for nice-to-haves
- If the task seems large (multi-day), suggest a breakdown

User input: "${text}"

Return only valid JSON, no markdown or extra text.`;

    // Get AI response
    const aiResponse = await generateAIResponse([
      { role: 'user', content: prompt }
    ]);

    // Parse the AI response
    let parsed;
    try {
      // Extract JSON from response (in case AI adds markdown)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(aiResponse);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback to basic parsing
      parsed = basicParse(text);
    }

    // Normalize dates
    if (parsed.deadline) {
      parsed.deadline = normalizeDateString(parsed.deadline);
    }
    if (parsed.scheduledAt) {
      parsed.scheduledAt = normalizeDateString(parsed.scheduledAt);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Parse intent error:', error);
    
    // Fallback to basic parsing on error
    const { text } = await req.json();
    const fallback = basicParse(text);
    
    return NextResponse.json(fallback);
  }
}

/**
 * Basic fallback parser when AI is unavailable
 */
function basicParse(text: string): any {
  const lower = text.toLowerCase();
  
  // Detect type
  let type: 'task' | 'note' | 'schedule' = 'task';
  if (lower.includes('note:') || lower.includes('remember:')) {
    type = 'note';
  } else if (lower.includes(' at ') && /\d{1,2}(:\d{2})?\s*(am|pm)/.test(lower)) {
    type = 'schedule';
  }

  // Extract title (first line or first 100 chars)
  const title = text.split('\n')[0].slice(0, 100);

  // Detect deadline
  let deadline: string | undefined;
  const deadlinePatterns = [
    /by\s+(\w+day)/i,  // by Friday
    /by\s+(next|this)\s+(\w+)/i,  // by next week
    /due\s+(\w+day)/i,  // due Monday
    /before\s+(\w+day)/i,  // before Tuesday
  ];

  for (const pattern of deadlinePatterns) {
    const match = text.match(pattern);
    if (match) {
      deadline = parseDateReference(match[1] + (match[2] ? ' ' + match[2] : ''));
      break;
    }
  }

  // Detect scheduled time
  let scheduledAt: string | undefined;
  const timeMatch = text.match(/(?:at|@)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  const dayMatch = text.match(/(tomorrow|today|next\s+\w+day|\w+day)/i);
  
  if (timeMatch) {
    const timeStr = timeMatch[1];
    const dayStr = dayMatch ? dayMatch[1] : 'today';
    scheduledAt = parseScheduledTime(dayStr, timeStr);
  }

  // Determine impact
  const impact = hasHighImpactKeywords(text) ? 'HIGH' : 'LOW';

  // Check if task should be broken down
  const suggestedBlocks = shouldBreakdown(text) ? [
    { title: 'Phase 1', duration: '2h', day: 'This week' },
    { title: 'Phase 2', duration: '2h', day: 'Next week' },
  ] : undefined;

  return {
    type,
    title,
    description: text,
    deadline,
    scheduledAt,
    impact,
    suggestedBlocks,
  };
}

/**
 * Parse date references like "Friday", "next week"
 */
function parseDateReference(ref: string): string {
  const now = new Date();
  const lower = ref.toLowerCase();

  // Days of week
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = days.findIndex(d => lower.includes(d));
  
  if (dayIndex !== -1) {
    const currentDay = now.getDay();
    let daysUntil = dayIndex - currentDay;
    if (daysUntil <= 0) daysUntil += 7; // Next occurrence
    
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysUntil);
    return targetDate.toISOString();
  }

  // Relative dates
  if (lower.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow.toISOString();
  }

  if (lower.includes('next week')) {
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    return nextWeek.toISOString();
  }

  // Default to 7 days from now
  const future = new Date(now);
  future.setDate(now.getDate() + 7);
  return future.toISOString();
}

/**
 * Parse scheduled time like "tomorrow at 2pm"
 */
function parseScheduledTime(day: string, time: string): string {
  const baseDate = new Date();
  
  // Parse day
  if (day.toLowerCase().includes('tomorrow')) {
    baseDate.setDate(baseDate.getDate() + 1);
  } else if (day.toLowerCase().includes('today')) {
    // Keep today
  } else {
    // Try to parse as day of week
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = days.findIndex(d => day.toLowerCase().includes(d));
    if (dayIndex !== -1) {
      const currentDay = baseDate.getDay();
      let daysUntil = dayIndex - currentDay;
      if (daysUntil <= 0) daysUntil += 7;
      baseDate.setDate(baseDate.getDate() + daysUntil);
    }
  }

  // Parse time
  const timeMatch = time.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();

    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;

    baseDate.setHours(hours, minutes, 0, 0);
  }

  return baseDate.toISOString();
}

/**
 * Check if text contains high-impact keywords
 */
function hasHighImpactKeywords(text: string): boolean {
  const keywords = [
    'urgent', 'important', 'asap', 'critical', 'deadline',
    'priority', 'must', 'need to', 'have to', 'by tomorrow'
  ];
  const lower = text.toLowerCase();
  return keywords.some(keyword => lower.includes(keyword));
}

/**
 * Determine if task should be broken down into blocks
 */
function shouldBreakdown(text: string): boolean {
  const lower = text.toLowerCase();
  const breakdownKeywords = [
    'project', 'proposal', 'report', 'presentation',
    'research', 'develop', 'build', 'create', 'design'
  ];
  
  return breakdownKeywords.some(keyword => lower.includes(keyword)) &&
         (lower.includes('by ') || lower.includes('due '));
}

/**
 * Normalize date string to ISO format
 */
function normalizeDateString(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    // Invalid date
  }
  return dateStr;
}


