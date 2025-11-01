#!/bin/bash
# Deploy Level 3: Auth + MQTT + SCADA Integrations
# Usage: ./scripts/deploy-level3.sh [--with-historian]

set -e

WITH_HISTORIAN=false
if [ "$1" = "--with-historian" ]; then
    WITH_HISTORIAN=true
fi

echo "🚀 Deploying FE-SCADA Dashboard - Level 3 (Full Stack)"
echo "======================================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it first."
    exit 1
fi

# Check and add missing environment variables
echo "🔧 Checking environment variables..."

if ! grep -q "NEXTAUTH_SECRET=" .env; then
    echo "   Adding NEXTAUTH_SECRET..."
    echo "" >> .env
    echo "# NextAuth (Level 3)" >> .env
    echo "NEXTAUTH_URL=http://localhost:8080" >> .env
    echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
fi

if ! grep -q "PG_PASSWORD=" .env; then
    echo "   Adding PG_PASSWORD..."
    echo "PG_PASSWORD=$(openssl rand -base64 16)" >> .env
fi

if [ "$WITH_HISTORIAN" = true ]; then
    if ! grep -q "INFLUX_PASSWORD=" .env; then
        echo "   Adding InfluxDB credentials..."
        echo "" >> .env
        echo "# InfluxDB (Level 3 - Historian)" >> .env
        echo "INFLUX_USER=admin" >> .env
        echo "INFLUX_PASSWORD=$(openssl rand -base64 16)" >> .env
    fi

    if ! grep -q "GRAFANA_PASSWORD=" .env; then
        echo "   Adding Grafana password..."
        echo "GRAFANA_PASSWORD=$(openssl rand -base64 16)" >> .env
    fi
fi

echo "   ✅ Environment variables ready"

# Create network
echo "📡 Checking Docker network..."
if ! docker network ls | grep -q internal_net; then
    docker network create internal_net
    echo "   ✅ Network created"
else
    echo "   ✅ Network exists"
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p backups
mkdir -p mosquitto/{config,data,log}
echo "   ✅ Directories ready"

# Create Mosquitto config
echo "📝 Creating Mosquitto configuration..."
cat > mosquitto/config/mosquitto.conf <<EOF
listener 1883
allow_anonymous true
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
log_dest stdout
log_type all
EOF
echo "   ✅ Mosquitto config created"

# Update Prisma schema for PostgreSQL
if grep -q 'provider = "sqlite"' prisma/schema.prisma; then
    echo "   Updating Prisma schema to PostgreSQL..."
    sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
fi

# Build and deploy
echo "🏗️  Building and deploying Level 3..."
if [ "$WITH_HISTORIAN" = true ]; then
    echo "   Including Historian stack (InfluxDB + Grafana)..."
    docker compose -f docker-compose.level3.yml --profile historian up -d --build
else
    docker compose -f docker-compose.level3.yml up -d --build
fi

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 15

# Run migrations
echo "🔄 Running database migrations..."
docker exec fe-scada npx prisma migrate deploy || {
    echo "   Running fresh migration..."
    docker exec fe-scada npx prisma migrate dev --name init
}

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
docker exec fe-scada npx prisma generate

# Test MQTT
echo "🧪 Testing MQTT broker..."
if docker exec fe-scada-mqtt mosquitto_pub -t 'test' -m 'hello' 2>/dev/null; then
    echo "   ✅ MQTT broker working"
else
    echo "   ⚠️  MQTT test failed (may need manual check)"
fi

# Check all services
echo ""
echo "✅ Level 3 deployment successful!"
echo ""
echo "📊 Services running:"
docker compose -f docker-compose.level3.yml ps
echo ""
echo "📝 Access points:"
echo "   Dashboard:    http://localhost:8080"
echo "   Node-RED:     http://localhost:1880"
echo "   MQTT Broker:  mqtt://localhost:1883"

if [ "$WITH_HISTORIAN" = true ]; then
    echo "   Grafana:      http://localhost:3001 (admin / check .env for password)"
    echo "   InfluxDB:     http://localhost:8086 (admin / check .env for password)"
fi

echo ""
echo "🔐 Security:"
echo "   NextAuth:     Configured (check NEXTAUTH_SECRET in .env)"
echo "   Postgres:     Password protected (check PG_PASSWORD in .env)"
echo "   MQTT:         Anonymous (secure for internal network only)"
echo ""
echo "💾 Backups:"
echo "   Schedule:     Daily at midnight"
echo "   Location:     ./backups/"
echo ""
echo "📝 Next steps:"
echo "   1. Configure Node-RED flow at http://localhost:1880"
echo "   2. Test MQTT: docker exec fe-scada-mqtt mosquitto_sub -t '#' -v"
echo "   3. Check logs: docker compose -f docker-compose.level3.yml logs -f"
echo "   4. Set up authentication in your Next.js app"

if [ "$WITH_HISTORIAN" = true ]; then
    echo "   5. Configure InfluxDB data sources in Grafana"
    echo "   6. Create dashboards for SCADA metrics"
fi

echo ""
echo "🎉 Full stack deployment complete!"
