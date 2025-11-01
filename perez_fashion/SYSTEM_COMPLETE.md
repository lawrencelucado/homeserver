# 🎉 Self-Hosted Admin System - COMPLETE!

## ✅ What's Been Built

Your **100% self-hosted** photo and blog management system is ready!

### Core Features Implemented:

#### 1. **Authentication System** 🔐
- NextAuth.js with credentials provider
- Secure password hashing with bcrypt
- Session-based authentication
- Protected admin routes

#### 2. **Admin Dashboard** 📊
- Real-time statistics (gallery items, blog posts)
- Quick action links
- System information display
- Clean, professional UI

#### 3. **Gallery Management** 📸
- Upload before/after photos (drag & drop)
- Automatic image optimization with Sharp
- Create, edit, delete gallery items
- Toggle visibility (show/hide items)
- Categories and descriptions
- Thumbnail previews

#### 4. **File Upload System** 📁
- Local filesystem storage (`/public/uploads`)
- Automatic image optimization
  - Resized to max 1200x1600px
  - Compressed to 85% quality JPEG
  - Progressive JPEGs for fast loading
- File type and size validation
- Organized folder structure

#### 5. **Public Gallery Page** 🌐
- Displays all visible gallery items
- Before/after grid layout
- Responsive design (mobile/tablet/desktop)
- Empty state when no items
- CTA section with contact buttons

#### 6. **Database System** 🗄️
- SQLite database (single file)
- Prisma ORM (type-safe queries)
- Tables: gallery_items, blog_posts, admin_users
- Automatic timestamps
- Proper indexing for performance

---

## 🚀 How to Use Your System

### Step 1: Start the Development Server

```bash
cd /home/lawrence/perez_fashion
npm run dev
```

Visit: http://localhost:3000

### Step 2: Login to Admin

Go to: http://localhost:3000/admin/login

**Credentials:**
- Email: `contact@perezfashion.com`
- Password: `perezfashion2024`

⚠️ **IMPORTANT: Change this password after first login!**

### Step 3: Add Your First Gallery Item

1. Click "Add New Item" button
2. Fill in:
   - Title (e.g., "Wedding Dress Alteration")
   - Description (optional)
   - Category (wedding, alterations, custom, general)
3. Upload Before image
4. Upload After image
5. Click "Add Gallery Item"

Images will be:
- Automatically optimized
- Saved to `/public/uploads/gallery/`
- Added to database
- Visible on public gallery page

### Step 4: Manage Gallery Items

From `/admin/gallery`:
- **Toggle Visibility**: Click "Visible/Hidden" button
- **Delete Items**: Click "Delete" button
- **View All Items**: Scroll through grid

### Step 5: View Public Gallery

Visit: http://localhost:3000/gallery

This is what your customers see!

---

## 📂 File Structure

```
/home/lawrence/perez_fashion/
├── data/
│   └── db.sqlite           ← YOUR DATABASE (44KB, contains 1 sample item)
├── public/uploads/
│   ├── gallery/
│   │   ├── before/         ← Before images stored here
│   │   └── after/          ← After images stored here
│   └── blog/               ← Future blog images
├── app/
│   ├── admin/
│   │   ├── page.tsx        ← Admin dashboard
│   │   ├── layout.tsx      ← Protected admin layout
│   │   ├── login/page.tsx  ← Login page
│   │   ├── gallery/page.tsx ← Gallery management
│   │   └── blog/page.tsx   ← Blog (placeholder)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts ← NextAuth API
│   │   ├── gallery/route.ts           ← Gallery CRUD API
│   │   └── upload/route.ts            ← File upload API
│   ├── gallery/page.tsx    ← Public gallery
│   └── ...
├── lib/
│   ├── prisma.ts           ← Prisma client
│   ├── auth.ts             ← Auth helpers
│   └── auth-options.ts     ← NextAuth config
└── prisma/
    ├── schema.prisma       ← Database schema
    └── seed.ts             ← Admin user seed
```

---

## 🎯 Admin Panel URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Login** | `/admin/login` | Sign in to admin |
| **Dashboard** | `/admin` | Overview & stats |
| **Gallery** | `/admin/gallery` | Manage photos |
| **Blog** | `/admin/blog` | Blog (coming soon) |

---

## 🌐 Public URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Home** | `/` | Homepage |
| **Gallery** | `/gallery` | Public photo gallery |
| **Services** | `/services` | Services page |
| **Consulting** | `/consulting` | Consulting info |
| **Contact** | `/contact` | Contact form |

---

## 🐳 Deploy with Docker

### Update docker-compose.yml

```bash
cp docker-compose.self-hosted.yml docker-compose.yml
```

### Build and Deploy

```bash
# Stop current container
docker compose down

# Build with new code
docker compose up -d --build

# View logs
docker compose logs -f
```

### Access Your Site

- Main site: https://perezfashion.com
- Admin: https://perezfashion.com/admin/login

---

## 💾 Database Management

### View Database Contents

```bash
# Using Prisma Studio (GUI)
npm run db:studio
# Opens at http://localhost:5555
```

### Useful Commands

```bash
# Generate Prisma client (after schema changes)
npm run db:generate

# Create new migration
npm run db:migrate

# Reset admin user
npm run db:seed

# View database directly (if sqlite3 installed)
sqlite3 data/db.sqlite
```

---

## 🔧 API Endpoints

All API endpoints require authentication (except public gallery GET)

### Gallery API (`/api/gallery`)

**GET** - Fetch gallery items
```bash
# Public (visible only)
curl http://localhost:3000/api/gallery?visible=true

# Admin (all items) - requires auth
curl http://localhost:3000/api/gallery
```

**POST** - Create gallery item
```javascript
fetch('/api/gallery', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Item',
    description: 'Description',
    beforeImagePath: '/uploads/gallery/before/image.jpg',
    afterImagePath: '/uploads/gallery/after/image.jpg',
    category: 'wedding',
    isVisible: true
  })
})
```

**PUT** - Update gallery item
```javascript
fetch('/api/gallery', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 1,
    title: 'Updated Title'
  })
})
```

**DELETE** - Delete gallery item
```bash
curl -X DELETE http://localhost:3000/api/gallery?id=1
```

### Upload API (`/api/upload`)

**POST** - Upload image
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('folder', 'gallery/before');

fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

---

## 📊 Database Schema

### Gallery Items
```typescript
{
  id: number
  title: string
  description: string?
  beforeImagePath: string
  afterImagePath: string
  category: string (default: 'general')
  isVisible: boolean (default: true)
  displayOrder: number (default: 0)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Blog Posts (ready for future use)
```typescript
{
  id: number
  title: string
  slug: string (unique)
  content: string
  excerpt: string?
  featuredImagePath: string?
  category: string
  tags: string?
  status: string (draft/published)
  publishedAt: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Admin Users
```typescript
{
  id: number
  email: string (unique)
  passwordHash: string
  name: string?
  role: string (default: 'admin')
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## 💾 Backup Your Data

### Manual Backup

```bash
# Backup database
cp data/db.sqlite backups/db-$(date +%Y%m%d).sqlite

# Backup uploads
tar -czf backups/uploads-$(date +%Y%m%d).tar.gz public/uploads
```

### Restore from Backup

```bash
# Restore database
cp backups/db-20241024.sqlite data/db.sqlite

# Restore uploads
tar -xzf backups/uploads-20241024.tar.gz
```

### Set Up Automated Backups

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /home/lawrence/perez_fashion && cp data/db.sqlite backups/db-$(date +\%Y\%m\%d).sqlite
```

---

## 🐛 Troubleshooting

### "Unauthorized" when uploading
→ Make sure you're logged in to admin panel

### Images not showing after upload
→ Check file permissions: `chmod 755 public/uploads`

### Database locked error
→ Stop the dev server and Docker container, then restart

### Build fails
→ Run `npx prisma generate` then `npm run build`

### Can't login
→ Reset password: `npm run db:seed`

---

## 🎨 Customization

### Change Admin Password

Edit `prisma/seed.ts` and change line 9:
```typescript
const passwordHash = await bcrypt.hash('YOUR_NEW_PASSWORD', 10);
```

Then run:
```bash
npm run db:seed
```

### Add More Categories

Edit `/app/admin/gallery/page.tsx` lines 141-146:
```typescript
<option value="general">General</option>
<option value="wedding">Wedding</option>
<option value="alterations">Alterations</option>
<option value="custom">Custom Tailoring</option>
<option value="your_category">Your Category</option>
```

### Change Upload Limits

Edit `/app/api/upload/route.ts`:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // Change to 20MB: 20 * 1024 * 1024
```

---

## 📈 Next Steps

### Recommended:
1. **Change admin password** (critical!)
2. **Add real gallery items**
3. **Test on mobile devices**
4. **Set up automated backups**
5. **Deploy to production**

### Future Enhancements:
- Blog post management (schema ready!)
- Image drag-to-reorder
- Bulk upload
- Categories management
- Advanced image editing
- Analytics integration

---

## ✅ System Status

- ✅ Database: SQLite (working)
- ✅ Authentication: NextAuth.js (working)
- ✅ File Upload: Sharp optimization (working)
- ✅ Gallery Management: Full CRUD (working)
- ✅ Public Gallery: Database-driven (working)
- ✅ Admin Dashboard: Statistics (working)
- ⏳ Blog Management: Schema ready (not implemented)

---

## 🎉 You're All Set!

Your self-hosted admin system is complete and production-ready!

**Test it now:**
```bash
npm run dev
```

Then visit http://localhost:3000/admin/login

Have questions? Check the documentation files:
- `SELF_HOSTED_ARCHITECTURE.md` - Technical details
- `SELF_HOSTED_QUICKSTART.md` - Setup guide
- `README_SETUP.md` - Installation instructions

**Enjoy your new admin system!** 🚀
