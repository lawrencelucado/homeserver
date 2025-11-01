# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Perez Fashion** is a Next.js-based business website for a family-run alterations, tailoring, and Nigerian wedding fashion consulting business based in Richmond, TX. The site will be deployed at https://perezfashion.com on a home server using Docker and Nginx/Cloudflare Tunnel.

**Business Details:**
- Business Name: Perez Fashion
- Owner: Mary Perez
- Location: Richmond, TX
- Email: contact@perezfashion.com
- Phone: +1 346-303-1855
- WhatsApp: https://wa.me/13463031855
- Hours: Tue–Sat 10am–6pm
- Services: Alterations, Tailoring, Fashion Consulting (Nigerian weddings, express jobs, fabric sourcing, virtual consulting)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS 3.4
- **Language**: TypeScript 5
- **Runtime**: Node.js 20
- **Deployment**: Docker + Nginx/Cloudflare Tunnel
- **Contact Form**: Formspree (configured with ID: myznoerd)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Docker deployment
docker compose up -d --build
docker compose logs --no-color --tail=200

# Nginx (if used)
sudo nginx -t
sudo systemctl reload nginx
```

## Architecture & Structure

```
perez_fashion/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with navigation cards & JSON-LD schema
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Global styles & Tailwind directives
│   ├── services/page.tsx  # Services page - complete with 4 service categories
│   ├── consulting/page.tsx # Fashion consulting page - complete with Nigerian wedding info
│   ├── contact/page.tsx   # Contact form (Formspree) & business info
│   ├── gallery/page.tsx   # Gallery page - before/after grid layout
│   └── admin/page.tsx     # Admin dashboard for gallery management
├── lib/                   # Shared utilities and data
│   └── galleryData.ts     # Gallery data structure (temp - migrate to DB)
├── components/            # Reusable React components (currently empty)
├── public/               # Static assets (images, favicon, etc.)
│   └── gallery/          # Directory for uploaded gallery images
├── middleware.ts         # Next.js middleware for subdomain routing
├── docker-compose.yml    # Docker Compose configuration (port 8080:3000)
├── Dockerfile            # Multi-stage Next.js build (standalone output)
├── nginx/                # Nginx reverse proxy configuration
│   └── perezfashion.conf # Main + admin subdomain configs
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
├── next.config.js        # Next.js configuration (standalone output enabled)
├── CLOUDFLARE_TUNNEL_SETUP.md # Cloudflare Tunnel configuration guide
├── project_plan          # Detailed project roadmap & deployment plan
└── agent_spec            # AI agent workflow specification (YAML format)
```

## Configuration Status

**Contact Form**: Formspree is configured with form ID `myznoerd` in `app/contact/page.tsx:19` and is production-ready.

**Business Information**: All business details (name, contact info, location) are hardcoded throughout the site and should be kept in sync if changed. Key locations:
- Homepage: app/page.tsx
- Contact page: app/contact/page.tsx
- JSON-LD schema: app/page.tsx:4-22

## Page Structure

All pages follow a consistent layout pattern:
- Main container: `<main className="flex min-h-screen flex-col items-center justify-between p-24">`
- Responsive design with mobile-first approach
- Homepage uses a 4-column grid for navigation cards (services, consulting, contact, gallery)

## Admin & Gallery Management

**⚠️ CURRENT STATUS - PROTOTYPE ONLY**:
- **Admin URL**: `/admin` (password: `perezfashion2024`)
- **Current limitation**: Changes stored in memory only, lost on page refresh
- **No file upload**: Using placeholder images only
- **Not production ready**: Needs database and proper auth

**🏠 SELF-HOSTED ARCHITECTURE (Selected)**:

**Decision**: 100% self-hosted on home server - NO cloud dependencies

See detailed documentation in these files:
- **`SELF_HOSTED_ARCHITECTURE.md`** - Complete self-hosted system design
- **`SELF_HOSTED_QUICKSTART.md`** - 30-minute setup guide
- **`docker-compose.self-hosted.yml`** - SQLite configuration (recommended)
- **`docker-compose.postgres.yml`** - PostgreSQL configuration (if needed)

**Recommended Stack:**
1. Database: SQLite (local file at `/data/db.sqlite`) OR PostgreSQL (Docker container)
2. File Storage: Local filesystem (`/public/uploads`)
3. Authentication: NextAuth.js with credentials provider
4. Admin Panel: Custom Next.js pages with CRUD
5. Backup: Automated rsync/tar to external drive
6. Setup time: ~30 minutes

**Why Self-Hosted:**
- ✅ Full data control and privacy
- ✅ No vendor lock-in
- ✅ No monthly cloud fees
- ✅ Data never leaves home server
- ✅ Simple backup to external drive

**Quick Start:**
1. Follow `SELF_HOSTED_QUICKSTART.md` for setup (30 mins)
2. Run Prisma migrations to create database
3. Deploy with updated docker-compose
4. Automated daily backups to `/backups`

**Cloud alternatives** (now deprecated for this project):
- See `ARCHITECTURE.md`, `SOLUTION_COMPARISON.md`, and `IMPLEMENTATION_GUIDE.md` for Supabase/MongoDB options if requirements change

## Deployment Workflow

1. **Local Development**: `npm run dev` → http://localhost:3000
2. **Build**: `npm run build` creates production-optimized build (standalone output enabled in next.config.js)
3. **Docker**: `docker compose up -d --build` builds multi-stage image and runs container
   - Container exposes port 3000 internally
   - Host port 8080 maps to container port 3000
   - Healthcheck configured with curl on /
4. **Nginx/Cloudflare**: nginx/perezfashion.conf proxies traffic to Docker container
   - Configure Nginx to use provided config file
   - Set up Cloudflare Tunnel pointing to Nginx

## SEO & Metadata

- **Implemented**: LocalBusiness JSON-LD schema on homepage (app/page.tsx:4-22) for local SEO
- **Not yet implemented**: `robots.ts` and `sitemap.ts` in app directory
- **Target keywords**: "alterations near me", "Nigerian wedding fashion consultant", "tailoring Richmond TX"

## Future Enhancements

Per `project_plan` file:
- Gallery upload interface for before/after photos
- Booking + payment integration (Stripe/Calendly)
- Client CRM dashboard
- Fashion insights newsletter/blog
- Analytics integration (Plausible or Google Analytics)

## Content Status

- **Homepage**: ✅ Complete with business info and navigation
- **Services page**: ✅ Complete with 4 service categories
- **Consulting page**: ✅ Complete with Nigerian wedding and event consulting info
- **Contact page**: ✅ Complete with working Formspree form
- **Gallery page**: ✅ Complete with before/after grid layout and placeholders
- **Admin page**: ⚠️ Basic implementation - needs database integration for persistence

## Troubleshooting

**Docker healthcheck failing**: The docker-compose.yml healthcheck uses `curl` but the alpine image may not include it by default. If healthcheck fails:
```bash
# Check healthcheck status
docker inspect perez_fashion_web | grep -A 10 Health

# Option 1: Install curl in Dockerfile (add to runner stage)
RUN apk add --no-cache curl

# Option 2: Use wget instead (already in alpine)
# Update healthcheck in docker-compose.yml to: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"]
```

**Build fails on Apple Silicon (M1/M2)**: Use `--platform linux/amd64` flag:
```bash
docker compose build --platform linux/amd64
```

**Port 8080 already in use**: Change the host port mapping in docker-compose.yml:
```yaml
ports:
  - "8081:3000"  # or any available port
```

## Important Notes

- The `project_plan` and `agent_spec` files contain detailed deployment instructions and automation workflows
- Business hours and contact information are hardcoded in multiple locations and should be kept in sync
- Docker and Nginx configurations are production-ready but review before deploying
- **Admin password**: Currently hardcoded as `perezfashion2024` in app/admin/page.tsx:8 - CHANGE THIS before deployment!
- Admin dashboard changes are NOT persistent (stored in memory only) - implement database for production
- To upload real images: Place files in `/public/gallery/` and reference as `/gallery/filename.jpg` in admin
