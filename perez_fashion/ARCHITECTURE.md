# Perez Fashion - Web Architecture Design

## Current Problem
- Admin subdomain routing is unreliable
- No persistent data storage (changes lost on refresh)
- No proper authentication
- No file upload system

## Recommended Architecture

### Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
├─────────────────────────────────────────────────────────┤
│  Next.js 14 (App Router) + TailwindCSS + TypeScript    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  Authentication Layer                    │
├─────────────────────────────────────────────────────────┤
│              Supabase Auth (or NextAuth.js)             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                     API Routes                          │
├─────────────────────────────────────────────────────────┤
│  /api/gallery/*  |  /api/blog/*  |  /api/upload/*      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────┬──────────────────────────────────┐
│   Database Layer     │      File Storage Layer          │
├──────────────────────┼──────────────────────────────────┤
│  Supabase PostgreSQL │   Supabase Storage               │
│  or MongoDB Atlas    │   or Cloudinary                  │
└──────────────────────┴──────────────────────────────────┘
```

## Option 1: Supabase (Recommended - Easiest)

### Why Supabase?
- **Free tier**: 500MB database, 1GB file storage
- **Built-in auth**: Email/password, OAuth (Google, etc.)
- **Built-in storage**: Image hosting with CDN
- **PostgreSQL**: Reliable, powerful
- **Real-time**: Optional real-time updates
- **Simple API**: RESTful and client libraries
- **Good for small business**: Easy to maintain

### Database Schema

```sql
-- Gallery items table
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  category TEXT, -- e.g., 'wedding', 'alterations', 'custom'
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly version of title
  content TEXT NOT NULL, -- Rich text/markdown
  excerpt TEXT, -- Short description for previews
  featured_image_url TEXT,
  category TEXT, -- e.g., 'tips', 'events', 'news'
  tags TEXT[], -- Array of tags
  status TEXT DEFAULT 'draft', -- 'draft' or 'published'
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users (if not using Supabase Auth)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_gallery_visible ON gallery_items(is_visible, display_order);
CREATE INDEX idx_blog_status ON blog_posts(status, published_at);
CREATE INDEX idx_blog_slug ON blog_posts(slug);
```

### Supabase Storage Buckets

```
perez-fashion-storage/
├── gallery/
│   ├── before/
│   │   ├── image-1.jpg
│   │   └── image-2.jpg
│   └── after/
│       ├── image-1.jpg
│       └── image-2.jpg
└── blog/
    ├── featured/
    │   └── post-image.jpg
    └── content/
        └── inline-image.jpg
```

### Implementation Steps (Supabase)

#### Step 1: Set Up Supabase (15 mins)
```bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Copy your API URL and anon key
# 4. Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

#### Step 2: Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Step 3: Create Supabase Client
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### Step 4: Set Up Database Tables
Run the SQL schema in Supabase SQL Editor (from above)

#### Step 5: Configure Storage Buckets
1. Go to Supabase Storage
2. Create bucket: `gallery-images` (public)
3. Create bucket: `blog-images` (public)

#### Step 6: Set Up Authentication
```typescript
// app/admin/login/page.tsx
'use client';
import { supabase } from '@/lib/supabase/client';

export default function AdminLogin() {
  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      // Redirect to admin dashboard
    }
  };
  // ... form UI
}
```

#### Step 7: Create API Routes

**Gallery API** (`app/api/gallery/route.ts`):
```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('gallery_items')
    .insert([body]);

  return NextResponse.json(data);
}
```

**File Upload API** (`app/api/upload/route.ts`):
```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('gallery-images')
    .upload(fileName, file);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from('gallery-images')
    .getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
```

#### Step 8: Admin Dashboard with Real Upload
```typescript
// app/admin/gallery/page.tsx
'use client';
import { useState } from 'react';

export default function AdminGallery() {
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const { url } = await response.json();
    return url; // Use this URL in your gallery item
  };

  // ... rest of admin UI
}
```

## Option 2: MongoDB + Cloudinary (More Control)

### Why MongoDB + Cloudinary?
- **MongoDB Atlas**: More flexible schema, good for complex queries
- **Cloudinary**: Best-in-class image optimization, transformations
- **Good for growth**: Scales well if business grows significantly

### Stack
- **Database**: MongoDB Atlas (free 512MB)
- **Image Storage**: Cloudinary (free 25GB/month)
- **Auth**: NextAuth.js with credentials provider
- **ODM**: Mongoose or Prisma

### Database Schema (MongoDB)

```typescript
// models/GalleryItem.ts
interface GalleryItem {
  _id: ObjectId;
  title: string;
  description: string;
  beforeImage: {
    url: string;
    cloudinaryId: string;
  };
  afterImage: {
    url: string;
    cloudinaryId: string;
  };
  category: string;
  isVisible: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// models/BlogPost.ts
interface BlogPost {
  _id: ObjectId;
  title: string;
  slug: string;
  content: string; // Rich text HTML or markdown
  excerpt: string;
  featuredImage?: {
    url: string;
    cloudinaryId: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Implementation Steps (MongoDB + Cloudinary)

#### Step 1: Set Up Services
```bash
# 1. Create MongoDB Atlas account (https://www.mongodb.com/atlas)
# 2. Create cluster and database
# 3. Create Cloudinary account (https://cloudinary.com)
# 4. Install dependencies
npm install mongodb mongoose cloudinary next-auth bcryptjs
npm install @types/bcryptjs --save-dev
```

#### Step 2: Environment Variables
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/perez-fashion
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXTAUTH_SECRET=generate-random-secret
NEXTAUTH_URL=http://localhost:3000
```

#### Step 3: Configure Cloudinary Upload
```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: File, folder: string) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(bytes);
  });
};
```

## Option 3: Simplified - JSON Files + Public Upload (Quick Start)

If you want to start VERY simple and add complexity later:

### Architecture
- Store gallery data in JSON file (`data/gallery.json`)
- Upload images to `/public/gallery/` manually or via simple upload
- Use NextAuth.js for admin auth
- Migrate to database later when needed

### Pros
- No external services needed
- Works immediately
- Easy to understand
- Can migrate to database later

### Cons
- Not scalable for many items
- Manual deployment needed for changes
- No concurrent editing support

## Recommended Path Forward

### Phase 1: Start Simple (Week 1)
1. Use Supabase free tier
2. Set up authentication (email/password)
3. Create gallery CRUD with real file upload
4. Deploy and test

### Phase 2: Add Blog (Week 2)
1. Create blog post schema
2. Add rich text editor (Tiptap)
3. Blog post CRUD operations
4. Public blog listing page

### Phase 3: Polish (Week 3)
1. Image optimization
2. SEO improvements
3. Analytics
4. Performance tuning

## Admin Access (Simple Approach)

Forget the subdomain. Just use:
- **URL**: `https://perezfashion.com/admin`
- **Protection**: NextAuth.js or Supabase Auth
- **Access**: Only logged-in users can see admin pages

```typescript
// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return <div>{children}</div>;
}
```

## Cost Breakdown (Free Tier)

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| **Supabase** | Free forever | 500MB DB, 1GB storage, 50K monthly active users |
| **Cloudinary** | Free | 25GB storage, 25GB bandwidth/month |
| **MongoDB Atlas** | Free | 512MB storage |
| **Vercel/Netlify** | Free | Unlimited hosting for personal projects |

**Recommendation**: Start with **Supabase** - everything in one place, dead simple.

## File Structure After Implementation

```
perez_fashion/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login
│   │   ├── layout.tsx              # Protected layout
│   │   ├── gallery/page.tsx        # Gallery management
│   │   ├── blog/page.tsx           # Blog management
│   │   └── page.tsx                # Admin dashboard
│   ├── blog/
│   │   ├── page.tsx                # Blog listing
│   │   └── [slug]/page.tsx         # Individual blog post
│   ├── api/
│   │   ├── gallery/route.ts        # Gallery CRUD
│   │   ├── blog/route.ts           # Blog CRUD
│   │   └── upload/route.ts         # File upload
│   └── gallery/page.tsx            # Public gallery
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Client-side Supabase
│   │   └── server.ts               # Server-side Supabase
│   └── types.ts                    # TypeScript types
└── middleware.ts                   # Auth middleware (optional)
```

## Next Steps - What Should We Build?

I can help you implement any of these options. My recommendation:

**Option 1 (Supabase)** - Best balance of simplicity and power

Should I proceed with creating:
1. Supabase setup guide + code
2. Working gallery management with real uploads
3. Blog post management
4. Proper authentication

Let me know which direction you want to go!
