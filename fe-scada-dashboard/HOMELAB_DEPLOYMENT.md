# FE-SCADA Dashboard - Homelab Deployment Quick Start

**Fast deployment guide for Databin homelab**

## 🚀 Quick Deploy (5 minutes)

### Level 1 - Minimal SQLite Setup

```bash
cd /home/lawrence/fe-scada-dashboard

# Run deployment script
./scripts/deploy-level1.sh

# Access dashboard
open http://localhost:8080
```

That's it! Your dashboard is running with SQLite storage.

---

## 📦 What You Get

### Level 1: Minimal (Current)
- ✅ Next.js 14 dashboard
- ✅ SQLite database
- ✅ Port 8080 (external)
- ✅ Dark theme UI
- ✅ Study tracking
- ✅ Analytics charts
- ✅ Pomodoro timer

**Resources:** ~200MB RAM, minimal disk

### Level 2: Production Ready
- ✅ Everything from Level 1
- ✅ PostgreSQL 16
- ✅ Automated backups (daily)
- ✅ Backup retention (7d/4w/6m)
- ✅ Health checks

**Resources:** ~400MB RAM, more reliable

### Level 3: Full Stack
- ✅ Everything from Level 2
- ✅ MQTT broker (Mosquitto)
- ✅ Node-RED (SCADA simulator)
- ✅ NextAuth (authentication)
- ✅ Optional: InfluxDB + Grafana

**Resources:** ~800MB RAM, complete system

---

## 🎯 Choose Your Path

### Path A: Start Simple, Upgrade Later

```bash
# Start with SQLite
./scripts/deploy-level1.sh

# Later: Upgrade to PostgreSQL
./scripts/upgrade.sh level2

# Even later: Add SCADA features
./scripts/upgrade.sh level3
```

### Path B: Go Straight to Production

```bash
# Deploy with PostgreSQL and backups
./scripts/deploy-level2.sh
```

### Path C: Full Stack from Day 1

```bash
# Deploy everything (with optional historian)
./scripts/deploy-level3.sh --with-historian
```

---

## 📋 Prerequisites

### Required
- ✅ Docker & Docker Compose
- ✅ Git
- ✅ 1GB free RAM
- ✅ 5GB free disk

### Already on Databin
- ✅ Docker network: `internal_net`
- ✅ Cloudflare Tunnel (optional)

---

## 🔧 Initial Setup

### 1. Clone or Navigate to Project

```bash
cd /home/lawrence/fe-scada-dashboard
```

### 2. Configure Environment

```bash
# Copy example
cp .env.example .env

# Edit if needed (defaults are fine for Level 1)
nano .env
```

### 3. Deploy

```bash
# Choose your level
./scripts/deploy-level1.sh   # SQLite
./scripts/deploy-level2.sh   # PostgreSQL
./scripts/deploy-level3.sh   # Full Stack
```

---

## 🌐 Cloudflare Tunnel Setup

### Expose as `study.databin.dev`

1. **In Cloudflare Zero Trust:**
   - Navigate to Networks → Tunnels
   - Select your existing tunnel
   - Add public hostname

2. **Configuration:**
   ```yaml
   Public hostname: study.databin.dev
   Service: http://fe-scada:3000
   ```

3. **Or use LAN IP:**
   ```yaml
   Public hostname: study.databin.dev
   Service: http://192.168.1.x:8080
   ```

4. **Test:**
   ```bash
   curl https://study.databin.dev
   ```

---

## 📊 Port Reference

| Service | Internal | External | Access |
|---------|----------|----------|--------|
| Dashboard | 3000 | 8080 | http://localhost:8080 |
| PostgreSQL | 5432 | - | Internal only |
| MQTT | 1883 | 1883 | mqtt://localhost:1883 |
| Node-RED | 1880 | 1880 | http://localhost:1880 |
| Grafana | 3000 | 3001 | http://localhost:3001 |
| InfluxDB | 8086 | 8086 | http://localhost:8086 |

---

## 🛠️ Common Tasks

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f fe-scada
```

### Restart Service

```bash
docker compose restart fe-scada
```

### Backup Database

```bash
./scripts/backup.sh
```

### Restore Database

```bash
# List backups
ls -lh backups/

# Restore specific backup
./scripts/restore.sh backups/postgres-20250123.sql
```

### Update Application

```bash
git pull
docker compose up -d --build
```

### Upgrade Deployment Level

```bash
# Level 1 → Level 2
./scripts/upgrade.sh level2

# Level 2 → Level 3
./scripts/upgrade.sh level3
```

---

## 🔍 Verification

### Check Container Status

```bash
docker compose ps
```

Expected output:
```
NAME       STATUS    PORTS
fe-scada   running   0.0.0.0:8080->3000/tcp
```

### Check Database

**SQLite (Level 1):**
```bash
ls -lh data/dev.db
```

**PostgreSQL (Level 2+):**
```bash
docker exec fe-scada-db psql -U appuser -d study -c "SELECT version();"
```

### Test Dashboard

```bash
# Local
curl http://localhost:8080

# LAN
curl http://$(hostname -I | awk '{print $1}'):8080
```

---

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs fe-scada

# Check port conflict
ss -tunlp | grep :8080

# Restart
docker compose down && docker compose up -d
```

### Database connection failed

```bash
# Check database status
docker exec fe-scada-db pg_isready -U appuser

# Restart database
docker restart fe-scada-db

# Wait and restart app
sleep 5
docker restart fe-scada
```

### Port already in use

Edit `docker-compose.yml`:
```yaml
ports:
  - "8081:3000"  # Change 8080 to 8081
```

### Network not found

```bash
docker network create internal_net
docker compose up -d
```

---

## 💾 Backup Strategy

### Automated (Level 2+)

- **Schedule:** Daily at midnight
- **Location:** `./backups/`
- **Retention:**
  - Daily: 7 days
  - Weekly: 4 weeks
  - Monthly: 6 months

### Manual Backups

```bash
# Backup now
./scripts/backup.sh

# Verify
ls -lh backups/

# Restore if needed
./scripts/restore.sh backups/latest.sql
```

---

## 🔐 Security Notes

### Environment Variables

- ✅ Never commit `.env` to git
- ✅ Use strong passwords (generated automatically)
- ✅ Rotate secrets quarterly

### Network Security

- ✅ `internal_net` for inter-service communication
- ✅ Only expose necessary ports
- ✅ Use Cloudflare Tunnel for public access (encrypted)

### Database Security

- ✅ Password-protected PostgreSQL
- ✅ No external database port exposure
- ✅ Regular automated backups

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview and features |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Complete deployment guide (all levels) |
| [CLAUDE.md](CLAUDE.md) | Development and architecture guide |
| [scripts/README.md](scripts/README.md) | Script documentation |
| **This file** | Quick start for homelab deployment |

---

## 🎯 Next Steps After Deployment

### Level 1 (SQLite)
1. ✅ Access dashboard at http://localhost:8080
2. ✅ Start logging study sessions
3. ✅ Set up Cloudflare Tunnel (optional)
4. ✅ Consider upgrading to Level 2 for backups

### Level 2 (PostgreSQL)
1. ✅ Verify automated backups
   ```bash
   ls -lh backups/
   ```
2. ✅ Test backup/restore process
   ```bash
   ./scripts/backup.sh
   ./scripts/restore.sh backups/latest.sql
   ```
3. ✅ Set up monitoring (optional)

### Level 3 (Full Stack)
1. ✅ Configure Node-RED at http://localhost:1880
2. ✅ Set up MQTT flows
   - Inject → Function → MQTT Out
   - Topic: `plant/level`
3. ✅ Test MQTT broker
   ```bash
   docker exec fe-scada-mqtt mosquitto_sub -t '#' -v
   ```
4. ✅ Configure Grafana dashboards (if using historian)
5. ✅ Set up authentication in Next.js app

---

## 🚨 Emergency Procedures

### Service Down

```bash
# Check status
docker compose ps

# Restart all
docker compose restart

# Nuclear option (rebuilds everything)
docker compose down
docker compose up -d --build
```

### Data Recovery

```bash
# List backups
ls -lh backups/

# Restore latest
./scripts/restore.sh backups/$(ls -t backups/ | head -1)
```

### Complete Reset

```bash
# ⚠️ WARNING: Deletes all data!

# Stop services
docker compose down -v

# Remove data
rm -rf data/ backups/

# Fresh deployment
./scripts/deploy-level1.sh
```

---

## ✅ Deployment Checklist

Before going live:

- [ ] Environment configured (`.env`)
- [ ] Network created (`internal_net`)
- [ ] Deployment level chosen
- [ ] Services deployed and running
- [ ] Dashboard accessible
- [ ] Database working
- [ ] Backups configured (Level 2+)
- [ ] Cloudflare Tunnel configured (optional)
- [ ] Documentation reviewed
- [ ] Test backup/restore process

---

## 💬 Support

### Getting Help

1. **Check logs first:**
   ```bash
   docker compose logs -f
   ```

2. **Review documentation:**
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed guide
   - [CLAUDE.md](CLAUDE.md) - Technical details

3. **Common issues:**
   - Port conflicts → Change port in docker-compose.yml
   - Network errors → `docker network create internal_net`
   - Database errors → Check connection string in .env

### Useful Commands

```bash
# System health
docker stats

# Disk usage
du -sh data/ backups/

# Database size
docker exec fe-scada-db psql -U appuser -d study -c "
SELECT pg_size_pretty(pg_database_size('study'));"

# Container info
docker inspect fe-scada
```

---

**Version:** 1.0.0
**Last Updated:** 2025-10-23
**Deployment:** Databin Homelab
**Current Level:** Level 1 (SQLite)

Ready to deploy? Start with: `./scripts/deploy-level1.sh`
