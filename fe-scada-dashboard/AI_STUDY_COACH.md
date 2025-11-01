# AI Study Coach

**Your personal AI tutor for FE Civil and SCADA engineering**

---

## 🤖 What is the AI Study Coach?

The AI Study Coach is an intelligent assistant that analyzes your study patterns, identifies weak topics, and provides personalized recommendations to help you pass the FE Civil exam and master SCADA engineering.

### Key Capabilities

- 🎯 **Identify weak topics** from practice test performance
- ✨ **Generate custom flashcards** for any concept
- 📚 **Suggest specific practice problems** based on gaps
- 💡 **Explain complex concepts** in simple terms
- 📅 **Create personalized study schedules**
- 🗣️ **Voice interaction** - ask questions hands-free
- 📊 **Analyze study stats** - data-driven recommendations
- 🧠 **Remember conversations** - continuous learning context

---

## 🚀 Quick Start

### 1. Access the Coach

1. Open your dashboard
2. Click **🤖 AI Coach** tab
3. Start chatting!

### 2. Quick Actions

Try the pre-built buttons:
- **What should I study?** - Get personalized topic recommendations
- **Generate flashcards** - Auto-create study cards
- **Practice problems** - Get problem-solving strategies
- **Study tip** - Random learning technique

### 3. Ask Anything

Example questions:
- "What are my weak topics?"
- "Generate flashcards for Statics"
- "Explain Bernoulli's equation simply"
- "How should I study for the next 2 weeks?"
- "I'm struggling with circuits, help!"

---

## 🎓 AI Providers (3 Options)

### Option 1: OpenAI (Recommended) ⭐

**Pros:**
- Most intelligent responses
- Understands complex engineering concepts
- Best for explanations

**Setup:**
1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env`:
   ```env
   OPENAI_API_KEY="sk-proj-..."
   ```
3. Restart container

**Cost:** ~$0.01-0.05 per conversation (very affordable)

### Option 2: Ollama (Free, Local)

**Pros:**
- Completely free
- Runs on your server
- Privacy - no data sent externally

**Setup:**
1. Install Ollama on your server:
   ```bash
   curl https://ollama.ai/install.sh | sh
   ```

2. Pull a model:
   ```bash
   ollama pull llama2
   ```

3. Add to `.env`:
   ```env
   OLLAMA_URL="http://localhost:11434"
   ```

**Note:** Requires ~8GB RAM for decent models

### Option 3: Rule-Based (Built-in)

**Pros:**
- Always works
- No setup required
- No cost

**Limitations:**
- Pre-programmed responses only
- Can't explain custom concepts
- Less personalized

**When it's used:** Automatically falls back if no AI is configured

---

## 💡 How It Works

### 1. Study Stats Analysis

The coach tracks:
- Total study hours (FE vs SCADA)
- Practice test accuracy
- Recent session count
- Weak topics (from logged performance)
- Session notes and patterns

### 2. Context-Aware Responses

Every conversation includes:
```
You are an expert AI study coach...

Student Stats:
- Total study hours: 15.5h (FE: 10h, SCADA: 5.5h)
- Average accuracy: 72%
- Weak topics: Fluid Mechanics, Thermodynamics
- Recent sessions (7 days): 8

Your task: [your question]
```

### 3. Conversation Memory

- All chats saved to database
- Coach remembers previous questions
- Can reference past conversations
- Clear history anytime with refresh button

---

## 🎯 Use Cases

### Scenario 1: Identify Weak Topics

**You:** "What should I study today?"

**Coach:** "Based on your practice history, you should focus on **Fluid Mechanics**. Here's my recommendation:

1. **Learn** (30 min): Review Bernoulli's equation and continuity
2. **Apply** (45 min): Solve 20 fluid flow problems
3. **Reinforce** (15 min): Create flashcards for key formulas

Start with a 25-minute Pomodoro session now!"

### Scenario 2: Generate Flashcards

**You:** "Generate flashcards for Statics"

**Coach:** "Here are 5 flashcards for Statics:

**Card 1:**
Front: What are the 3 equilibrium equations?
Back: ΣFx = 0, ΣFy = 0, ΣM = 0

[4 more cards...]

Add these to your Leitner system!"

### Scenario 3: Explain Concept

**You:** "Explain shear stress simply"

**Coach:** "Imagine sliding two books across each other. The force making them slide divided by the contact area = shear stress.

Formula: τ = V/A
- τ (tau) = shear stress
- V = shear force
- A = area

Think of it as 'sliding force per unit area' vs normal stress which is 'pushing force per unit area'."

### Scenario 4: Study Schedule

**You:** "I have 3 weeks until the FE exam. Help!"

**Coach:** "3-week intensive plan:

**Week 1: Fundamentals Review**
- 2 hours/day: Weak topics only
- 50 practice questions/day
- Target: 70% accuracy

**Week 2: Practice Intensive**
- 3 hours/day: Mixed problem sets
- Full mock exam on Saturday
- Target: 75% accuracy

**Week 3: Final Prep**
- 2 hours/day: Error log review
- Light practice only
- Rest day before exam

Start Week 1 tomorrow!"

---

## 🗣️ Voice Interaction

### Enable Voice Input

1. Click **🎤** button in chat
2. Grant microphone permission
3. Speak your question
4. Click **Stop** when done

**Supported browsers:**
- ✅ Chrome (Desktop & Android)
- ✅ Edge
- ✅ Safari (iOS 14.5+)
- ❌ Firefox

### Voice Tips

- Speak clearly and naturally
- Pause between sentences
- Say "comma" or "period" for punctuation
- Works great for hands-free studying!

---

## 📊 Quick Actions Explained

### "What should I study?"

Analyzes your weak topics and suggests:
- Highest priority topic
- 90-minute study plan (Learn → Apply → Reinforce)
- Specific resources and problem sets

### "Generate flashcards"

Creates flashcards based on:
- Common FE Civil topics
- SCADA fundamentals
- Your weak areas (if logged)

Returns 3-5 cards ready to add to Leitner system.

### "Practice problems"

Recommends based on your accuracy:
- <50%: Focus on fundamentals
- 50-70%: Mixed difficulty
- 70-80%: Intermediate + some hard
- 80%+: Challenging problems only

### "Study tip"

Random rotation of proven techniques:
- Feynman Technique
- 2-3-5-7 Spacing
- THIEVES Method
- Pomodoro Power Hour
- Error Log Strategy

---

## 🧠 Advanced Features

### Weak Topic Detection

Automatically tracks when you:
1. Log low accuracy on practice tests
2. Spend excessive time on a topic
3. Skip or avoid certain subjects

Updates priority levels (1-5) for recommendations.

### Personalized Recommendations

Based on:
- Study hours (FE vs SCADA balance)
- Time of day patterns
- Session length trends
- Accuracy by topic
- Days since last review

### Conversation Context

Coach knows:
- Your current study phase (early prep vs exam week)
- Topics you've asked about before
- Your learning style preferences
- Motivation level (from conversation tone)

---

## 🛠️ Configuration

### Environment Variables

```env
# Option 1: OpenAI (best quality)
OPENAI_API_KEY="sk-proj-..."

# Option 2: Ollama (free, local)
OLLAMA_URL="http://localhost:11434"

# Leave both blank for rule-based coach
```

### Customizing Prompts

Edit `/app/api/coach/chat/route.ts`:

```typescript
function buildSystemPrompt(stats: any): string {
  return `You are an expert AI study coach...

  [Customize this to match your needs]
  `
}
```

### Adding More Quick Actions

Edit `/app/api/coach/quick-action/route.ts`:

```typescript
case 'my_custom_action':
  response = await handleCustomAction(stats)
  break
```

---

## 📈 Usage Patterns

### Daily Use

**Morning (5 min):**
- Ask: "What should I focus on today?"
- Get personalized topic recommendation
- Start Live Session

**During Study (as needed):**
- Ask concept questions
- Request flashcards
- Get practice problem tips

**Evening (3 min):**
- Ask: "How did I do today?"
- Get encouragement
- Plan tomorrow

### Weekly Review

**Saturday morning:**
- Ask: "Analyze my week"
- Review weak topics
- Adjust next week's plan

### Before Exams

**2 weeks out:**
- Ask: "Create 2-week cram plan"
- Get day-by-day schedule
- Focus mode activated

---

## 💾 Data & Privacy

### What's Stored

**In your database:**
- Conversation history (user + assistant messages)
- Weak topics with priority levels
- Generated flashcards
- Context metadata (stats at time of question)

**Sent to OpenAI (if using):**
- Current message
- Your study stats (hours, accuracy, weak topics)
- System prompt (how to respond)

**NOT sent:**
- Your name or email
- Session notes (unless you include in question)
- Full conversation history

### Privacy Options

1. **Local-only:** Use Ollama (no external API calls)
2. **Clear history:** Click refresh button anytime
3. **Disable coach:** Don't configure any AI provider

---

## 🔧 Troubleshooting

### "Coach not responding"

**Check:**
1. Is `OPENAI_API_KEY` set in `.env`?
2. Is API key valid? (test at platform.openai.com)
3. Check logs: `docker logs fe-scada`

**Fix:**
```bash
# Verify env var loaded
docker exec fe-scada env | grep OPENAI

# Restart container
docker restart fe-scada
```

### "Responses are generic"

**Cause:** Falling back to rule-based coach

**Fix:**
- Configure OpenAI or Ollama
- Check API key hasn't expired
- Verify network connectivity

### "Voice input not working"

**Requirements:**
- Chrome or Edge browser
- HTTPS connection (or localhost)
- Microphone permission granted

**Fix:**
- Check browser console for errors
- Grant mic permission in browser settings
- Try reloading page

### "Conversation not saving"

**Check:**
- Database connection working?
- Prisma migrations applied?
- Check API logs for errors

**Fix:**
```bash
npx prisma migrate deploy
docker restart fe-scada
```

---

## 🎯 Best Practices

### Ask Specific Questions

❌ "Help me study"
✅ "What are the key formulas for fluid mechanics I need to memorize?"

### Provide Context

❌ "I don't understand this"
✅ "I got 60% accuracy on thermodynamics problems. Which concepts should I review?"

### Use Quick Actions First

Before typing, try the quick action buttons - often faster!

### Build on Previous Conversations

❌ Clear history after every question
✅ Let coach remember your learning journey

### Combine with Live Sessions

1. Start Live Session
2. Ask coach for study plan
3. Follow plan during session
4. Log results for better recommendations

---

## 📚 Example Conversations

### Getting Started

**User:** "I'm starting FE Civil prep. Where do I begin?"

**Coach:** "Welcome! Here's your starter plan:

**Week 1: Diagnostic**
1. Take NCEES practice exam (untimed)
2. Log results by topic in dashboard
3. I'll identify your weak areas

**Week 2-3: Fundamentals**
- Focus on topics <60% accuracy
- 2 hours/day using Learn → Apply → Reinforce
- Build foundation before harder problems

**Week 4+: Practice Intensive**
- Mixed problem sets
- Time yourself (1.5 min/problem)
- Target 70%+ overall accuracy

Start with the practice exam tomorrow - I'll be here to help analyze results!"

### Mid-Study Check-in

**User:** "I've been studying for 2 weeks. Am I on track?"

**Coach:** "Great question! Let me analyze:

📊 **Your Stats:**
- 15.5 total hours (goal: 12-15/week) ✅
- 72% avg accuracy (target: 70%+) ✅
- 8 sessions last week (consistent!) ✅

🎯 **Weak Areas:**
- Fluids: 58% accuracy - needs work
- Circuits: 65% accuracy - almost there

📅 **Recommendation:**
You're ON TRACK! Focus next week on:
1. 3 hours on Fluid Mechanics
2. 2 hours on Circuits review
3. Maintain pace on other topics

Keep going - momentum is building! 🚀"

### Concept Explanation

**User:** "I keep getting Bernoulli problems wrong. Explain it like I'm 10."

**Coach:** "Bernoulli's equation is like energy conservation for fluids!

**Simple version:**
Imagine water flowing through a pipe. It has 3 types of energy:
1. **Pressure energy** - how squeezed it is
2. **Speed energy** - how fast it's moving
3. **Height energy** - how high up it is

**The rule:** Total energy stays the same!
- Pipe gets narrow? → Speed ↑, Pressure ↓
- Water goes uphill? → Height ↑, Speed ↓

**Formula:** P + ½ρv² + ρgh = constant
- P = pressure
- v = velocity
- h = height

**Common mistake:** Forgetting to convert units! Always use SI.

Try 5 practice problems now, then tell me how it goes!"

---

## 🌟 Future Enhancements

Coming soon:
- [ ] Upload practice test PDFs for automatic analysis
- [ ] Voice responses (text-to-speech)
- [ ] Integration with NCEES question bank
- [ ] Study group chat (multi-user)
- [ ] Scheduled daily check-ins
- [ ] Spaced repetition algorithm for flashcards
- [ ] Progress predictions ("You'll pass with 85% probability")

---

## 💬 Feedback & Support

### Improving the Coach

The coach learns from:
- Conversation patterns
- Topic requests
- Quick action usage
- Your study progress

The more you use it, the better it gets!

### Getting Help

1. **Ask the coach:** "How do I use you effectively?"
2. **Check logs:** `docker logs fe-scada | grep coach`
3. **Review API calls:** Monitor OpenAI usage dashboard

---

**Version:** 1.0.0
**Last Updated:** 2025-10-23
**AI Provider:** OpenAI GPT-4o-mini (configured)
**Status:** ✅ Production Ready

Start your first conversation now: **🤖 AI Coach** tab!
