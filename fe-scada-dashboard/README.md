# FE-SCADA Deluxe Dashboard

Comprehensive study tracking dashboard for FE Civil exam preparation and SCADA engineering, built with Next.js 14, TypeScript, Prisma, and shadcn/ui.

## Overview

This dashboard provides a 10-week integrated study plan for FE Civil exam preparation and SCADA engineering. It combines structured learning with real-time analytics, persistent data storage, and modular component architecture.

## Features

### Core Functionality
- 📚 **10-Week Integrated Plan:** Comprehensive plan covering FE fundamentals and SCADA engineering
- ⚙️ **Weekly Goals:** Clear objectives for each week with progress tracking
- 📊 **Analytics Dashboard:** Daily, weekly, and 12-week trend charts with heatmap visualization
- ⏱️ **Live Session Tracker:** Real-time study sessions with auto-save, voice notes, and break reminders ✨ NEW
- 🤖 **AI Study Coach:** Personalized study recommendations with OpenAI/Ollama support ✨ NEW
- 📝 **Study Logging:** Manual and automatic time tracking with CSV export/import
- 🎙️ **Voice Notes:** Hands-free note-taking during study sessions (Chrome/Edge)
- ☕ **Smart Breaks:** Automatic Pomodoro reminders every 25 minutes
- 💡 **Smart Suggestions:** AI-powered study recommendations based on progress
- 🌙 **Dark Theme:** Professional UI with shadcn/ui components
- 📱 **Mobile Responsive:** Optimized for all screen sizes

### Data & Persistence
- 💾 **SQLite Database:** Persistent storage with Prisma ORM
- 🔄 **Data Sync:** Study logs, tasks, and live sessions stored in database
- 📈 **Historical Tracking:** All-time statistics and progress trends
- 🎯 **Task Management:** Daily tasks organized by Learn/Apply/Reinforce phases
- 💪 **Session Recovery:** Resume sessions after browser crash or page reload


## Quick Start

### Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed

# Run development server
npm run dev
```

Visit http://localhost:3000

### Production (Docker)

```bash
# Build and start
docker compose up -d

# View logs
docker compose logs -f fe-scada

# Stop
docker compose down

# Rebuild after changes
docker compose up -d --build
```

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS 3.4
- **Charts:** Recharts 2.12 (Bar, Line, Pie, Heatmap)
- **Icons:** Lucide React

### Backend & Data
- **ORM:** Prisma 6.18
- **Database:** SQLite (file-based, portable)
- **Runtime:** Node.js 20 Alpine

### Infrastructure
- **Container:** Docker with multi-stage builds
- **Port:** 3000
- **Network:** internal_net (external network)

## Project Structure

```
fe-scada-dashboard/
├── app/
│   ├── layout.tsx                 # Root layout with dark theme
│   ├── page.tsx                   # Main dashboard entry point
│   └── globals.css                # Global styles + shadcn/ui variables
├── components/
│   ├── ui/                        # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── FeScadaDeluxeDashboard.tsx # Main orchestrator component
│   ├── WeeklyPlan.tsx             # 10-week study plan display
│   ├── Analytics.tsx              # Charts and visualizations
│   ├── LogForm.tsx                # Study logging form
│   ├── Pomodoro.tsx               # Pomodoro timer widget
│   └── StudyHeatmap.tsx           # Visual heatmap for study patterns
├── lib/
│   ├── utils.ts                   # Utility functions (cn helper)
│   └── plan.ts                    # DailyProgress types and plan data
├── prisma/
│   ├── schema.prisma              # Database schema (StudyLog, Task, StudySession)
│   └── migrations/                # Database migration history
├── app/api/
│   ├── sessions/                  # Live session API endpoints ✨ NEW
│   └── study-logs/                # Study log API endpoints ✨ NEW
├── data/                          # SQLite database storage (mounted volume)
│   └── dev.db                     # Production database file
├── public/                        # Static assets
├── docker-compose.yml             # Production deployment
├── Dockerfile                     # Simplified production build
├── components.json                # shadcn/ui configuration
├── .env.example                   # Environment variable template
└── next.config.js                 # Next.js configuration
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Configuration options:
```env
# Database (SQLite - file-based)
DATABASE_URL="file:./data/dev.db"

# Application
NEXT_PUBLIC_APP_NAME="FE+SCADA Dashboard"

# Theming
COLOR_ACCENT="#0f3d1e"  # Dark forest green accent color
```

### Database Migration

For SQLite (Level 1 - default):
```bash
npx prisma migrate dev --name init
```

For PostgreSQL upgrade (Level 2 - optional):
```bash
# Update DATABASE_URL to postgresql://...
# Then run:
npx prisma migrate dev --name init
```

## Docker Configuration

### Container Specs
- **Image:** Node.js 20 Alpine (lightweight)
- **Container Name:** fe-scada
- **Port:** 3000
- **Restart Policy:** unless-stopped
- **Data Persistence:** Bind mount `./data` → `/app/data` (SQLite database)

### Networks
- **internal_net**: External network for container communication
  - Create if doesn't exist: `docker network create internal_net`
  - Used for Cloudflare Tunnel access and inter-service communication

## Access Points

- **Local Development:** http://localhost:3000
- **Production (Container):** http://localhost:3005 (mapped to container port 3000)
- **Public Domain:** http://fe.databin.dev (via Cloudflare Tunnel)

## Architecture

### Component Hierarchy

```
FeScadaDeluxeDashboard (Main Orchestrator)
├── Header (Week navigation, settings, CSV import/export)
├── Smart Suggestions Card
├── Goal + Pomodoro Row
└── Tab Navigation
    ├── Weekly Plan Tab
    │   └── WeeklyPlan component
    ├── Analytics Tab
    │   └── Analytics component
    │       ├── Daily Hours Chart (Stacked Bar)
    │       ├── Cumulative Hours Chart (Line)
    │       ├── All-Time Totals (Pie)
    │       ├── Weekly Trend (Line - 12 weeks)
    │       └── StudyHeatmap component
    └── Log Tab
        └── LogForm component
            ├── Date/Track/Hours inputs
            └── Add/Clear actions
```

### Data Flow

1. **Client-Side State:**
   - React hooks manage UI state (logs, progress, settings)
   - LocalStorage for temporary persistence (fallback)

2. **Database Layer:**
   - Prisma Client for type-safe database access
   - SQLite for persistent storage
   - Models: `StudyLog`, `Task`, `StudySession` ✨ NEW

3. **Component Communication:**
   - Props drilling from main orchestrator
   - State lifting for shared data
   - Event handlers for user actions

### Database Schema

**StudyLog Model:**
```prisma
model StudyLog {
  id          Int      @id @default(autoincrement())
  date        DateTime @default(now()) @unique
  topicFE     String
  topicSCADA  String
  questionsFE Int
  accuracyFE  Int
  notes       String?
}
```

**Task Model:**
```prisma
model Task {
  id      Int     @id @default(autoincrement())
  title   String
  done    Boolean @default(false)
  section String  // Learn | Apply | Reinforce
  dayKey  String  // e.g., 2025-10-22
}
```

**StudySession Model:** ✨ NEW
```prisma
model StudySession {
  id            Int      @id @default(autoincrement())
  startTime     DateTime @default(now())
  endTime       DateTime?
  pausedAt      DateTime?
  totalPaused   Int      @default(0)
  track         String   // "FE" | "SCADA" | "Both"
  topic         String?
  status        String   @default("active")
  notes         String?
  questionCount Int?
  accuracy      Float?
  breaksTaken   Int      @default(0)
  targetMinutes Int?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Dashboard Usage

### Navigation

The dashboard uses a **tab-based navigation** with four main views:

1. **⏱️ Live Session Tab:** ✨ NEW
   - Real-time study session tracking
   - Pause/Resume/Stop controls
   - Voice-to-text note taking (Chrome/Edge)
   - Auto-save every 30 seconds
   - Break reminders every 25 minutes
   - Progress indicator for target duration
   - Auto-converts to study log on completion

2. **Weekly Plan Tab:**
   - Displays the 10-week integrated study plan
   - Each week shows FE and SCADA topics
   - Weekly goals and progress indicators
   - Daily task breakdown (Learn → Apply → Reinforce)

3. **Analytics Tab:**
   - **Daily Hours Chart:** Stacked bar chart showing FE vs SCADA hours per day
   - **Cumulative Hours:** Line chart tracking running total throughout the week
   - **All-Time Totals:** Pie chart showing total FE vs SCADA study time
   - **12-Week Trend:** Historical view of study consistency
   - **Study Heatmap:** Visual representation of study patterns over time

4. **Log Tab:**
   - Manual logging form for study sessions
   - Date picker for backdating entries
   - Track selection (FE or SCADA)
   - Hours input with notes field
   - Clear logs functionality

### Features

**Pomodoro Timer:**
- Located in header section
- Configurable duration (25/45 minutes)
- Auto-break mode with 5-minute breaks
- Auto-log to selected track (FE or SCADA)
- Browser notifications on completion

**Study Logging:**
- Manual entry via Log tab
- Auto-logging from Pomodoro timer
- CSV export for backup
- CSV import for data restoration

**Smart Suggestions:**
- AI-powered recommendations based on weekly progress
- Tracks FE/SCADA balance
- Suggests focus areas and weak topics

## Development

### Adding Components

**shadcn/ui Components:**
```bash
npx shadcn@latest add [component-name]
```

**Custom Components:**
Place in `components/` directory. Use TypeScript for type safety.

**Database Changes:**
```bash
# Update schema.prisma, then:
npx prisma migrate dev --name description_of_change
npx prisma generate
```

### Building for Production

```bash
# Local build
npm run build

# Docker build
docker compose build

# Start production container
docker compose up -d
```

### Type Checking

```bash
# ESLint
npm run lint

# TypeScript check (implicit in build)
npx tsc --noEmit
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client after schema changes
npx prisma generate
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker compose logs fe-scada

# Verify port availability
ss -tunlp | grep :3000

# Check Docker resources
docker stats fe-scada
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next node_modules
npm install
npx prisma generate
npm run build
```

### Database Issues
```bash
# Check database file exists
ls -la data/dev.db

# Verify Prisma client is generated
ls -la node_modules/.prisma/client

# Recreate database
npx prisma migrate reset
npx prisma migrate dev
```

### Network Issues
```bash
# Check network exists
docker network ls | grep internal_net

# Create if missing
docker network create internal_net

# Verify container is on network
docker inspect fe-scada --format '{{range $key, $value := .NetworkSettings.Networks}}{{$key}} {{end}}'
```

## Documentation

- **README.md**: This file - project overview and quick start
- **CLAUDE.md**: Detailed development guide and architecture
- **LIVE_SESSION_TRACKER.md**: Complete guide to Live Session Tracker feature ✨ NEW
- **DEPLOYMENT.md**: Comprehensive deployment guide for all levels
- **HOMELAB_DEPLOYMENT.md**: Quick start for homelab deployment
- **docs/MIGRATION_LIVE_SESSIONS.md**: Migration guide for Live Session feature ✨ NEW
- **PROJECT_SETUP_SUMMARY.md**: Initial setup documentation
- **Server Integration**: `/home/lawrence/CURRENT_SERVER_SETUP.md`

## License

Private - Internal Use Only
