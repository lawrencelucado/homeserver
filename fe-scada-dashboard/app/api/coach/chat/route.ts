import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/coach/chat - Send message to AI coach
export async function POST(request: NextRequest) {
  try {
    const { message, stats } = await request.json()

    // Save user message
    await prisma.coachConversation.create({
      data: {
        role: 'user',
        content: message,
        context: stats ? JSON.stringify(stats) : null,
      },
    })

    // Generate AI response
    const response = await generateAIResponse(message, stats)

    // Save assistant response
    await prisma.coachConversation.create({
      data: {
        role: 'assistant',
        content: response,
      },
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

async function generateAIResponse(message: string, stats: any): Promise<string> {
  const lowerMessage = message.toLowerCase()

  // Check for OpenAI API key in environment
  const openaiKey = process.env.OPENAI_API_KEY

  if (openaiKey) {
    return await generateOpenAIResponse(message, stats, openaiKey)
  }

  // Check for Ollama (local LLM)
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
  try {
    return await generateOllamaResponse(message, stats, ollamaUrl)
  } catch (error) {
    console.log('Ollama not available, falling back to rule-based coach')
  }

  // Fallback: Rule-based responses
  return generateRuleBasedResponse(message, stats)
}

async function generateOpenAIResponse(message: string, stats: any, apiKey: string): Promise<string> {
  try {
    const systemPrompt = buildSystemPrompt(stats)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API error')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenAI error:', error)
    return generateRuleBasedResponse(message, stats)
  }
}

async function generateOllamaResponse(message: string, stats: any, ollamaUrl: string): Promise<string> {
  const systemPrompt = buildSystemPrompt(stats)

  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error('Ollama not available')
  }

  const data = await response.json()
  return data.response
}

function buildSystemPrompt(stats: any): string {
  let prompt = `You are an expert AI study coach specializing in FE Civil exam preparation and SCADA engineering. Your role is to help students study more effectively.

**Student Stats:**
${stats ? `
- Total study hours: ${stats.totalHours}h (FE: ${stats.feHours}h, SCADA: ${stats.scadaHours}h)
- Average accuracy: ${stats.avgAccuracy}%
- Weak topics: ${stats.weakTopics.join(', ') || 'None identified yet'}
- Recent sessions (7 days): ${stats.recentSessions}
` : 'No study data available yet.'}

**Your capabilities:**
- Identify weak topics from practice test performance
- Generate custom flashcards for any concept
- Suggest specific practice problems
- Explain FE Civil and SCADA concepts simply
- Create personalized study schedules
- Motivate and encourage students

**Guidelines:**
- Be encouraging and supportive
- Give specific, actionable advice
- Use the student's stats to personalize responses
- Keep answers concise (2-4 sentences unless explaining a concept)
- Focus on Learn → Apply → Reinforce methodology
- Recommend 25-minute Pomodoro sessions

Respond helpfully to the student's question.`

  return prompt
}

function generateRuleBasedResponse(message: string, stats: any): string {
  const lowerMessage = message.toLowerCase()

  // Weak topics
  if (lowerMessage.includes('weak') || lowerMessage.includes('struggle') || lowerMessage.includes('what should i study')) {
    if (stats && stats.weakTopics && stats.weakTopics.length > 0) {
      const topic = stats.weakTopics[0]
      return `Based on your practice history, you should focus on **${topic}**. Here's my recommendation:

1. **Learn** (30 min): Review fundamentals using THIEVES method
2. **Apply** (45 min): Solve 15-20 practice problems
3. **Reinforce** (15 min): Create flashcards for key concepts

Start with a 25-minute Pomodoro session on ${topic} today!`
    }
    return `You're doing great! To identify weak topics, complete some practice problems and track your accuracy. Once I see your performance data, I can give you personalized recommendations.

In the meantime, focus on the Learn → Apply → Reinforce cycle for any topic you're currently studying.`
  }

  // Flashcards
  if (lowerMessage.includes('flashcard') || lowerMessage.includes('flash card')) {
    const topic = extractTopic(lowerMessage)
    return `Great idea! Here are 3 flashcards for ${topic || 'your current topic'}:

**Card 1:**
Front: What is the formula for stress?
Back: σ = F/A (stress = force / area)

**Card 2:**
Front: Define factor of safety
Back: FOS = Ultimate Strength / Allowable Stress

**Card 3:**
Front: What are the 3 equilibrium equations in 2D?
Back: ΣFx = 0, ΣFy = 0, ΣM = 0

Add these to your Leitner system and review using the 2-3-5-7 day spacing!`
  }

  // Practice problems
  if (lowerMessage.includes('practice') || lowerMessage.includes('problem') || lowerMessage.includes('question')) {
    const topic = extractTopic(lowerMessage)
    return `For ${topic || 'your current topic'}, try these practice strategies:

1. **NCEES Practice Exam** - Most realistic problems
2. **PPI Question Bank** - Organized by topic
3. **YouTube** - Gregory Michaelson has great FE Civil walkthroughs

**Study tip:** Do 20 timed questions, then spend 30 minutes reviewing every wrong answer. Understanding WHY you got it wrong is more valuable than getting it right!

Track your accuracy in the dashboard so I can give you better recommendations.`
  }

  // Explain concept
  if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('how do')) {
    return `I'd be happy to explain that concept!

For the best explanation, I recommend:
1. Use the **THIEVES** method to pre-read the textbook section
2. Watch a 10-minute YouTube video on the topic
3. Try 3-5 practice problems
4. Use the **Feynman technique** - explain it to me in simple words

Then ask me specific questions about what you're struggling with, and I can help clarify!`
  }

  // Study schedule
  if (lowerMessage.includes('schedule') || lowerMessage.includes('plan') || lowerMessage.includes('how long')) {
    return `Based on your ${stats?.totalHours || 0} hours studied, here's your optimal schedule:

**Daily (2 hours):**
- Morning: 1 hour FE practice problems
- Evening: 1 hour SCADA lab work

**Weekly breakdown:**
- FE: 6-8 hours (60% of time)
- SCADA: 4-6 hours (40% of time)
- Track in dashboard: 12 hours/week goal

**Session structure:**
- 25 min Focus → 5 min Break (Pomodoro)
- Use Live Session Tracker to auto-log hours!

You're ${stats?.totalHours >= 20 ? 'on track!' : 'just getting started - consistency is key!'}`
  }

  // Motivation
  if (lowerMessage.includes('motivat') || lowerMessage.includes('tired') || lowerMessage.includes('hard')) {
    return `I hear you - FE Civil prep is challenging! Remember:

🎯 **You're not alone** - Thousands pass the FE every year
📈 **Progress > Perfection** - Small daily wins compound
🔥 **${stats?.recentSessions || 0} sessions this week** - You're building momentum!
💪 **Every problem you solve** - Makes the next one easier

**Quick win:** Do just ONE 25-minute Pomodoro session today. Start small, build consistency. You've got this! 🚀`
  }

  // Default helpful response
  return `I'm here to help with your FE Civil and SCADA studies! I can:

📚 **Identify weak topics** from your practice tests
✨ **Generate flashcards** for any concept
🎯 **Suggest practice problems** based on your gaps
💡 **Explain concepts** in simple terms
📅 **Create study schedules** personalized to you

What would be most helpful right now?`
}

function extractTopic(message: string): string {
  const topics = [
    'statics', 'dynamics', 'mechanics of materials', 'materials',
    'fluid mechanics', 'fluids', 'thermodynamics', 'thermo',
    'circuits', 'electronics', 'math', 'statistics', 'probability',
    'surveying', 'geotechnical', 'structural', 'transportation',
    'environmental', 'water resources', 'ethics',
    'scada', 'plc', 'hmi', 'sensors', 'control', 'pid', 'modbus', 'opc'
  ]

  for (const topic of topics) {
    if (message.toLowerCase().includes(topic)) {
      return topic.charAt(0).toUpperCase() + topic.slice(1)
    }
  }

  return 'your chosen topic'
}
