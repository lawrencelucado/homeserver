#!/bin/bash
# Deploy Level 1: SQLite, single container
# Usage: ./scripts/deploy-level1.sh

set -e

echo "🚀 Deploying FE-SCADA Dashboard - Level 1 (SQLite)"
echo "=================================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your values."
    echo "   Then run this script again."
    exit 1
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

# Create data directory
echo "📁 Checking data directory..."
mkdir -p data
echo "   ✅ Data directory ready"

# Build and deploy
echo "🏗️  Building and deploying..."
docker compose up -d --build

# Wait for container to be healthy
echo "⏳ Waiting for container to be ready..."
sleep 5

# Check status
if docker ps | grep -q fe-scada; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Access your dashboard:"
    echo "   Local:  http://localhost:8080"
    echo "   LAN:    http://$(hostname -I | awk '{print $1}'):8080"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Check logs: docker compose logs -f fe-scada"
    echo "   2. Verify database: ls -la data/dev.db"
    echo "   3. Set up Cloudflare Tunnel (optional)"
    echo ""
else
    echo "❌ Deployment failed. Check logs:"
    docker compose logs fe-scada
    exit 1
fi
