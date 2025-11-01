# Self-Hosted Setup - Ready to Run!

## ✅ What I've Prepared For You

I've set up everything you need for a **100% self-hosted** photo and blog management system. No cloud services required!

### Files Created:

```
✅ prisma/schema.prisma          - Database schema (Gallery + Blog + Admin)
✅ prisma/seed.ts                 - Creates admin user automatically
✅ .env                          - Environment configuration (with generated secret)
✅ .env.example                  - Template for future reference
✅ .gitignore                    - Protects database and uploads from git
✅ setup-self-hosted.sh          - Automated setup script
✅ docker-compose.self-hosted.yml - Docker configuration for deployment
✅ docker-compose.postgres.yml   - Alternative PostgreSQL setup (if needed later)
```

### Directories Created:

```
✅ data/                - SQLite database location
✅ backups/            - Database backups location
✅ public/uploads/     - Image uploads
  ├── gallery/
  │   ├── before/
  │   └── after/
  └── blog/
      ├── featured/
      └── content/
```

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended)

```bash
cd /home/lawrence/perez_fashion

# Run the automated setup script
./setup-self-hosted.sh
```

This script will:
1. Install all dependencies
2. Generate Prisma client
3. Create SQLite database
4. Create admin user
5. Verify everything works

### Option 2: Manual Setup

```bash
cd /home/lawrence/perez_fashion

# Install dependencies
npm install prisma @prisma/client next-auth bcryptjs sharp tsx
npm install --save-dev @types/bcryptjs @types/next-auth

# Generate Prisma client
npx prisma generate

# Create database
npx prisma migrate dev --name init

# Create admin user
npm run db:seed
```

---

## 🔐 Default Admin Credentials

After setup:

**Email:** `contact@perezfashion.com`
**Password:** `perezfashion2024`

⚠️ **CHANGE THIS PASSWORD** after first login!

---

## 🧪 Test Locally

```bash
# Start development server
npm run dev
```

Then visit:
- Main site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

---

## 🐳 Deploy with Docker

### Step 1: Copy the self-hosted Docker config

```bash
# Backup current docker-compose (if needed)
cp docker-compose.yml docker-compose.yml.backup

# Use the self-hosted configuration
cp docker-compose.self-hosted.yml docker-compose.yml
```

### Step 2: Build and run

```bash
# Stop current container (if running)
docker compose down

# Build and start with new config
docker compose up -d --build

# View logs
docker compose logs -f
```

### Step 3: Access your site

- Main site: https://perezfashion.com
- Admin: https://perezfashion.com/admin/login

---

## 📂 Database Location

Your entire database is a single file:

```
/home/lawrence/perez_fashion/data/db.sqlite
```

**This file contains ALL your gallery items, blog posts, and admin users.**

---

## 💾 Backup Your Data

### Manual Backup

```bash
# Backup database
cp data/db.sqlite backups/db-$(date +%Y%m%d).sqlite

# Backup uploads
tar -czf backups/uploads-$(date +%Y%m%d).tar.gz public/uploads
```

### Automated Daily Backup

I'll create a cron job script for you once the basic system is working.

---

## 🛠️ Useful Commands

```bash
# Database commands
npm run db:generate     # Regenerate Prisma client
npm run db:migrate      # Create/apply database migrations
npm run db:seed         # Reset admin user
npm run db:studio       # Open GUI database viewer

# Development
npm run dev             # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# View database directly
sqlite3 data/db.sqlite
```

---

## 📊 What Happens Next

Once setup is complete, I'll build the admin panel with:

### Gallery Management
- Upload before/after photos
- Add titles and descriptions
- Show/hide items
- Reorder by drag-and-drop
- Categories

### Blog Management
- Write posts with rich text editor
- Upload featured images
- Draft/Published status
- SEO-friendly URLs
- Tags and categories

### File Upload
- Drag & drop interface
- Automatic image optimization
- Local storage (no cloud)

---

## 🎯 Architecture Summary

```
Your Home Server
├── Next.js App (Docker container)
│   ├── SQLite Database (data/db.sqlite)
│   ├── Uploaded Images (public/uploads/)
│   └── NextAuth.js (local authentication)
└── Cloudflare Tunnel (internet access)
```

**Zero cloud dependencies!**

---

## 📚 Full Documentation

- **SELF_HOSTED_ARCHITECTURE.md** - Complete technical architecture
- **SELF_HOSTED_QUICKSTART.md** - Detailed setup guide
- **CLOUDFLARE_TUNNEL_SETUP.md** - Connect to internet (optional)

---

## ❓ Troubleshooting

### "Can't find module '@prisma/client'"
```bash
npx prisma generate
```

### "Error: P1003: Database does not exist"
```bash
npx prisma migrate dev --name init
```

### "Admin login fails"
```bash
npm run db:seed  # Reset admin user
```

### Start fresh
```bash
# Delete database
rm data/db.sqlite

# Recreate
npx prisma migrate dev --name init
npm run db:seed
```

---

## ✅ Checklist

Before running setup:
- [x] Prisma schema created
- [x] Environment files configured
- [x] Directories created
- [x] Setup script ready

To complete setup:
- [ ] Run `./setup-self-hosted.sh`
- [ ] Test login at /admin/login
- [ ] Change admin password
- [ ] Add first gallery item

**Ready to run the setup? Execute `./setup-self-hosted.sh` now!**
