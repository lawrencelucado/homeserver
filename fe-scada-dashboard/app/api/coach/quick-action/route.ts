import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/coach/quick-action - Handle quick action buttons
export async function POST(request: NextRequest) {
  try {
    const { action, stats } = await request.json()

    let response = ''

    switch (action) {
      case 'weak_topics':
        response = await handleWeakTopics(stats)
        break
      case 'generate_flashcards':
        response = await handleGenerateFlashcards(stats)
        break
      case 'practice_problems':
        response = await handlePracticeProblems(stats)
        break
      case 'study_tip':
        response = handleStudyTip()
        break
      default:
        response = "I'm not sure how to help with that. Try asking me a question!"
    }

    // Save to conversation history
    await prisma.coachConversation.create({
      data: {
        role: 'assistant',
        content: response,
      },
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Quick action error:', error)
    return NextResponse.json(
      { error: 'Failed to process quick action' },
      { status: 500 }
    )
  }
}

async function handleWeakTopics(stats: any): Promise<string> {
  if (!stats || !stats.weakTopics || stats.weakTopics.length === 0) {
    return `Great news! You don't have any identified weak topics yet.

To help me identify areas where you need improvement:
1. Track your practice test performance
2. Log your accuracy percentage
3. Complete a few study sessions

Once I have data, I'll give you personalized topic recommendations!`
  }

  const topTopic = stats.weakTopics[0]

  return `🎯 **Your #1 priority: ${topTopic}**

**Action plan (90 minutes):**

**Learn** (30 min):
- Review fundamentals in NCEES reference handbook
- Watch one YouTube tutorial
- Create a mind map of key concepts

**Apply** (45 min):
- Solve 20 practice problems
- Time yourself: 1.5 min/problem average
- Mark incorrect answers for review

**Reinforce** (15 min):
- Add 5 flashcards to Leitner system
- Summarize in 3-5 sentences
- Schedule review for tomorrow

**Next weak topics:** ${stats.weakTopics.slice(1, 3).join(', ') || 'None - great work!'}

Start a Live Session now and tackle ${topTopic}! 💪`
}

async function handleGenerateFlashcards(stats: any): Promise<string> {
  // In a real implementation, this would use AI to generate flashcards
  // For now, provide templates

  const templates = [
    {
      front: "What are the three equilibrium equations in 2D statics?",
      back: "ΣFx = 0, ΣFy = 0, ΣM = 0",
    },
    {
      front: "Define stress and give its units",
      back: "Stress σ = F/A (force/area), Units: Pa or psi",
    },
    {
      front: "What is Bernoulli's equation?",
      back: "P + ½ρv² + ρgh = constant (along streamline)",
    },
    {
      front: "What does PID stand for in control systems?",
      back: "Proportional-Integral-Derivative controller",
    },
    {
      front: "What is the typical 4-20 mA signal range used for?",
      back: "Industrial standard for analog sensor signals (0% = 4mA, 100% = 20mA)",
    },
  ]

  const cards = templates.slice(0, 3)

  let response = `✨ **Auto-generated flashcards** (based on common FE/SCADA topics):\n\n`

  cards.forEach((card, idx) => {
    response += `**Card ${idx + 1}:**\n`
    response += `*Front:* ${card.front}\n`
    response += `*Back:* ${card.back}\n\n`
  })

  response += `**How to use:**\n`
  response += `1. Add to your Leitner box system (start in Box 1)\n`
  response += `2. Review using 2-3-5-7 day spacing\n`
  response += `3. Move to next box when you can recall instantly\n\n`
  response += `Want cards for a specific topic? Ask me: "Generate flashcards for [topic]"`

  return response
}

async function handlePracticeProblems(stats: any): Promise<string> {
  const accuracy = stats?.avgAccuracy || 0

  let difficulty = 'mixed'
  if (accuracy < 50) difficulty = 'fundamentals'
  else if (accuracy < 70) difficulty = 'intermediate'
  else if (accuracy >= 80) difficulty = 'challenging'

  return `📚 **Practice problem recommendations** (${difficulty} level):

**For FE Civil:**
1. **NCEES Practice Exam** - 110 questions, most realistic
   - Focus on: ${stats?.weakTopics?.[0] || 'Statics & Mechanics'}
   - Target: 70%+ accuracy before exam

2. **PPI Practice Problems** - Topic-specific
   - Do 20 questions per session
   - Review ALL incorrect answers

3. **YouTube Channels:**
   - Gregory Michaelson (FE Civil walkthroughs)
   - Engineer4Free (concept reviews)

**For SCADA:**
1. Practice PLC ladder logic on paper
2. Build simple HMI screens in free software
3. Calculate 4-20 mA scaling problems

**Study strategy:**
- ${accuracy < 70 ? 'Focus on getting fundamentals right first' : 'Mix easy and hard problems 60/40'}
- Time yourself: ${accuracy < 60 ? '2-3 min/problem' : '1.5 min/problem'}
- Track accuracy in dashboard → I'll adjust recommendations

Start a 45-minute session and do 20 problems! 🎯`
}

function handleStudyTip(): string {
  const tips = [
    `💡 **The Feynman Technique:**

Can't explain a concept in simple words? You don't really understand it.

**Try this:**
1. Pick a concept (e.g., "shear stress")
2. Explain it to a 10-year-old (out loud!)
3. Notice where you struggle
4. Go back and re-learn those parts

Works amazingly well for FE Civil equations!`,

    `💡 **The 2-3-5-7 Spacing Rule:**

Cramming doesn't work. Spaced repetition does.

**Flashcard schedule:**
- Learn today → Review in 2 days
- Got it right? → Review in 3 days
- Got it again? → Review in 5 days
- Still got it? → Review in 7 days

Your brain needs time to consolidate!`,

    `💡 **The THIEVES Method:**

Speed-read textbook chapters in 10 minutes:
- **T**itle - What's the big idea?
- **H**eadings - What are the sections?
- **I**ntroduction - Why does this matter?
- **E**very first sentence - Main points
- **V**isuals - What do diagrams show?
- **E**nd questions - What should I know?
- **S**ummary - Key takeaways

Do this BEFORE deep reading. Game changer!`,

    `💡 **The Pomodoro Power Hour:**

Brain gets tired after 25 minutes. Use it!

**Structure:**
- 25 min: Intense focus (one task only)
- 5 min: Break (walk, water, stretch)
- Repeat 4 times
- Take 15-30 min long break

Use the Live Session Tracker for automatic timing!`,

    `💡 **The Error Log Strategy:**

Wrong answers are GOLD. Don't waste them!

**After practice tests:**
1. Mark every wrong answer
2. Write WHY you got it wrong
3. Find the concept gap
4. Make a flashcard
5. Review in 2 days

You'll never make the same mistake twice!`,
  ]

  return tips[Math.floor(Math.random() * tips.length)]
}
