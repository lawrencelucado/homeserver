# FE + SCADA Dashboard — Homelab Deployment Kit

A step-by-step deployment plan for **Databin homelab** (Docker, Cloudflare Tunnel, Postgres/SQLite). Starts minimal, then adds layers.

---

## Level 1 — Minimal, Fast (1 container) ✅ CURRENT

**Goal:** Run a single Next.js app (FE+SCADA dashboard) with local SQLite storage.

### Architecture

```
┌─────────────────────────────────────┐
│   Cloudflare Tunnel (Optional)      │
│   study.databin.dev                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Docker Network: internal_net      │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   fe-scada:3000              │  │
│  │   Next.js 14 + Prisma        │  │
│  │   SQLite: ./data/dev.db      │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### File Structure

```
fe-scada-dashboard/
├─ docker-compose.yml              # Level 1: Single container
├─ docker-compose.level2.yml       # Level 2: + Postgres + Backups
├─ docker-compose.level3.yml       # Level 3: + Auth + SCADA sim
├─ Dockerfile                      # Production build
├─ .env.example                    # Environment template
├─ .env                           # Your secrets (gitignored)
├─ prisma/
│  ├─ schema.prisma               # Database models
│  └─ migrations/                 # Migration history
├─ app/
│  ├─ layout.tsx                  # Root layout
│  ├─ page.tsx                    # Main dashboard
│  └─ globals.css                 # Global styles
├─ components/
│  ├─ ui/                         # shadcn/ui components
│  ├─ FeScadaDeluxeDashboard.tsx # Main orchestrator
│  ├─ WeeklyPlan.tsx             # 10-week study plan
│  ├─ Analytics.tsx              # Charts & metrics
│  ├─ LogForm.tsx                # Study logging
│  ├─ Pomodoro.tsx               # Timer widget
│  └─ StudyHeatmap.tsx           # Heatmap visualization
├─ lib/
│  ├─ utils.ts                   # Helper functions
│  └─ plan.ts                    # Daily plan & week data
├─ data/                         # SQLite storage (bind mount)
│  └─ dev.db                     # Database file
├─ backups/                      # Postgres backups (Level 2+)
├─ package.json                  # Dependencies
├─ next.config.mjs              # Next.js config
├─ tailwind.config.ts           # Tailwind config
└─ tsconfig.json                # TypeScript config
```

### Current Configuration

**docker-compose.yml**
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
      - "8080:3000"  # External:Internal
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

**Environment Variables (.env)**
```env
# Database (SQLite - Level 1)
DATABASE_URL="file:./data/dev.db"

# Application
NEXT_PUBLIC_APP_NAME="FE+SCADA Dashboard"

# Theming
COLOR_ACCENT="#0f3d1e"  # Dark forest green
```

### Deployment Steps - Level 1

1. **Prepare Environment**
   ```bash
   cd /home/lawrence/fe-scada-dashboard
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Create Network** (if doesn't exist)
   ```bash
   docker network create internal_net || true
   ```

3. **Build and Deploy**
   ```bash
   docker compose up -d --build
   ```

4. **Verify Deployment**
   ```bash
   # Check container status
   docker compose logs -f fe-scada

   # Verify database
   ls -la data/dev.db

   # Test locally
   curl http://localhost:8080
   ```

5. **Access Points**
   - **Local:** http://localhost:8080
   - **LAN:** http://192.168.1.x:8080
   - **Public (via Cloudflare Tunnel):** https://study.databin.dev

### Cloudflare Tunnel Setup (Optional)

If you want public access via `study.databin.dev`:

1. **In Cloudflare Dashboard:**
   - Go to Zero Trust → Tunnels
   - Create/Edit your existing tunnel
   - Add public hostname: `study.databin.dev`
   - Point to: `http://fe-scada:3000` or `http://<LAN-IP>:8080`

2. **In tunnel config (if using config file):**
   ```yaml
   ingress:
     - hostname: study.databin.dev
       service: http://fe-scada:3000
     - service: http_status:404
   ```

---

## Level 2 — Add Postgres + Backups

**Goal:** Migrate from SQLite to PostgreSQL with automated nightly backups.

### Architecture

```
┌─────────────────────────────────────────────────┐
│   Docker Network: internal_net                  │
│                                                 │
│  ┌──────────────┐   ┌─────────────────────┐   │
│  │  fe-scada    │──▶│  postgres:16        │   │
│  │  :3000       │   │  db:5432            │   │
│  └──────────────┘   │  Volume: pgdata     │   │
│                      └─────────────────────┘   │
│                                ▲                │
│                                │                │
│                      ┌─────────────────────┐   │
│                      │  pgback (daily)     │   │
│                      │  Backups → ./backups│   │
│                      └─────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Configuration

**docker-compose.level2.yml**
```yaml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    container_name: fe-scada-db
    environment:
      - POSTGRES_DB=study
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=${PG_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - internal_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d study"]
      interval: 10s
      timeout: 5s
      retries: 5

  fe-scada:
    build: .
    container_name: fe-scada
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://appuser:${PG_PASSWORD}@db:5432/study
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8080:3000"
    restart: unless-stopped
    networks:
      - internal_net

  pgbackup:
    image: prodrigestivill/postgres-backup-local:16
    container_name: fe-scada-backup
    environment:
      - POSTGRES_HOST=db
      - POSTGRES_DB=study
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=${PG_PASSWORD}
      - SCHEDULE=@daily
      - BACKUP_DIR=/backups
      - BACKUP_KEEP_DAYS=7
      - BACKUP_KEEP_WEEKS=4
      - BACKUP_KEEP_MONTHS=6
      - HEALTHCHECK_PORT=8080
    volumes:
      - ./backups:/backups
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - internal_net

volumes:
  pgdata:

networks:
  internal_net:
    external: true
```

**Environment Updates (.env)**
```env
# Database (PostgreSQL - Level 2)
DATABASE_URL="postgresql://appuser:${PG_PASSWORD}@db:5432/study"
PG_PASSWORD="your-secure-password-here"

# Application
NEXT_PUBLIC_APP_NAME="FE+SCADA Dashboard"

# Theming
COLOR_ACCENT="#0f3d1e"
```

### Migration Steps - Level 1 to Level 2

1. **Backup SQLite Data**
   ```bash
   # Export existing data (if any)
   docker exec fe-scada npx prisma db pull
   docker cp fe-scada:/app/data/dev.db ./backup-sqlite-$(date +%Y%m%d).db
   ```

2. **Update Prisma Schema**
   ```bash
   # Edit prisma/schema.prisma
   # Change provider from "sqlite" to "postgresql"
   ```

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Update Environment**
   ```bash
   # Add to .env
   echo 'PG_PASSWORD=YourSecurePasswordHere' >> .env
   ```

4. **Deploy Level 2**
   ```bash
   # Stop Level 1
   docker compose down

   # Start Level 2
   docker compose -f docker-compose.level2.yml up -d --build

   # Run migrations
   docker exec fe-scada npx prisma migrate deploy

   # Verify
   docker compose -f docker-compose.level2.yml logs -f
   ```

5. **Verify Backups**
   ```bash
   # Check backup directory
   ls -lh backups/

   # Manual backup test
   docker exec fe-scada-backup backup
   ```

### Backup Management

```bash
# View backup logs
docker logs fe-scada-backup

# Manual backup
docker exec fe-scada-backup backup

# Restore from backup
docker exec -i fe-scada-db psql -U appuser -d study < backups/latest.sql

# List backups
ls -lh backups/
```

---

## Level 3 — Auth, Historian & SCADA Integrations

**Goal:** Add user authentication, SCADA data ingestion, and advanced monitoring.

### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│   Docker Network: internal_net                               │
│                                                              │
│  ┌─────────────┐   ┌──────────┐   ┌─────────────────────┐  │
│  │  fe-scada   │──▶│ postgres │   │  Node-RED :1880     │  │
│  │  :3000      │   │  :5432   │   │  SCADA Simulator    │  │
│  │  + NextAuth │   └──────────┘   └──────────┬──────────┘  │
│  └─────────────┘                              │             │
│                                                ▼             │
│                      ┌─────────────────────────────────┐    │
│                      │  Mosquitto MQTT :1883           │    │
│                      │  plant/level, plant/temp        │    │
│                      └─────────────────────────────────┘    │
│                                                              │
│  Optional:                                                   │
│  ┌─────────────┐   ┌──────────────┐                        │
│  │  InfluxDB   │   │  Grafana     │                        │
│  │  Historian  │   │  :3001       │                        │
│  └─────────────┘   └──────────────┘                        │
└──────────────────────────────────────────────────────────────┘
```

### Features Added

1. **Authentication** (NextAuth.js or Clerk)
   - Email/password login
   - OAuth (Google, GitHub)
   - Session management
   - Protected routes

2. **SCADA Simulator** (Node-RED)
   - Tank level simulation
   - Temperature sensors
   - MQTT publisher
   - Web UI at :1880

3. **MQTT Broker** (Mosquitto)
   - Message bus for SCADA data
   - Topics: `plant/level`, `plant/temp`
   - WebSocket support

4. **Optional: Historian**
   - InfluxDB for time-series data
   - Grafana dashboards
   - Embedded panels in main app

### Configuration

**docker-compose.level3.yml**
```yaml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    container_name: fe-scada-db
    environment:
      - POSTGRES_DB=study
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=${PG_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - internal_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d study"]
      interval: 10s
      timeout: 5s
      retries: 5

  fe-scada:
    build: .
    container_name: fe-scada
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://appuser:${PG_PASSWORD}@db:5432/study
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - MQTT_BROKER=mqtt://mosquitto:1883
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8080:3000"
    restart: unless-stopped
    networks:
      - internal_net

  mosquitto:
    image: eclipse-mosquitto:2
    container_name: fe-scada-mqtt
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    restart: unless-stopped
    networks:
      - internal_net

  nodered:
    image: nodered/node-red:latest
    container_name: fe-scada-nodered
    ports:
      - "1880:1880"
    volumes:
      - nodered_data:/data
    environment:
      - TZ=America/New_York
    restart: unless-stopped
    networks:
      - internal_net

  pgbackup:
    image: prodrigestivill/postgres-backup-local:16
    container_name: fe-scada-backup
    environment:
      - POSTGRES_HOST=db
      - POSTGRES_DB=study
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=${PG_PASSWORD}
      - SCHEDULE=@daily
      - BACKUP_DIR=/backups
      - BACKUP_KEEP_DAYS=7
      - BACKUP_KEEP_WEEKS=4
      - BACKUP_KEEP_MONTHS=6
    volumes:
      - ./backups:/backups
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - internal_net

  # Optional: InfluxDB + Grafana
  influxdb:
    image: influxdb:2.7-alpine
    container_name: fe-scada-influx
    ports:
      - "8086:8086"
    volumes:
      - influxdb_data:/var/lib/influxdb2
    environment:
      - DOCKER_INFLUXDB_INIT_MODE=setup
      - DOCKER_INFLUXDB_INIT_USERNAME=${INFLUX_USER}
      - DOCKER_INFLUXDB_INIT_PASSWORD=${INFLUX_PASSWORD}
      - DOCKER_INFLUXDB_INIT_ORG=databin
      - DOCKER_INFLUXDB_INIT_BUCKET=scada
    restart: unless-stopped
    networks:
      - internal_net

  grafana:
    image: grafana/grafana:latest
    container_name: fe-scada-grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_INSTALL_PLUGINS=grafana-clock-panel
    restart: unless-stopped
    networks:
      - internal_net

volumes:
  pgdata:
  nodered_data:
  influxdb_data:
  grafana_data:

networks:
  internal_net:
    external: true
```

**Environment Updates (.env)**
```env
# Database
DATABASE_URL="postgresql://appuser:${PG_PASSWORD}@db:5432/study"
PG_PASSWORD="your-secure-password-here"

# Authentication (NextAuth)
NEXTAUTH_URL="https://study.databin.dev"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# MQTT (optional)
MQTT_BROKER="mqtt://mosquitto:1883"

# InfluxDB (optional)
INFLUX_USER="admin"
INFLUX_PASSWORD="your-influx-password"

# Grafana (optional)
GRAFANA_PASSWORD="your-grafana-password"

# Application
NEXT_PUBLIC_APP_NAME="FE+SCADA Dashboard"
COLOR_ACCENT="#0f3d1e"
```

### Deployment Steps - Level 2 to Level 3

1. **Generate Auth Secret**
   ```bash
   openssl rand -base64 32
   # Add to .env as NEXTAUTH_SECRET
   ```

2. **Create Mosquitto Config**
   ```bash
   mkdir -p mosquitto/config mosquitto/data mosquitto/log
   cat > mosquitto/config/mosquitto.conf <<EOF
   listener 1883
   allow_anonymous true
   persistence true
   persistence_location /mosquitto/data/
   log_dest file /mosquitto/log/mosquitto.log
   EOF
   ```

3. **Deploy Level 3**
   ```bash
   docker compose -f docker-compose.level3.yml up -d --build
   ```

4. **Configure Node-RED**
   - Open http://localhost:1880
   - Install MQTT nodes: `node-red-contrib-mqtt-broker`
   - Create flow:
     ```
     [Inject] → [Function] → [MQTT Out]
     ```
   - Function code:
     ```js
     msg.payload = {
       timestamp: new Date().toISOString(),
       level: Math.random() * 100,
       temp: 20 + Math.random() * 10
     };
     return msg;
     ```
   - MQTT Out topic: `plant/level`

5. **Verify Services**
   ```bash
   # Check all containers
   docker compose -f docker-compose.level3.yml ps

   # Test MQTT
   docker exec fe-scada-mqtt mosquitto_sub -t plant/# -v

   # Access Grafana
   open http://localhost:3001
   ```

---

## Operations & Maintenance

### Daily Operations

```bash
# View logs
docker compose logs -f fe-scada

# Restart service
docker compose restart fe-scada

# Update and redeploy
git pull
docker compose up -d --build
```

### Backup & Restore

**Manual Backup (SQLite - Level 1)**
```bash
# Backup database
docker cp fe-scada:/app/data/dev.db ./backup-$(date +%Y%m%d).db

# Restore database
docker cp ./backup-20250101.db fe-scada:/app/data/dev.db
docker restart fe-scada
```

**Automated Backup (Postgres - Level 2+)**
```bash
# View backup schedule
docker logs fe-scada-backup

# Manual backup
docker exec fe-scada-backup backup

# Restore from backup
docker exec -i fe-scada-db psql -U appuser -d study < backups/daily/study-20250101.sql

# List all backups
ls -lh backups/{daily,weekly,monthly}/
```

### Monitoring

```bash
# Container stats
docker stats fe-scada fe-scada-db

# Database size
docker exec fe-scada-db psql -U appuser -d study -c "
SELECT pg_size_pretty(pg_database_size('study'));"

# Check disk usage
du -sh data/ backups/

# Health checks
docker compose ps
docker inspect fe-scada --format='{{.State.Health.Status}}'
```

### Updates

```bash
# Update application
git pull
docker compose up -d --build fe-scada

# Update all services
docker compose pull
docker compose up -d

# Clean old images
docker image prune -a
```

### Security Hardening

1. **Environment Variables**
   - Never commit `.env` to git
   - Use strong passwords (20+ characters)
   - Rotate secrets quarterly

2. **Network Security**
   - Use `internal_net` for inter-service communication
   - Only expose necessary ports
   - Use Cloudflare Tunnel for public access (encrypted)

3. **Database Security**
   ```bash
   # Create read-only user (if needed)
   docker exec fe-scada-db psql -U appuser -d study -c "
   CREATE USER readonly WITH PASSWORD 'readonly-pass';
   GRANT CONNECT ON DATABASE study TO readonly;
   GRANT USAGE ON SCHEMA public TO readonly;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
   "
   ```

4. **TLS/HTTPS**
   - Cloudflare provides TLS at edge
   - Optional: Add Caddy/Traefik for internal TLS

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs fe-scada

# Check port conflicts
ss -tunlp | grep :8080

# Verify network
docker network inspect internal_net

# Check environment
docker exec fe-scada env | grep DATABASE_URL
```

### Database Connection Issues

```bash
# Test database connection
docker exec fe-scada npx prisma db pull

# Check Postgres status
docker exec fe-scada-db pg_isready -U appuser

# View Postgres logs
docker logs fe-scada-db

# Verify credentials
docker exec fe-scada-db psql -U appuser -d study -c "SELECT version();"
```

### Migration Failures

```bash
# Reset migrations (WARNING: deletes data)
docker exec fe-scada npx prisma migrate reset

# Apply migrations
docker exec fe-scada npx prisma migrate deploy

# Generate Prisma Client
docker exec fe-scada npx prisma generate
```

### MQTT Issues (Level 3)

```bash
# Test MQTT broker
docker exec fe-scada-mqtt mosquitto_sub -t '#' -v

# Publish test message
docker exec fe-scada-mqtt mosquitto_pub -t 'test' -m 'hello'

# Check Mosquitto logs
docker logs fe-scada-mqtt
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Database performance
docker exec fe-scada-db psql -U appuser -d study -c "
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"

# Clear Next.js cache
docker exec fe-scada rm -rf .next/cache
docker restart fe-scada
```

---

## Upgrade Paths

### Current: Level 1 → Level 2
**Time:** ~30 minutes
**Risk:** Low (data export/import required)
**Downtime:** 5-10 minutes

### Level 2 → Level 3
**Time:** ~1 hour
**Risk:** Low (additive changes)
**Downtime:** None (rolling update)

### Future Enhancements

1. **High Availability**
   - Postgres replication (streaming)
   - Redis for session storage
   - Load balancer (HAProxy/Nginx)

2. **Advanced Monitoring**
   - Prometheus + Alertmanager
   - Loki for log aggregation
   - Uptime Kuma for status page

3. **CI/CD Pipeline**
   - GitHub Actions for builds
   - Automated testing
   - Staging environment

---

## Quick Reference

### Essential Commands

```bash
# Deploy/Update
docker compose up -d --build

# Stop
docker compose down

# Logs
docker compose logs -f [service]

# Shell access
docker exec -it fe-scada sh

# Database shell
docker exec -it fe-scada-db psql -U appuser -d study

# Backup now
docker exec fe-scada-backup backup

# Health check
docker compose ps
```

### Port Mapping

| Service | Internal | External | Purpose |
|---------|----------|----------|---------|
| fe-scada | 3000 | 8080 | Main app |
| postgres | 5432 | - | Database |
| mosquitto | 1883 | 1883 | MQTT |
| mosquitto-ws | 9001 | 9001 | MQTT WebSocket |
| nodered | 1880 | 1880 | SCADA sim |
| grafana | 3000 | 3001 | Dashboards |
| influxdb | 8086 | 8086 | Time-series DB |

### File Locations

| Data | Location |
|------|----------|
| SQLite DB | `./data/dev.db` |
| Postgres Data | Docker volume `pgdata` |
| Backups | `./backups/{daily,weekly,monthly}/` |
| Node-RED flows | Docker volume `nodered_data` |
| Mosquitto config | `./mosquitto/config/` |
| Environment | `.env` (gitignored) |

---

## Support & Resources

- **Project Docs:** `/home/lawrence/fe-scada-dashboard/README.md`
- **Development Guide:** `/home/lawrence/fe-scada-dashboard/CLAUDE.md`
- **Server Setup:** `/home/lawrence/CURRENT_SERVER_SETUP.md`

**Version:** 1.0.0
**Last Updated:** 2025-10-23
**Deployment Level:** Level 1 (SQLite, single container)
