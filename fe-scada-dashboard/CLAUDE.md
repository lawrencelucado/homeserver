# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FE-SCADA Dashboard** is a comprehensive study tracking dashboard for FE Civil exam preparation and SCADA engineering. Built with Next.js 14, TypeScript, Prisma ORM, and shadcn/ui, it provides a structured 10-week integrated study plan with persistent data storage, modular components, and advanced analytics.

**Tech Stack:**
- **Frontend:** Next.js 14 (App Router), TypeScript 5
- **UI:** shadcn/ui + Radix UI, Tailwind CSS 3.4
- **Database:** SQLite + Prisma ORM 6.18
- **Charts:** Recharts 2.12 (Bar, Line, Pie, Heatmap)
- **Icons:** Lucide React
- **Runtime:** Node.js 20 Alpine

**Live Access:**
- **Local:** http://localhost:3000
- **Container:** fe-scada
- **Network:** internal_net
- **Database:** SQLite at `./data/dev.db` (bind mount)

---

## Development Commands

### Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Run development server
npm run dev
```

Visit http://localhost:3000

### Database Management

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Create new migration after schema changes
npx prisma migrate dev --name migration_description

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build and start container
docker compose up -d

# View logs
docker compose logs -f fe-scada

# Stop container
docker compose down

# Rebuild after code changes
docker compose up -d --build
```

### Linting & Type Checking

```bash
# Run ESLint
npm run lint

# TypeScript check (no emit)
npx tsc --noEmit
```

---

## Architecture

### Component Structure

The application uses a modular component architecture with clear separation of concerns:

```
FeScadaDeluxeDashboard (Main Orchestrator)
├── Header
│   ├── Week Navigation (Prev/This Week/Next)
│   ├── Settings (Notifications, Reminder Time)
│   ├── Pomodoro Track Selector
│   └── CSV Import/Export
├── Smart Suggestions Card
├── Goal + Pomodoro Row
│   ├── Weekly Goal Card
│   └── Pomodoro (Component)
└── Tab Navigation
    ├── Weekly Plan Tab
    │   └── WeeklyPlan (Component)
    ├── Analytics Tab
    │   └── Analytics (Component)
    │       ├── Daily Hours Chart (Stacked Bar)
    │       ├── Cumulative Hours Chart (Line)
    │       ├── All-Time Totals (Pie Chart)
    │       ├── Weekly Trend (12-week Line)
    │       └── StudyHeatmap (Component)
    └── Log Tab
        └── LogForm (Component)
```

### Project Structure

```
fe-scada-dashboard/
├── app/
│   ├── layout.tsx                 # Root layout with dark theme
│   ├── page.tsx                   # Main dashboard entry
│   └── globals.css                # Global styles + shadcn/ui theme
├── components/
│   ├── ui/                        # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── label.tsx
│   │   ├── switch.tsx
│   │   ├── separator.tsx
│   │   ├── table.tsx
│   │   ├── progress.tsx
│   │   └── tabs.tsx
│   ├── FeScadaDeluxeDashboard.tsx # Main orchestrator
│   ├── WeeklyPlan.tsx             # 10-week study plan display
│   ├── Analytics.tsx              # Charts and visualizations
│   ├── LogForm.tsx                # Study logging form
│   ├── Pomodoro.tsx               # Timer widget
│   └── StudyHeatmap.tsx           # Visual study pattern heatmap
├── lib/
│   ├── utils.ts                   # cn() helper and utilities
│   └── plan.ts                    # DailyProgress types, plan data
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration history
├── data/                          # SQLite database (bind mount)
│   └── dev.db                     # Production database file
├── public/                        # Static assets
├── docker-compose.yml             # Container orchestration
├── Dockerfile                     # Production build
├── components.json                # shadcn/ui config
├── .env.example                   # Environment template
├── tailwind.config.ts             # Tailwind + theme config
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies and scripts
```

### Data Flow

1. **Client-Side State (React Hooks):**
   - `FeScadaDeluxeDashboard` maintains core state (logs, progress, settings)
   - Props are drilled down to child components
   - Event handlers flow back up for state updates

2. **LocalStorage (Fallback Persistence):**
   - Used for backward compatibility
   - Stores: logs, feProgress, scadaProgress, settings
   - State version: 3 (for future migrations)

3. **Database Layer (Prisma + SQLite):**
   - Type-safe database access via Prisma Client
   - File-based SQLite database (`./data/dev.db`)
   - Models: `StudyLog`, `Task`
   - Migrations tracked in `prisma/migrations/`

4. **Component Communication:**
   - Parent → Child: Props (data, callbacks)
   - Child → Parent: Event handlers (state updates)
   - Sibling: Via shared parent state

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

---

## Docker Configuration

### Simplified Build Process

The Dockerfile uses a **simplified 3-stage build** (no standalone output):

1. **deps:** Install dependencies
2. **builder:** Build Next.js application
3. **runner:** Production runtime with direct file copy

**Key Differences from Previous Version:**
- No standalone output mode
- Direct copy of `.next` build artifacts
- Data directory mounted as volume for database persistence
- Simplified structure for easier debugging

### Container Specs

- **Image:** Node.js 20 Alpine
- **Container Name:** fe-scada
- **Port:** 3000
- **Restart Policy:** unless-stopped
- **Data Persistence:** `./data` bind mount → `/app/data`
- **Network:** internal_net (external network)

### docker-compose.yml Structure

```yaml
version: "3.9"
services:
  fe-scada:
    build: .
    container_name: fe-scada
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=file:./data/dev.db
    ports:
      - "3000:3000"
    volumes:
      - type: bind
        source: ./data
        target: /app/data
    restart: unless-stopped
    networks:
      - internal_net

networks:
  internal_net:
    external: true
```

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database (SQLite file-based)
DATABASE_URL="file:./data/dev.db"

# Application
NEXT_PUBLIC_APP_NAME="FE+SCADA Dashboard"

# Theming
COLOR_ACCENT="#0f3d1e"  # Dark forest green
```

**Important:**
- `DATABASE_URL` points to SQLite file in mounted `./data` directory
- `NEXT_PUBLIC_` prefix exposes variables to browser
- Server-side variables (without prefix) are only available in server components
- Never commit `.env` files to git

### PostgreSQL Upgrade (Optional - Level 2)

To upgrade from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma` datasource:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@db:5432/study"
```

3. Add PostgreSQL service to `docker-compose.yml`
4. Run migrations: `npx prisma migrate dev`

---

## Component Development

### Adding a New Component

1. **Create Component File:**
```tsx
// components/NewComponent.tsx
'use client'  // If uses hooks or browser APIs

import { Card, CardContent } from "@/components/ui/card"

interface NewComponentProps {
  data: string
}

export default function NewComponent({ data }: NewComponentProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p>{data}</p>
      </CardContent>
    </Card>
  )
}
```

2. **Import and Use:**
```tsx
import NewComponent from '@/components/NewComponent'

// In parent component:
<NewComponent data="example" />
```

### Adding shadcn/ui Components

```bash
# Install new shadcn component
npx shadcn@latest add [component-name]

# Example: Add dialog component
npx shadcn@latest add dialog
```

This creates the component in `components/ui/` with proper theming.

### Database Schema Changes

1. **Update Schema:**
Edit `prisma/schema.prisma` to add/modify models

2. **Create Migration:**
```bash
npx prisma migrate dev --name add_new_field
```

3. **Regenerate Client:**
```bash
npx prisma generate
```

4. **Rebuild Container:**
```bash
docker compose up -d --build
```

---

## Styling Guidelines

### Theme System

The project uses shadcn/ui theming with Tailwind CSS:

**Dark Theme (Default):**
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --primary: 217.2 91.2% 59.8%;
  /* ... */
}
```

**Accent Color:**
```css
--color-accent: #0f3d1e;  /* Dark forest green */
```

### Component Patterns

**Using shadcn/ui Components:**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click Me</Button>
  </CardContent>
</Card>
```

**Grid Layouts:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

**Spacing:**
```tsx
<div className="p-4 md:p-6 space-y-6">
  {/* Content with responsive padding and vertical spacing */}
</div>
```

---

## Recharts Integration

### Chart Types Used

1. **Bar Chart (Stacked):** Daily hours by track
2. **Line Chart:** Cumulative hours, 12-week trend
3. **Pie Chart:** All-time FE vs SCADA totals
4. **Custom Heatmap:** Study pattern visualization

### Example Chart Component

```tsx
'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

export function DailyHoursChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="FE" stackId="a" fill="#3b82f6" />
        <Bar dataKey="SCADA" stackId="a" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

---

## Next.js 14 Patterns

### App Router Structure

- **Default:** Server Components (better performance)
- **Use `'use client'`:** When you need:
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (localStorage, window, etc.)
  - Event handlers
  - Third-party libraries that use hooks

### Data Fetching

**Server Component (Preferred):**
```tsx
// app/page.tsx
import { prisma } from '@/lib/db'

export default async function Page() {
  const logs = await prisma.studyLog.findMany()
  return <div>{/* Use logs */}</div>
}
```

**Client Component with API Route:**
```tsx
// app/api/logs/route.ts
import { prisma } from '@/lib/db'

export async function GET() {
  const logs = await prisma.studyLog.findMany()
  return Response.json(logs)
}

// components/ClientComponent.tsx
'use client'
export function ClientComponent() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    fetch('/api/logs')
      .then(r => r.json())
      .then(setLogs)
  }, [])
  // ...
}
```

### Metadata

```tsx
// app/layout.tsx or page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FE+SCADA Dashboard",
  description: "Study tracking for FE Civil and SCADA engineering",
}
```

---

## Common Tasks

### Adding a New Study Week

1. **Update Plan Data:**
Edit `lib/plan.ts` to add week details

2. **Update WeeklyPlan Component:**
Modify `components/WeeklyPlan.tsx` to display new week

3. **Test:**
```bash
npm run dev
# Navigate to Weekly Plan tab
```

### Adding a New Chart

1. **Create Chart Component:**
```tsx
// components/NewChart.tsx
'use client'
import { LineChart, Line, /* ... */ } from 'recharts'

export default function NewChart({ data }) {
  return (/* chart JSX */)
}
```

2. **Add to Analytics:**
```tsx
// components/Analytics.tsx
import NewChart from './NewChart'

// In component:
<NewChart data={chartData} />
```

### Modifying Database Schema

1. **Edit Schema:**
```prisma
// prisma/schema.prisma
model StudyLog {
  // ... existing fields
  newField String?  // Add new field
}
```

2. **Create Migration:**
```bash
npx prisma migrate dev --name add_new_field
```

3. **Update Components:**
Use new field in TypeScript with full type safety

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs fe-scada

# Verify port availability
ss -tunlp | grep :3000

# Check network
docker network ls | grep internal_net
docker network create internal_net  # If missing
```

### Database Issues

```bash
# Check database file exists
ls -la data/dev.db

# Verify Prisma client is generated
ls -la node_modules/.prisma/client

# Reset and recreate database
npx prisma migrate reset
npx prisma migrate dev

# Open database in Prisma Studio
npx prisma studio
```

### Build Errors

```bash
# Clear caches
rm -rf .next node_modules

# Reinstall and regenerate
npm install
npx prisma generate
npm run build
```

### Type Errors

```bash
# Check TypeScript without building
npx tsc --noEmit

# Common fixes:
# 1. Regenerate Prisma Client: npx prisma generate
# 2. Restart TypeScript server in editor
# 3. Check import paths use @/ alias
```

---

## Performance Optimization

### Image Optimization

```tsx
import Image from 'next/image'

<Image
  src="/chart.png"
  alt="Chart"
  width={800}
  height={400}
  priority  // For above-fold images
/>
```

### Code Splitting

```tsx
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Loading...</p>,
  ssr: false  // Disable SSR if chart uses window/browser APIs
})
```

### Database Query Optimization

```prisma
// Use select to fetch only needed fields
const logs = await prisma.studyLog.findMany({
  select: {
    id: true,
    date: true,
    questionsFE: true,
    // Omit unused fields
  },
  orderBy: { date: 'desc' },
  take: 100  // Limit results
})
```

---

## Security

### Environment Variable Safety

- ✅ Never expose database credentials with `NEXT_PUBLIC_`
- ✅ Use server-side API routes for sensitive operations
- ✅ Validate all user inputs
- ✅ Never commit `.env` files

### Database Security

- ✅ Use Prisma parameterized queries (SQL injection prevention)
- ✅ Validate data before inserting into database
- ✅ Use TypeScript types for compile-time safety
- ✅ Backup database regularly (bind mount ensures persistence)

---

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` locally to verify
- [ ] Test Docker build: `docker compose build`
- [ ] Update environment variables in `.env`
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Verify database file exists in `./data/`
- [ ] Test container: `docker compose up -d`
- [ ] Check logs: `docker compose logs -f fe-scada`
- [ ] Verify app accessible at http://localhost:3000
- [ ] Test all features (logging, charts, Pomodoro)

---

## Related Documentation

- **README.md**: User-facing documentation and quick start
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Recharts**: https://recharts.org/en-US/

---

## Project Status

**Project Location:** `/home/lawrence/fe-scada-dashboard`
**Container Name:** `fe-scada`
**Network:** `internal_net`
**Port:** 3000
**Database:** SQLite at `./data/dev.db`

**Last Updated:** 2025-10-23
**Status:** Active Development
**Version:** 0.2.0 (with Prisma integration)
