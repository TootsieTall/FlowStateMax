type AIProvider = 'claude' | 'openai' | 'mock'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function generateAIResponse(
  messages: AIMessage[],
  provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'mock'
): Promise<string> {
  if (provider === 'mock' || !process.env.ENABLE_AI_FEATURES) {
    return getMockResponse(messages[messages.length - 1]?.content || '')
  }

  // Real AI implementation would go here
  return getMockResponse(messages[messages.length - 1]?.content || '')
}

function getMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase()
  
  if (lower.includes('deadline') || lower.includes('break down')) {
    return JSON.stringify({
      chunks: [
        { title: 'Research & Planning', duration: '2h', day: 'Monday' },
        { title: 'Draft Content', duration: '3h', day: 'Tuesday' },
        { title: 'Review & Revise', duration: '2h', day: 'Wednesday' },
      ],
    })
  }
  
  if (lower.includes('schedule') || lower.includes('tomorrow') || lower.includes('friday')) {
    const match = prompt.match(/(\d{1,2})(am|pm)?/)
    const time = match ? match[0] : '09:00'
    
    return JSON.stringify({
      action: 'schedule',
      time: time,
      date: lower.includes('tomorrow') ? 'tomorrow' : lower.includes('friday') ? 'friday' : 'today',
    })
  }
  
  return 'I can help you with that! Let me know more details.'
}
