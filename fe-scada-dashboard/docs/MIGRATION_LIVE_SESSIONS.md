# Migration Guide: Adding Live Session Tracker

**Upgrade your dashboard with real-time study session tracking**

---

## 📋 Prerequisites

- Existing FE-SCADA Dashboard installation
- Docker & Docker Compose
- Database access (SQLite or PostgreSQL)

---

## 🚀 Quick Migration (5 minutes)

### Step 1: Update Database Schema

```bash
cd /home/lawrence/fe-scada-dashboard

# Stop containers
docker compose down

# Update Prisma schema (already done in prisma/schema.prisma)
# The StudySession model has been added
```

### Step 2: Run Database Migration

**For SQLite (Level 1):**
```bash
# Generate migration
npx prisma migrate dev --name add_study_sessions

# Generate Prisma Client
npx prisma generate
```

**For PostgreSQL (Level 2+):**
```bash
# Generate and apply migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Step 3: Rebuild and Deploy

```bash
# Rebuild with new code
docker compose up -d --build

# Verify deployment
docker compose logs -f fe-scada
```

### Step 4: Test Live Session

1. Open dashboard: http://localhost:8080
2. Click **⏱️ Live Session** tab
3. Start a test session
4. Verify auto-save works

---

## 📦 What's New

### Files Added

```
components/LiveSessionTracker.tsx    # Main component
app/api/sessions/route.ts           # Session CRUD
app/api/sessions/active/route.ts    # Get active session
app/api/sessions/[id]/route.ts      # Update/delete session
app/api/study-logs/route.ts         # Log creation from session
LIVE_SESSION_TRACKER.md             # Feature documentation
docs/MIGRATION_LIVE_SESSIONS.md     # This file
```

### Database Changes

```prisma
model StudySession {
  id            Int      @id @default(autoincrement())
  startTime     DateTime @default(now())
  endTime       DateTime?
  pausedAt      DateTime?
  totalPaused   Int      @default(0)
  track         String
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

### UI Changes

- New **⏱️ Live Session** tab in main navigation
- Integrated with existing dashboard
- No breaking changes to existing features

---

## 🔧 Troubleshooting

### Migration Fails

**Error: "Table already exists"**
```bash
# Reset and recreate (WARNING: loses data)
npx prisma migrate reset
npx prisma migrate dev
```

**Error: "Prisma Client not generated"**
```bash
npx prisma generate
docker compose restart fe-scada
```

### API Errors

**404 on /api/sessions**
```bash
# Verify API routes exist
ls -la app/api/sessions/

# Rebuild container
docker compose up -d --build
```

**500 Internal Server Error**
```bash
# Check logs
docker logs fe-scada

# Verify database connection
docker exec fe-scada npx prisma db pull
```

### Voice Input Not Working

**Browser compatibility:**
- ✅ Chrome/Edge - Full support
- ❌ Firefox - Not supported
- ✅ Safari iOS 14.5+ - Supported

**Fix:**
- Use Chrome or Edge
- Check microphone permissions
- Reload page

---

## ⏪ Rollback

If you need to revert:

### Step 1: Remove Migration

```bash
# Remove last migration
rm -rf prisma/migrations/*_add_study_sessions

# Or reset all migrations
npx prisma migrate reset
```

### Step 2: Restore Previous Code

```bash
git checkout HEAD~1 components/LiveSessionTracker.tsx
git checkout HEAD~1 app/api/sessions
git checkout HEAD~1 prisma/schema.prisma
```

### Step 3: Rebuild

```bash
npx prisma generate
docker compose up -d --build
```

---

## 🎯 Verification Checklist

After migration, verify:

- [ ] Dashboard loads without errors
- [ ] **⏱️ Live Session** tab appears
- [ ] Can start a new session
- [ ] Timer counts correctly
- [ ] Pause/Resume works
- [ ] Notes auto-save
- [ ] Voice input works (Chrome/Edge)
- [ ] End session creates study log
- [ ] Session survives page refresh
- [ ] Existing study logs still work

---

## 📊 Data Migration

### Optional: Convert Old Logs to Sessions

If you want to create sessions from existing study logs:

```sql
-- PostgreSQL example
INSERT INTO "StudySession" (
  "startTime",
  "endTime",
  track,
  status,
  notes,
  "createdAt"
)
SELECT
  date,
  date + (interval '1 hour' * "topicFE"),
  'FE',
  'completed',
  notes,
  date
FROM "StudyLog"
WHERE "topicFE" > 0;
```

**Warning:** This is optional and may not perfectly represent actual sessions.

---

## 🆘 Support

### Getting Help

1. **Check logs:**
   ```bash
   docker compose logs fe-scada
   ```

2. **Verify database:**
   ```bash
   npx prisma studio
   ```

3. **Test API directly:**
   ```bash
   curl http://localhost:8080/api/sessions/active
   ```

4. **Review documentation:**
   - [LIVE_SESSION_TRACKER.md](../LIVE_SESSION_TRACKER.md)
   - [DEPLOYMENT.md](../DEPLOYMENT.md)
   - [README.md](../README.md)

---

## 🎉 Success!

If all checks pass, you're ready to start using Live Session Tracker!

**Next steps:**
1. Enable browser notifications for break reminders
2. Grant microphone permission for voice notes
3. Start your first session
4. Review session history in database

**Happy studying!** 📚⏱️

---

**Migration Version:** 1.0.0
**Compatible with:** FE-SCADA Dashboard v0.2.0+
**Date:** 2025-10-23
