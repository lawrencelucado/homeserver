#!/bin/bash
# Deploy Level 2: PostgreSQL + Backups
# Usage: ./scripts/deploy-level2.sh

set -e

echo "🚀 Deploying FE-SCADA Dashboard - Level 2 (PostgreSQL)"
echo "======================================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it first."
    exit 1
fi

# Check for PG_PASSWORD
if ! grep -q "PG_PASSWORD=" .env; then
    echo "⚠️  PG_PASSWORD not found in .env"
    echo "   Adding it now..."
    echo "" >> .env
    echo "# PostgreSQL password (Level 2)" >> .env
    echo "PG_PASSWORD=$(openssl rand -base64 16)" >> .env
    echo "   ✅ Generated random password"
fi

# Create network if doesn't exist
echo "📡 Checking Docker network..."
if ! docker network ls | grep -q internal_net; then
    echo "   Creating internal_net network..."
    docker network create internal_net
    echo "   ✅ Network created"
else
    echo "   ✅ Network exists"
fi

# Create backup directory
echo "📁 Creating backup directory..."
mkdir -p backups
echo "   ✅ Backup directory ready"

# Backup SQLite data if exists (migration from Level 1)
if [ -f data/dev.db ]; then
    echo "💾 Backing up SQLite database..."
    cp data/dev.db "backups/sqlite-backup-$(date +%Y%m%d-%H%M%S).db"
    echo "   ✅ SQLite backup created"
fi

# Update Prisma schema
echo "📝 Checking Prisma schema..."
if grep -q 'provider = "sqlite"' prisma/schema.prisma; then
    echo "   ⚠️  Schema still uses SQLite. Updating to PostgreSQL..."
    sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
    echo "   ✅ Schema updated"
else
    echo "   ✅ Schema already uses PostgreSQL"
fi

# Build and deploy
echo "🏗️  Building and deploying Level 2..."
docker compose -f docker-compose.level2.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
docker exec fe-scada npx prisma migrate deploy || {
    echo "⚠️  Migrations failed. Running fresh migration..."
    docker exec fe-scada npx prisma migrate dev --name init
}

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
docker exec fe-scada npx prisma generate

# Check status
if docker ps | grep -q fe-scada-db && docker ps | grep -q fe-scada; then
    echo ""
    echo "✅ Level 2 deployment successful!"
    echo ""
    echo "📊 Services running:"
    docker compose -f docker-compose.level2.yml ps
    echo ""
    echo "📝 Access points:"
    echo "   Dashboard:  http://localhost:8080"
    echo "   Database:   postgres://appuser@localhost:5432/study"
    echo ""
    echo "💾 Backups:"
    echo "   Schedule:   Daily at midnight"
    echo "   Location:   ./backups/"
    echo "   Retention:  7 days, 4 weeks, 6 months"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Check logs: docker compose -f docker-compose.level2.yml logs -f"
    echo "   2. Verify backups: ls -lh backups/"
    echo "   3. Test backup: docker exec fe-scada-backup backup"
    echo ""
else
    echo "❌ Deployment failed. Check logs:"
    docker compose -f docker-compose.level2.yml logs
    exit 1
fi
