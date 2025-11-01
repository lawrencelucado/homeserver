#!/bin/bash

# Perez Fashion - Self-Hosted Setup Script
# This script sets up the self-hosted database and admin system

set -e  # Exit on error

echo "🏠 Perez Fashion - Self-Hosted Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js first: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1/5: Installing dependencies..."
npm install prisma @prisma/client next-auth bcryptjs sharp tsx
npm install --save-dev @types/bcryptjs @types/next-auth

echo "✓ Dependencies installed"
echo ""

# Step 2: Generate Prisma client
echo "🔨 Step 2/5: Generating Prisma client..."
npx prisma generate

echo "✓ Prisma client generated"
echo ""

# Step 3: Create database
echo "🗄️  Step 3/5: Creating SQLite database..."
npx prisma migrate dev --name init

echo "✓ Database created at data/db.sqlite"
echo ""

# Step 4: Seed database with admin user
echo "🌱 Step 4/5: Creating admin user..."
npm run db:seed

echo "✓ Admin user created"
echo ""

# Step 5: Verify setup
echo "✅ Step 5/5: Verifying setup..."

if [ -f "data/db.sqlite" ]; then
    echo "✓ Database file exists"
else
    echo "❌ Database file not found!"
    exit 1
fi

if [ -d "public/uploads" ]; then
    echo "✓ Upload directory exists"
else
    echo "❌ Upload directory not found!"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Visit the admin panel:"
echo "   http://localhost:3000/admin/login"
echo ""
echo "3. Login with:"
echo "   Email: contact@perezfashion.com"
echo "   Password: perezfashion2024"
echo ""
echo "4. ⚠️  IMPORTANT: Change the admin password after first login!"
echo ""
echo "5. To deploy with Docker:"
echo "   docker compose -f docker-compose.self-hosted.yml up -d --build"
echo ""
echo "📚 Documentation:"
echo "   - SELF_HOSTED_ARCHITECTURE.md - Complete architecture docs"
echo "   - SELF_HOSTED_QUICKSTART.md - Quick start guide"
echo ""
