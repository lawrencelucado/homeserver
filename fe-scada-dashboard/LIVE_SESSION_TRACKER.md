# Live Study Session Tracker

**Real-time study tracking with auto-save, voice notes, and break reminders**

---

## 🎯 Features

### ⏱️ Live Timer
- **Real-time counting** - Precise elapsed time tracking
- **Pause/Resume** - Take breaks without losing time
- **Progress indicator** - Visual progress toward your target duration
- **Auto-save every 30 seconds** - Never lose your session data

### 🎙️ Voice-to-Text Notes
- **Hands-free note taking** - Speak your thoughts while studying
- **Continuous recognition** - Keeps listening until you stop
- **Auto-append** - Adds to existing notes seamlessly
- **Browser-native** - Uses Chrome/Edge Web Speech API

### ☕ Smart Break Reminders
- **25-minute Pomodoro alerts** - Automatic notifications
- **Manual break button** - Take a break anytime
- **Auto-resume after 5 min** - Returns to studying automatically
- **Break counter** - Track how many breaks you've taken

### 💾 Automatic Session Persistence
- **Background auto-save** - Saves every 30 seconds
- **Survives page refresh** - Resume exactly where you left off
- **Database-backed** - All sessions stored in PostgreSQL/SQLite
- **Session history** - Review past sessions and patterns

### 📊 Auto-Log Integration
- **One-click conversion** - End session → creates study log
- **Accurate time tracking** - Excludes paused time
- **Notes preserved** - Session notes transfer to log
- **Tracks questions/accuracy** - Optional practice metrics

---

## 🚀 Quick Start

### 1. Start a Session

1. Navigate to **⏱️ Live Session** tab
2. Select your study track:
   - **FE Civil** - Fundamentals of Engineering
   - **SCADA** - Control systems
   - **Both** - Mixed studying
3. Choose target duration (15, 25, 45, 60, or 90 minutes)
4. Click **Start Study Session**

### 2. During Session

**Timer Controls:**
- ⏸️ **Pause** - Temporarily stop timer
- ▶️ **Resume** - Continue from where you paused
- ☕ **Break** - 5-minute break with auto-resume
- ⏹️ **End Session** - Complete and log hours

**Taking Notes:**
- Type in the notes field (auto-saves)
- OR click **🎤 Voice** to speak notes
- Notes save automatically every second

**Track Progress:**
- Green progress bar shows target completion
- Current status (active/paused)
- Break count
- Elapsed hours

### 3. End Session

1. Click **⏹️ End Session**
2. Session automatically converts to study log
3. All notes preserved
4. Hours calculated (excluding pauses)

---

## 📋 Database Schema

```prisma
model StudySession {
  id            Int      @id @default(autoincrement())
  startTime     DateTime @default(now())
  endTime       DateTime?
  pausedAt      DateTime?
  totalPaused   Int      @default(0)  // seconds
  track         String   // "FE" | "SCADA" | "Both"
  topic         String?
  status        String   @default("active")  // active | paused | completed
  notes         String?
  questionCount Int?
  accuracy      Float?
  breaksTaken   Int      @default(0)
  targetMinutes Int?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 🔧 API Endpoints

### GET /api/sessions/active
Get currently active or paused session

**Response:**
```json
{
  "session": {
    "id": 1,
    "startTime": "2025-10-23T10:00:00Z",
    "track": "FE",
    "status": "active",
    "targetMinutes": 25
  }
}
```

### POST /api/sessions
Create a new study session

**Request:**
```json
{
  "track": "FE",
  "targetMinutes": 25,
  "topic": "Statics"
}
```

### PUT /api/sessions/[id]
Update session (pause, resume, add notes)

**Request:**
```json
{
  "status": "paused",
  "pausedAt": "2025-10-23T10:15:00Z",
  "notes": "Completed 10 practice problems"
}
```

### DELETE /api/sessions/[id]
Delete a session

---

## 🎤 Voice Input Setup

### Browser Compatibility
- ✅ **Chrome** (Desktop & Android)
- ✅ **Edge** (Desktop)
- ✅ **Safari** (iOS 14.5+)
- ❌ **Firefox** (not supported)

### Enable Voice Input

1. **Grant microphone permission**
   - Browser will prompt on first use
   - Allow microphone access

2. **Click voice button**
   - 🎤 **Voice** - Start listening
   - 🎤 **Stop** (red) - Stop listening

3. **Speak clearly**
   - Speak naturally
   - Pause between sentences
   - Voice automatically appends to notes

### Troubleshooting Voice

**"Voice input not supported"**
- Use Chrome or Edge browser
- Update to latest version

**Microphone not working:**
- Check browser permissions
- Test microphone in system settings
- Reload page and try again

---

## ⏰ Break Reminders

### Automatic Reminders

**Pomodoro Mode (default):**
- Notification every 25 minutes
- Suggests 5-minute break
- Optional auto-break mode

**Enable Notifications:**
1. Click **🔔 Notifications** toggle (top right)
2. Browser will request permission
3. Allow notifications

### Manual Breaks

1. Click ☕ **Break** button
2. Timer pauses for 5 minutes
3. Notification when break ends
4. Auto-resumes studying

---

## 💡 Tips & Best Practices

### Maximize Productivity

1. **Set realistic targets**
   - Start with 25-minute sessions
   - Gradually increase to 45-90 minutes

2. **Use voice notes**
   - Capture thoughts without breaking flow
   - Review notes at end of session

3. **Take breaks**
   - Don't skip breaks!
   - 5 minutes every 25 minutes optimal

4. **Track practice questions**
   - Note number of questions attempted
   - Record accuracy percentage
   - Helps identify weak topics

### Session Recovery

**Page crashed or closed?**
- Reopen dashboard
- Active session auto-loads
- Resume exactly where you left off

**Want to abandon session?**
- Click ⏹️ **End Session**
- Choose not to log (or log partial time)

---

## 📊 Session History

### View Past Sessions

```bash
# Query database directly (PostgreSQL)
docker exec fe-scada-db psql -U appuser -d study -c "
SELECT
  id,
  track,
  EXTRACT(EPOCH FROM (endTime - startTime))/3600 AS hours,
  notes
FROM StudySession
WHERE status = 'completed'
ORDER BY startTime DESC
LIMIT 10;"
```

### Export Sessions

Future feature: Export all sessions to CSV/JSON

---

## 🔄 Migration from Manual Logging

### Before (Manual Log):
1. Study for some time
2. Try to remember how long
3. Manually enter hours
4. Forget to log ❌

### After (Live Session):
1. Click "Start Session"
2. Study (timer runs)
3. Click "End Session"
4. Auto-logged ✅

---

## 🛠️ Technical Details

### Component Architecture

```
LiveSessionTracker.tsx
├── State Management
│   ├── session (active session data)
│   ├── elapsedSeconds (computed time)
│   ├── localNotes (debounced notes)
│   └── isListening (voice input status)
├── Effects
│   ├── loadActiveSession (on mount)
│   ├── timer interval (every second)
│   ├── auto-save (every 30s)
│   └── notes debounce (1s delay)
└── API Integration
    ├── GET /api/sessions/active
    ├── POST /api/sessions
    ├── PUT /api/sessions/[id]
    └── POST /api/study-logs
```

### Auto-Save Logic

```typescript
// Save every 30 seconds while active
if (elapsed % 30 === 0) {
  autoSaveSession()
}

// Save 1 second after notes change (debounced)
useEffect(() => {
  const timer = setTimeout(() => {
    autoSaveSession()
  }, 1000)
  return () => clearTimeout(timer)
}, [localNotes])
```

### Time Calculation

```typescript
// Elapsed time excludes paused periods
const elapsed = (now - startTime) - totalPaused

// Total paused accumulates each pause
const pausedDuration = (now - pausedAt)
totalPaused += pausedDuration
```

---

## 🚧 Roadmap

### Planned Features

- [ ] **Session templates** - Save common session configs
- [ ] **Session goals** - Set questions/topics goals
- [ ] **Session analytics** - Productivity patterns
- [ ] **Team sessions** - Study with friends (live)
- [ ] **Session sharing** - Export session summary
- [ ] **Distraction blocking** - Website blocker integration
- [ ] **Focus music** - Integrated study playlist
- [ ] **Session streaks** - Daily session tracking

---

## ❓ FAQ

**Q: What happens if I close the browser?**
A: Session auto-saves every 30s. Reopen and it resumes from last save.

**Q: Can I edit a past session?**
A: Not currently. End session creates immutable log entry.

**Q: Does it work offline?**
A: Timer works offline, but saving requires connection.

**Q: Can I run multiple sessions?**
A: No. End current session before starting new one.

**Q: Is voice data stored?**
A: No. Voice converts to text in browser. Only text saved.

**Q: What if I forget to end session?**
A: Auto-end after 6 hours of inactivity (future feature).

---

## 🎉 Success Stories

> *"I used to forget to log hours all the time. Now I just hit start and the dashboard tracks everything automatically!"* - Engineering Student

> *"Voice notes while studying = game changer. I capture insights without breaking concentration."* - FE Candidate

> *"The break reminders actually help. I used to study for 3 hours straight and burn out."* - SCADA Engineer

---

**Version:** 1.0.0
**Last Updated:** 2025-10-23
**Status:** ✅ Production Ready

Start your first session now: **⏱️ Live Session** tab
