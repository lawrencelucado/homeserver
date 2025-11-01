# Self-Hosted Architecture - No Cloud Dependencies

## 🏠 100% Home Server Solution

Everything runs on your home server. Zero cloud services. Complete control.

```
┌─────────────────────────────────────────────────────────┐
│              Your Home Server (Richmond, TX)            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Docker Container: Next.js App          │  │
│  │                  (Port 3000)                     │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│         ┌───────────┼───────────┐                      │
│         ↓           ↓           ↓                      │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐            │
│  │ SQLite   │ │ Local    │ │ NextAuth.js │            │
│  │ Database │ │ Files    │ │ (Auth)      │            │
│  │ (1 file) │ │ Storage  │ │ (Session)   │            │
│  └──────────┘ └──────────┘ └─────────────┘            │
│      ↓            ↓                                     │
│  /data/       /uploads/                                 │
│  db.sqlite    gallery/                                  │
│               blog/                                     │
└─────────────────────────────────────────────────────────┘
         ↑
         │ (Cloudflare Tunnel for internet access)
         │
    Public Internet
```

## Two Options: SQLite vs PostgreSQL

### Option 1: SQLite (⭐ RECOMMENDED for simplicity)

**Pros:**
- ✅ Zero configuration
- ✅ Single file database
- ✅ No separate container needed
- ✅ Perfect for small to medium data
- ✅ Fast for reads
- ✅ Built into Node.js ecosystem

**Cons:**
- ⚠️ One writer at a time (fine for single admin)
- ⚠️ Not ideal for 100,000+ records (you'll never hit this)

**Perfect for your use case**

### Option 2: PostgreSQL in Docker

**Pros:**
- ✅ More robust
- ✅ Better for concurrent writes
- ✅ Industry standard
- ✅ Advanced features

**Cons:**
- ⚠️ Another container to manage
- ⚠️ More memory usage
- ⚠️ Overkill for small business

**Only if you expect heavy growth**

---

## Recommended Stack (Self-Hosted)

```yaml
Components:
  - Database: SQLite (single file at /data/db.sqlite)
  - ORM: Prisma or Drizzle (type-safe database access)
  - File Storage: Local filesystem (/uploads or /public/uploads)
  - Authentication: NextAuth.js with credentials provider
  - Sessions: File-based or SQLite
  - Image Processing: Sharp (local image optimization)
  - Backup: Simple rsync or tar to external drive
```

## Database Schema (Works with SQLite or PostgreSQL)

```sql
-- Gallery items
CREATE TABLE gallery_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  before_image_path TEXT NOT NULL,  -- Local path: /uploads/gallery/before/xyz.jpg
  after_image_path TEXT NOT NULL,   -- Local path: /uploads/gallery/after/xyz.jpg
  category TEXT DEFAULT 'general',
  is_visible INTEGER DEFAULT 1,     -- SQLite uses 0/1 for boolean
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_path TEXT,
  category TEXT DEFAULT 'general',
  tags TEXT,  -- JSON string: '["tag1","tag2"]'
  status TEXT DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Admin users
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_gallery_visible ON gallery_items(is_visible, display_order);
CREATE INDEX idx_blog_status ON blog_posts(status, published_at);
CREATE INDEX idx_blog_slug ON blog_posts(slug);
```

## File Storage Structure

```
/home/lawrence/perez_fashion/
├── data/                      # Database and persistent data
│   ├── db.sqlite             # SQLite database
│   └── backups/              # Database backups
│       ├── db-2024-01-15.sqlite
│       └── db-2024-01-16.sqlite
├── uploads/                   # Uploaded files (mounted as Docker volume)
│   ├── gallery/
│   │   ├── before/
│   │   │   ├── 1705364891-wedding-dress.jpg
│   │   │   └── 1705364892-suit.jpg
│   │   └── after/
│   │       ├── 1705364891-wedding-dress.jpg
│   │       └── 1705364892-suit.jpg
│   └── blog/
│       ├── featured/
│       │   └── 1705364893-post-image.jpg
│       └── content/
│           └── 1705364894-inline-image.jpg
└── public/                    # Static files served by Next.js
    └── uploads -> ../uploads  # Symlink to uploads directory
```

## Docker Compose Configuration

### Option A: With SQLite Only

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: perez_fashion_web
    ports:
      - "8080:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./data/db.sqlite
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://perezfashion.com
    volumes:
      - ./data:/app/data                    # SQLite database
      - ./uploads:/app/public/uploads       # Uploaded files
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
```

### Option B: With PostgreSQL Container

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: perez_fashion_web
    ports:
      - "8080:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://perez:${DB_PASSWORD}@postgres:5432/perez_fashion
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://perezfashion.com
    volumes:
      - ./uploads:/app/public/uploads
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: perez_fashion_db
    environment:
      - POSTGRES_DB=perez_fashion
      - POSTGRES_USER=perez
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U perez"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Environment Variables (.env.local)

```env
# Database (choose one)
DATABASE_URL="file:./data/db.sqlite"
# OR
DATABASE_URL="postgresql://perez:yourpassword@localhost:5432/perez_fashion"

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp"

# Admin (initial setup only)
ADMIN_EMAIL="contact@perezfashion.com"
ADMIN_PASSWORD="changeme"  # Will be hashed
```

## Implementation with Prisma (Recommended ORM)

### Step 1: Install Dependencies

```bash
npm install prisma @prisma/client next-auth bcryptjs sharp
npm install --save-dev @types/bcryptjs
```

### Step 2: Initialize Prisma

```bash
npx prisma init --datasource-provider sqlite
```

### Step 3: Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model GalleryItem {
  id              Int      @id @default(autoincrement())
  title           String
  description     String?
  beforeImagePath String
  afterImagePath  String
  category        String   @default("general")
  isVisible       Boolean  @default(true)
  displayOrder    Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([isVisible, displayOrder])
}

model BlogPost {
  id               Int       @id @default(autoincrement())
  title            String
  slug             String    @unique
  content          String
  excerpt          String?
  featuredImagePath String?
  category         String    @default("general")
  tags             String?   // JSON string
  status           String    @default("draft")
  publishedAt      DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([status, publishedAt])
}

model AdminUser {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  name         String?
  role         String   @default("admin")
  createdAt    DateTime @default(now())
}
```

### Step 4: Create Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 5: Seed Admin User

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('perezfashion2024', 10);

  await prisma.adminUser.upsert({
    where: { email: 'contact@perezfashion.com' },
    update: {},
    create: {
      email: 'contact@perezfashion.com',
      passwordHash,
      name: 'Mary Perez',
      role: 'admin',
    },
  });

  console.log('Admin user created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
npx prisma db seed
```

## File Upload API (Local Storage)

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import sharp from 'sharp';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Create unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
    const filename = `${timestamp}-${sanitizedName}`;

    // Create directory if it doesn't exist
    const uploadPath = path.join(UPLOAD_DIR, folder);
    await mkdir(uploadPath, { recursive: true });

    // Read file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize image with Sharp
    const optimized = await sharp(buffer)
      .resize(1200, 1600, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Save file
    const filepath = path.join(uploadPath, filename);
    await writeFile(filepath, optimized);

    // Return public URL
    const publicPath = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

## Authentication with NextAuth.js

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## Backup Strategy (Self-Hosted)

### Daily Automated Backup Script

Create `scripts/backup.sh`:

```bash
#!/bin/bash

# Backup directory
BACKUP_DIR="/home/lawrence/perez_fashion/backups"
DATE=$(date +%Y-%m-%d-%H%M)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup SQLite database
cp /home/lawrence/perez_fashion/data/db.sqlite "$BACKUP_DIR/db-$DATE.sqlite"

# Backup uploaded files
tar -czf "$BACKUP_DIR/uploads-$DATE.tar.gz" /home/lawrence/perez_fashion/uploads

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "*.sqlite" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Add to Crontab

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/lawrence/perez_fashion/scripts/backup.sh >> /home/lawrence/perez_fashion/logs/backup.log 2>&1
```

## Advantages of Self-Hosted

✅ **Full control** - Your data, your server, your rules
✅ **No vendor lock-in** - Not dependent on any cloud service
✅ **Privacy** - Customer data never leaves your server
✅ **Cost** - No monthly cloud fees
✅ **Performance** - Local access is fast
✅ **Compliance** - Easier to meet data regulations

## Disadvantages to Consider

⚠️ **You manage backups** - Set up automated backups
⚠️ **You handle updates** - Keep software updated
⚠️ **Power outages** - Site goes down if server is off
⚠️ **Hardware failure** - Need backup strategy
⚠️ **Scaling** - Limited by your server hardware

## Recommended Hardware (For Reference)

Your current setup is likely fine, but for reference:

**Minimum:**
- 2GB RAM
- 20GB storage
- Stable internet connection

**Recommended:**
- 4GB RAM
- 50GB storage (for images)
- UPS (uninterruptible power supply)
- External backup drive

---

## Next Steps

I can implement this for you. Which option?

**Option 1: SQLite (Simpler)** ⭐
- No additional containers
- Everything in Next.js app
- Perfect for small business

**Option 2: PostgreSQL (More Robust)**
- Add Postgres container
- More powerful but more complex

Tell me which you prefer and I'll start building!
