# FE-SCADA Dashboard - Project Setup Summary

**Date Created:** 2025-10-22
**Status:** Ready for Development
**Port:** 3003
**Network:** scada-net

---

## Project Structure Created

```
/home/lawrence/fe-scada-dashboard/
├── app/
│   ├── layout.tsx              # Root layout with dark theme
│   ├── page.tsx                # Main dashboard entry point
│   └── globals.css             # Global styles + shadcn/ui variables
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── FeScadaDeluxeDashboard.tsx  # Main dashboard component
├── lib/
│   └── utils.ts                # Utility functions (cn helper)
├── public/                     # Static assets
├── docker-compose.yml          # Production deployment
├── Dockerfile                  # Multi-stage production build
└── next.config.js              # Next.js config (standalone output)
```

---

## Dependencies Installed

### Production
- next@^14.2.0
- react@^18.3.0
- react-dom@^18.3.0
- recharts@^2.12.0 (for charts/graphs)
- lucide-react@^0.424.0 (for icons)

### Development
- typescript@^5.4.5
- tailwindcss@^3.4.4
- autoprefixer@^10.4.19
- postcss@^8.4.38
- eslint@^8.57.0
- eslint-config-next@^14.2.0
- @types/node@^20.14.0
- @types/react@^18.3.0
- @types/react-dom@^18.3.0

---

## Docker Configuration

### Container Specs
- **Image:** Node.js 20 Alpine (multi-stage build)
- **Port:** 3003
- **CPU Limit:** 1 core
- **Memory Limit:** 1GB max, 256MB reserved
- **User:** nextjs (non-root, UID 1001)
- **Restart Policy:** unless-stopped
- **Health Check:** HTTP GET localhost:3003 every 30s
- **Log Rotation:** 10MB max, 3 files
- **Network:** scada-net (isolated)

### Build Process
The Dockerfile uses a 4-stage build:
1. **base** - Node.js 20 Alpine
2. **deps** - Install dependencies
3. **builder** - Build Next.js app
4. **runner** - Production runtime (minimal)

---

## Integration with Server Infrastructure

### ✅ Automated Backups
- Added to `/home/lawrence/backup_server.sh`
- Backs up project files and Docker volumes
- Runs daily at 2:00 AM
- 30-day retention

**Manual backup:**
```bash
/home/lawrence/backup_server.sh fe-scada-dashboard
```

### ✅ Health Monitoring
- Added to `/home/lawrence/system_health_check.sh`
- Monitors container status and HTTP endpoint
- Runs hourly via cron
- Logs to `/home/lawrence/health_check.log`

**Manual health check:**
```bash
/home/lawrence/system_health_check.sh
```

### ✅ Documentation
- Added to `/home/lawrence/CURRENT_SERVER_SETUP.md`
- Listed as Project #4
- Port 3003 marked as in-use
- Network scada-net documented

---

## Next Steps

### 1. Build and Start the Container

```bash
cd /home/lawrence/fe-scada-dashboard

# Install dependencies (if running locally first)
npm install

# Test build locally
npm run build

# Start with Docker
docker compose up -d

# View logs
docker compose logs -f web
```

### 2. Verify Deployment

```bash
# Check container status
docker ps | grep fe-scada

# Test HTTP endpoint
curl -I http://localhost:3003

# Check health
docker inspect fe-scada-dashboard | grep -A 10 Health
```

### 3. Configure Cloudflare Tunnel (Optional)

To make the dashboard publicly accessible:

**Option A: Add route to existing soccer-intelligence tunnel**

Edit soccer-intelligence's cloudflared config to route:
- `scada.databin.dev` → `http://fe-scada-dashboard:3003`

**Option B: Create dedicated tunnel in this project**

Add to `docker-compose.yml`:
```yaml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN}
    networks:
      - scada-net
```

### 4. Development Workflow

**Local development:**
```bash
npm run dev
# Visit http://localhost:3003
```

**Production build:**
```bash
npm run build
npm start
```

**Docker development:**
```bash
# Rebuild after changes
docker compose up -d --build

# View logs
docker compose logs -f web

# Restart
docker compose restart web
```

---

## Customization Guide

### Adding Components

Create components in `components/` directory:

```tsx
// components/StatusCard.tsx
interface StatusCardProps {
  title: string;
  value: string;
  status: 'online' | 'offline' | 'warning';
}

export function StatusCard({ title, value, status }: StatusCardProps) {
  const statusColors = {
    online: 'text-green-400',
    offline: 'text-red-400',
    warning: 'text-yellow-400',
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <span className={statusColors[status]}>{status}</span>
    </div>
  );
}
```

### Adding Pages

Create pages in `app/` directory:

```tsx
// app/monitoring/page.tsx
export default function MonitoringPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Real-time Monitoring</h1>
      {/* Content */}
    </main>
  );
}
```

Access at `/monitoring`

### Adding Charts

Use Recharts for data visualization:

```tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', temp: 20 },
  { time: '01:00', temp: 22 },
  // ...
];

export function TemperatureChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="time" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
        />
        <Line type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Environment Variables

Add variables to `.env`:

```bash
# Application
NODE_ENV=production
PORT=3003

# API endpoints (example)
NEXT_PUBLIC_SCADA_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

# Server-side only (no NEXT_PUBLIC_ prefix)
DATABASE_URL=postgresql://user:pass@localhost:5432/scada
```

---

## Troubleshooting

### Container Won't Start

1. Check if port 3003 is available:
   ```bash
   sudo lsof -i :3003
   ```

2. View container logs:
   ```bash
   docker compose logs web
   ```

3. Check resource usage:
   ```bash
   docker stats fe-scada-dashboard
   ```

### Build Failures

1. Clear Next.js cache:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. Rebuild Docker image from scratch:
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```

### Permission Issues

If files are owned by root:
```bash
sudo chown -R lawrence:lawrence /home/lawrence/fe-scada-dashboard
```

### Health Check Failing

1. Test endpoint manually:
   ```bash
   curl http://localhost:3003
   ```

2. Check if app is running:
   ```bash
   docker compose exec web ps aux
   ```

---

## Performance Tips

### Image Optimization

Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src="/dashboard-logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### Code Splitting

Dynamic imports for heavy components:
```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Disable server-side rendering if not needed
});
```

### Caching

Leverage Next.js caching:
```tsx
// Static page (cached indefinitely)
export const revalidate = false;

// Revalidate every 60 seconds
export const revalidate = 60;

// Dynamic page (no caching)
export const dynamic = 'force-dynamic';
```

---

## Security Checklist

- [x] Non-root user in Docker (nextjs:1001)
- [x] No sensitive data in public env vars
- [x] .env file excluded from git
- [x] Resource limits configured
- [x] Health checks enabled
- [x] Log rotation configured
- [ ] Configure CSP headers (add to next.config.js if needed)
- [ ] Setup rate limiting (if exposing APIs)
- [ ] Add authentication (if required)

---

## Maintenance

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install next@latest
```

### View Logs

```bash
# Docker logs
docker compose logs -f web

# Health check log
tail -f /home/lawrence/health_check.log

# Backup log
tail -f /home/lawrence/backups/backup.log
```

### Backups

Backups run automatically daily at 2 AM. Manual backup:
```bash
/home/lawrence/backup_server.sh fe-scada-dashboard
```

Restore from backup:
```bash
# Extract backup
cd /home/lawrence/backups
tar xzf fe-scada-dashboard_files_YYYYMMDD_HHMMSS.tar.gz
```

---

## Resources & Documentation

**Local Documentation:**
- `/home/lawrence/fe-scada-dashboard/CLAUDE.md` - Complete project docs
- `/home/lawrence/fe-scada-dashboard/README.md` - User guide
- `/home/lawrence/CURRENT_SERVER_SETUP.md` - Server infrastructure
- `/home/lawrence/SERVER_OPTIMIZATION_GUIDE.md` - Optimization guide

**External Resources:**
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Recharts: https://recharts.org/en-US/
- Lucide Icons: https://lucide.dev/

---

## Quick Reference

**Project Location:** `/home/lawrence/fe-scada-dashboard`
**Container Name:** `fe-scada-dashboard`
**Network:** `scada-net`
**Port:** 3003
**Local URL:** http://localhost:3003
**Public URL:** https://scada.databin.dev (after Cloudflare config)

**Commands:**
```bash
# Start
cd /home/lawrence/fe-scada-dashboard && docker compose up -d

# Stop
docker compose down

# Restart
docker compose restart web

# Rebuild
docker compose up -d --build

# Logs
docker compose logs -f web

# Shell access
docker compose exec web sh
```

---

**Setup Completed:** 2025-10-22
**Ready for Development:** ✓
**All Systems Integrated:** ✓
