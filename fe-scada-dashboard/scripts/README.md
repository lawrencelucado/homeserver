# Deployment Scripts

Automation scripts for deploying and managing the FE-SCADA Dashboard.

## Deployment Scripts

### Level 1: SQLite (Minimal)

```bash
./scripts/deploy-level1.sh
```

- Single Next.js container
- SQLite database (`./data/dev.db`)
- Port 8080
- Minimal footprint

### Level 2: PostgreSQL + Backups

```bash
./scripts/deploy-level2.sh
```

- PostgreSQL 16 container
- Automated daily backups
- Backup retention (7d/4w/6m)
- Migration from Level 1

### Level 3: Full Stack

```bash
# Standard deployment
./scripts/deploy-level3.sh

# With historian (InfluxDB + Grafana)
./scripts/deploy-level3.sh --with-historian
```

- PostgreSQL + Backups
- MQTT Broker (Mosquitto)
- Node-RED for SCADA simulation
- NextAuth authentication
- Optional: InfluxDB + Grafana

## Management Scripts

### Backup

```bash
# Auto-detect database type
./scripts/backup.sh

# Specify type
./scripts/backup.sh sqlite
./scripts/backup.sh postgres
```

Creates timestamped backups in `./backups/` directory.

### Restore

```bash
# List available backups
./scripts/restore.sh

# Restore specific backup
./scripts/restore.sh backups/sqlite-20250123-120000.db
./scripts/restore.sh backups/postgres-20250123-120000.sql
```

Restores database from backup file.

### Upgrade

```bash
# Upgrade from current level to target level
./scripts/upgrade.sh level2  # Level 1 → Level 2
./scripts/upgrade.sh level3  # Level 1/2 → Level 3
```

Handles upgrades between deployment levels.

## Script Features

### All deployment scripts include:
- ✅ Environment validation
- ✅ Network creation
- ✅ Directory setup
- ✅ Configuration generation
- ✅ Health checks
- ✅ Status reporting

### Safety features:
- ⚠️  Backup before destructive operations
- 🔐 Auto-generate secure passwords
- 🛡️  Confirmation prompts for data loss
- 📝 Detailed logging

## Quick Reference

```bash
# Fresh deployment
./scripts/deploy-level1.sh

# Upgrade to PostgreSQL
./scripts/upgrade.sh level2

# Upgrade to full stack
./scripts/upgrade.sh level3

# Backup database
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh backups/postgres-latest.sql

# View logs
docker compose logs -f fe-scada

# Stop services
docker compose down

# Update and restart
git pull && docker compose up -d --build
```

## Troubleshooting

### Scripts fail with "permission denied"

```bash
chmod +x scripts/*.sh
```

### "Network internal_net not found"

```bash
docker network create internal_net
```

### "Container already exists"

```bash
# Stop and remove existing containers
docker compose down
./scripts/deploy-level1.sh
```

### Environment variables not loaded

```bash
# Check .env file exists
ls -la .env

# Verify contents
cat .env

# Recreate from example
cp .env.example .env
```

## File Locations

| Data Type | Location |
|-----------|----------|
| Scripts | `./scripts/` |
| Backups | `./backups/` |
| SQLite DB | `./data/dev.db` |
| Environment | `./.env` |
| Compose files | `./docker-compose*.yml` |
| Mosquitto config | `./mosquitto/config/` |

## Support

For detailed deployment instructions, see:
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Complete deployment guide
- [README.md](../README.md) - Project documentation
- [CLAUDE.md](../CLAUDE.md) - Development guide
