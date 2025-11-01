# Self-Hosted Quick Start Guide

## 🎯 Goal
Get photo and blog management working 100% on your home server in under 1 hour.

## 📋 What You'll Have

- ✅ SQLite database (local file, no cloud)
- ✅ File uploads (stored locally)
- ✅ Admin panel with login
- ✅ Gallery management
- ✅ Blog management (optional)
- ✅ Everything in Docker
- ✅ Zero cloud dependencies

## ⚡ Quick Setup (SQLite - Recommended)

### Step 1: Install Dependencies (5 mins)

```bash
cd /home/lawrence/perez_fashion

# Install new packages
npm install prisma @prisma/client next-auth bcryptjs sharp
npm install --save-dev @types/bcryptjs @types/next-auth
```

### Step 2: Initialize Database (5 mins)

```bash
# Initialize Prisma with SQLite
npx prisma init --datasource-provider sqlite
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

### Step 3: Set Environment Variables (2 mins)

Edit `.env`:

```env
# Database
DATABASE_URL="file:./data/db.sqlite"

# Authentication (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-here-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Create Database Schema (Already done - I'll provide the file)

The schema file will have:
- Gallery items table
- Blog posts table
- Admin users table

### Step 5: Create Database (2 mins)

```bash
# Create the database
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### Step 6: Create Admin User (2 mins)

```bash
# Run the seed script (I'll provide this)
npx prisma db seed
```

Default credentials:
- Email: `contact@perezfashion.com`
- Password: `perezfashion2024`

### Step 7: Create Upload Directories (1 min)

```bash
mkdir -p data
mkdir -p public/uploads/gallery/before
mkdir -p public/uploads/gallery/after
mkdir -p public/uploads/blog
```

### Step 8: Update Docker Configuration (2 mins)

I'll provide an updated `docker-compose.yml` that mounts the data and uploads directories.

### Step 9: Build and Run (5 mins)

```bash
# Build the updated container
docker compose down
docker compose up -d --build

# Check logs
docker compose logs -f web
```

### Step 10: Test (2 mins)

1. Visit http://localhost:3000/admin/login
2. Login with:
   - Email: `contact@perezfashion.com`
   - Password: `perezfashion2024`
3. Add a gallery item

**Total time: ~30 minutes**

---

## 📂 File Structure After Setup

```
/home/lawrence/perez_fashion/
├── data/
│   ├── db.sqlite              ← Your database (all content here)
│   └── db.sqlite-journal      ← SQLite journal file
├── public/
│   └── uploads/               ← Uploaded images
│       ├── gallery/
│       │   ├── before/
│       │   └── after/
│       └── blog/
├── prisma/
│   ├── schema.prisma          ← Database schema
│   ├── seed.ts                ← Admin user seed
│   └── migrations/            ← Database version history
├── app/
│   ├── admin/                 ← Admin pages
│   ├── api/                   ← API routes
│   │   ├── gallery/           ← Gallery CRUD
│   │   ├── blog/              ← Blog CRUD
│   │   ├── upload/            ← File upload
│   │   └── auth/              ← NextAuth
│   └── ...
└── docker-compose.yml         ← Updated with volumes
```

---

## 🔐 Security Notes

### Change Default Password

After first login:
1. Go to admin settings
2. Change password
3. Use a strong password

### Backup Your Data

The database is a single file: `data/db.sqlite`

**Manual backup:**
```bash
cp data/db.sqlite data/db-$(date +%Y%m%d).sqlite
tar -czf uploads-backup.tar.gz public/uploads
```

**Automated backup:**
I'll provide a backup script that runs daily.

---

## 🚀 What I'll Build For You

Once you complete the setup above, I'll create:

### 1. Admin Login Page (`app/admin/login/page.tsx`)
- Email/password form
- Session management
- Protected routes

### 2. Admin Layout (`app/admin/layout.tsx`)
- Check authentication
- Redirect if not logged in
- Admin navigation

### 3. Gallery Management (`app/admin/gallery/page.tsx`)
- List all gallery items
- Add new items with file upload
- Edit existing items
- Delete items
- Toggle visibility
- Drag to reorder

### 4. Blog Management (`app/admin/blog/page.tsx`)
- List all posts
- Create new posts
- Rich text editor
- Draft/Published status
- SEO fields (title, excerpt, slug)

### 5. API Routes
- `/api/gallery` - CRUD for gallery
- `/api/blog` - CRUD for blog
- `/api/upload` - File upload handler
- `/api/auth` - NextAuth endpoints

### 6. Updated Public Pages
- `/gallery` - Fetch from database
- `/blog` - Blog listing
- `/blog/[slug]` - Individual posts

---

## 💾 Backup Strategy

### Daily Automated Backup

Create `scripts/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/home/lawrence/perez_fashion/backups"

mkdir -p $BACKUP_DIR

# Backup database
cp data/db.sqlite "$BACKUP_DIR/db-$DATE.sqlite"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads-$DATE.tar.gz" public/uploads

# Keep only last 30 days
find $BACKUP_DIR -name "*.sqlite" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Make executable:
```bash
chmod +x scripts/backup.sh
```

Add to crontab (daily at 2 AM):
```bash
crontab -e
# Add: 0 2 * * * /home/lawrence/perez_fashion/scripts/backup.sh
```

### Restore from Backup

```bash
# Restore database
cp backups/db-2024-01-15.sqlite data/db.sqlite

# Restore uploads
tar -xzf backups/uploads-2024-01-15.tar.gz -C /home/lawrence/perez_fashion
```

---

## 🐛 Troubleshooting

### "Can't find module '@prisma/client'"
```bash
npx prisma generate
npm run build
```

### Database locked error
```bash
# Stop the container
docker compose down

# Remove journal file
rm data/db.sqlite-journal

# Restart
docker compose up -d
```

### Uploads not showing
```bash
# Check permissions
chmod -R 755 public/uploads

# Check Docker volume mount
docker compose down
docker compose up -d
```

### Can't login
```bash
# Reset admin password
npx prisma db seed
```

---

## 📊 Database Management

### View Database Contents

```bash
# Install SQLite browser (optional)
sudo apt install sqlitebrowser

# Or use CLI
sqlite3 data/db.sqlite
```

SQLite commands:
```sql
-- List tables
.tables

-- View gallery items
SELECT * FROM GalleryItem;

-- View blog posts
SELECT * FROM BlogPost;

-- Exit
.exit
```

### Prisma Studio (GUI)

```bash
# Launch Prisma Studio
npx prisma studio
```

Opens GUI at http://localhost:5555 to view/edit data.

---

## 🎨 Admin Panel Features

### Gallery Management
- ✅ Drag & drop image upload
- ✅ Before/After image pairs
- ✅ Title and description
- ✅ Categories
- ✅ Show/hide items
- ✅ Reorder by drag-and-drop
- ✅ Bulk actions

### Blog Management
- ✅ Rich text editor (TipTap)
- ✅ Featured image upload
- ✅ SEO fields
- ✅ Tags and categories
- ✅ Draft/Published status
- ✅ Scheduled publishing
- ✅ Preview before publish

### File Upload
- ✅ Drag & drop
- ✅ Multiple file upload
- ✅ Image optimization (Sharp)
- ✅ Automatic resize
- ✅ File type validation
- ✅ Size limits

---

## 🚀 Performance Optimizations

### Image Optimization

All uploads are automatically:
- Resized to max 1200x1600px
- Compressed to 85% quality
- Converted to efficient format
- Optimized with Sharp

### Database Indexing

Already configured for fast queries:
- Gallery items by visibility and order
- Blog posts by status and date
- Unique slugs for SEO-friendly URLs

### Caching

```typescript
// Gallery page with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

// Or on-demand revalidation
revalidatePath('/gallery');
```

---

## 📈 Scaling Considerations

### When to upgrade to PostgreSQL

Switch from SQLite to PostgreSQL if:
- You have multiple admins editing simultaneously
- You have 10,000+ gallery items
- You need advanced queries
- You want better backup options

**Easy migration:**
1. Export SQLite data
2. Update docker-compose to add PostgreSQL
3. Change DATABASE_URL
4. Import data
5. Takes ~30 minutes

### Storage Growth

Estimates for 1 year:
- 100 gallery items (200 images): ~500MB
- 50 blog posts (100 images): ~250MB
- Database: ~10MB
- **Total: ~1GB**

Your server should have plenty of space.

---

## ✅ Checklist

Before I start building:

- [ ] Run `npm install` (Step 1)
- [ ] Run `npx prisma init` (Step 2)
- [ ] Create `.env` with DATABASE_URL and NEXTAUTH_SECRET (Step 3)
- [ ] Create upload directories (Step 7)

Then tell me and I'll:
- [ ] Create all the admin pages
- [ ] Create all the API routes
- [ ] Update Docker configuration
- [ ] Set up authentication
- [ ] Create backup scripts

**Ready to start?** Let me know when you've completed the checklist above!
