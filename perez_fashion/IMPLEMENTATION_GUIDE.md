# Implementation Guide - Photo & Blog Management

## Decision Matrix: Choose Your Path

| Criteria | Supabase | MongoDB + Cloudinary | JSON Files |
|----------|----------|----------------------|------------|
| **Setup Time** | 30 mins | 1-2 hours | 15 mins |
| **Difficulty** | Easy | Medium | Very Easy |
| **File Upload** | Built-in | Need integration | Manual/Simple |
| **Authentication** | Built-in | Need NextAuth.js | Need NextAuth.js |
| **Scalability** | Excellent | Excellent | Poor |
| **Cost (Free Tier)** | 500MB DB, 1GB files | 512MB DB, 25GB files | Free (local) |
| **Best For** | Small to medium business | Businesses planning to scale | Quick prototype |
| **Maintenance** | Very Low | Medium | Low |
| **Migration Difficulty** | Easy to upgrade | Easy to upgrade | Hard to migrate |

**Recommendation: Start with Supabase** ⭐

---

## Quick Start: Supabase Implementation (30 minutes)

### Step 1: Create Supabase Project (5 mins)

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
   - Name: `perez-fashion`
   - Database Password: (generate strong password - save it!)
   - Region: Choose closest to Texas (e.g., US East)
4. Wait for project to initialize (~2 minutes)

### Step 2: Install Dependencies (2 mins)

```bash
cd /home/lawrence/perez_fashion
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Step 3: Get Your Credentials (2 mins)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 4: Create Environment File (1 min)

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Set Up Database Tables (3 mins)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste this SQL:

```sql
-- Gallery items table
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_gallery_visible ON gallery_items(is_visible, display_order);
CREATE INDEX idx_blog_status ON blog_posts(status, published_at DESC);
CREATE INDEX idx_blog_slug ON blog_posts(slug);

-- Enable Row Level Security
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for visible items
CREATE POLICY "Public can read visible gallery items"
  ON gallery_items FOR SELECT
  USING (is_visible = true);

-- Public read access for published posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Admin full access (we'll set this up with auth later)
CREATE POLICY "Authenticated users can do everything on gallery"
  ON gallery_items FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on blog"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');
```

4. Click "Run"

### Step 6: Set Up Storage Buckets (3 mins)

1. Go to **Storage** in Supabase dashboard
2. Click "New bucket"
   - Name: `gallery-images`
   - Public bucket: ✅ Yes
   - Click "Create bucket"
3. Click on `gallery-images` → **Policies** → "New policy"
   - Select "Allow public access"
   - Check: SELECT (read)
   - Click "Create policy"
4. Repeat for bucket: `blog-images`

### Step 7: Create Admin User (2 mins)

1. Go to **Authentication** → **Users**
2. Click "Add user"
   - Email: `contact@perezfashion.com` (or Mary's email)
   - Password: (create strong password)
   - Click "Create user"

### Step 8: Create Supabase Client (5 mins)

Create `lib/supabase/client.ts`:
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createClientComponentClient();
};
```

Create `lib/supabase/server.ts`:
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerClient = () => {
  return createServerComponentClient({ cookies });
};
```

### Step 9: Update Gallery Page (5 mins)

Replace `app/gallery/page.tsx`:
```typescript
import { createServerClient } from '@/lib/supabase/server';
import Image from 'next/image';

export const revalidate = 0; // Disable cache for real-time updates

export default async function Gallery() {
  const supabase = createServerClient();

  const { data: galleryItems, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching gallery:', error);
    return <div>Error loading gallery</div>;
  }

  if (!galleryItems || galleryItems.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Our Work</h1>
          <p>Gallery coming soon! Check back later.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Browse our portfolio of alterations, custom tailoring, and fashion consulting projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {galleryItems.map((item: any) => (
            <div
              key={item.id}
              className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="grid grid-cols-2 gap-1 bg-gray-100 dark:bg-gray-800">
                <div className="relative aspect-[3/4]">
                  <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs font-semibold rounded z-10">
                    BEFORE
                  </div>
                  <Image
                    src={item.before_image_url}
                    alt={`${item.title} - Before`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative aspect-[3/4]">
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded z-10">
                    AFTER
                  </div>
                  <Image
                    src={item.after_image_url}
                    alt={`${item.title} - After`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </main>
  );
}
```

### Step 10: Test Database Connection (2 mins)

```bash
npm run dev
```

Visit http://localhost:3000/gallery

You should see "Gallery coming soon!" (because database is empty)

---

## Phase 2: Admin Panel with Real Upload

Now let's build the admin interface to manage these items.

### Option A: Use Pre-built Admin (Fastest - 10 mins)

Use **Supabase Studio** (built-in):
1. Go to your Supabase dashboard
2. Click **Table Editor**
3. Click `gallery_items`
4. Click "Insert row"
5. Fill in:
   - title: "Test Item"
   - description: "Test description"
   - before_image_url: `https://placehold.co/600x800/e2e8f0/64748b?text=Before`
   - after_image_url: `https://placehold.co/600x800/dcfce7/16a34a?text=After`
6. Click "Save"

Refresh gallery page - you should see your test item!

### Option B: Build Custom Admin (Better - 1 hour)

I can create a full admin panel with:
- Login page
- Gallery management with file upload
- Blog post editor
- Image upload to Supabase Storage

---

## What's Next?

You now have:
- ✅ Database set up and working
- ✅ Gallery page pulling from real database
- ✅ Storage buckets ready for images
- ✅ Authentication ready

**Choose your next step:**

1. **I want to manually add items via Supabase dashboard** → Use Option A above
2. **I want a custom admin panel** → I'll build Option B for you
3. **I want to add blog functionality first** → I'll create blog system
4. **I want to set up image upload** → I'll create upload API

Which would you like me to implement next?

---

## Troubleshooting

### "Error loading gallery"
- Check `.env.local` has correct Supabase URL and key
- Make sure you ran the SQL to create tables
- Check browser console for specific error

### "Gallery coming soon" but I added items
- Make sure `is_visible` is set to `true` in database
- Clear browser cache and refresh
- Check Supabase Table Editor to verify data exists

### Images not loading
- Verify image URLs are publicly accessible
- Check storage bucket policies allow public read
- Try using placeholder URLs first to test structure

---

## Cost Estimate

**Free Tier (Perfect for small business):**
- Database: 500MB (thousands of gallery items + blog posts)
- Storage: 1GB (hundreds of high-quality images)
- Bandwidth: 2GB/month
- Auth: 50,000 monthly active users

**If you outgrow free tier:**
- Pro Plan: $25/month
  - 8GB database
  - 100GB storage
  - 200GB bandwidth

**Most small businesses never need to upgrade from free tier.**
