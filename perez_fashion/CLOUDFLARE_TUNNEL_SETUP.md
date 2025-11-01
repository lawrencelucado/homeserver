# Cloudflare Tunnel Setup Guide

This guide explains how to configure Cloudflare Tunnel to expose your Perez Fashion website to the internet with custom subdomains.

## Prerequisites

- Docker container running on port 8080 (maps to internal port 3000)
- Cloudflare account with perezfashion.com domain added
- Cloudflare Tunnel created (cloudflared installed)

## Deployment Architecture

```
Internet → Cloudflare Tunnel → Docker Container (port 8080) → Next.js App (port 3000)
```

**OR** (if using Nginx)

```
Internet → Cloudflare Tunnel → Nginx (port 80) → Docker Container (port 8080) → Next.js App (port 3000)
```

## Option 1: Direct to Docker (Recommended for Home Server)

### Configuration Settings

#### Main Website Route
**Hostname:** `perezfashion.com`
- **Service Type:** `HTTP`
- **URL:** `http://localhost:8080`

**Hostname:** `www.perezfashion.com`
- **Service Type:** `HTTP`
- **URL:** `http://localhost:8080`

#### Admin Dashboard Route
**Hostname:** `admin.perezfashion.com`
- **Service Type:** `HTTP`
- **URL:** `http://localhost:8080`

### Why This Works
The Next.js middleware (`middleware.ts`) detects the `admin.perezfashion.com` hostname and automatically routes requests to the `/admin` page.

## Option 2: Through Nginx (If Using Nginx)

If you're using Nginx as a reverse proxy:

#### All Routes
**Hostname:** `perezfashion.com`, `www.perezfashion.com`, `admin.perezfashion.com`
- **Service Type:** `HTTP`
- **URL:** `http://localhost:80` (or `http://localhost` - nginx listens on port 80)

### Why This Works
Nginx configuration has separate server blocks for main domain and admin subdomain, both proxying to the Docker container.

## Option 3: Using Docker Compose Network (Advanced)

If Cloudflare Tunnel runs as a Docker container in the same network:

```yaml
# In docker-compose.yml (add to existing file)
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=your_tunnel_token_here
    networks:
      - perez-network

  web:
    # existing config
    networks:
      - perez-network

networks:
  perez-network:
    driver: bridge
```

**URL for routes:** `http://web:3000` (where `web` is the service name in docker-compose.yml)

## Cloudflare Tunnel Configuration Examples

### Via Cloudflare Dashboard (Zero Trust)

1. Go to **Cloudflare Zero Trust** → **Access** → **Tunnels**
2. Select your tunnel
3. Click **Configure**
4. Under **Public Hostname**, add three routes:

#### Route 1: Main Website
```
Public hostname: perezfashion.com
Service:
  Type: HTTP
  URL: http://localhost:8080
```

#### Route 2: WWW Subdomain
```
Public hostname: www.perezfashion.com
Service:
  Type: HTTP
  URL: http://localhost:8080
```

#### Route 3: Admin Subdomain
```
Public hostname: admin.perezfashion.com
Service:
  Type: HTTP
  URL: http://localhost:8080
```

### Via YAML Config File (cloudflared config.yml)

```yaml
tunnel: your-tunnel-id
credentials-file: /path/to/credentials.json

ingress:
  # Admin subdomain
  - hostname: admin.perezfashion.com
    service: http://localhost:8080

  # Main website (with www)
  - hostname: www.perezfashion.com
    service: http://localhost:8080

  # Main website
  - hostname: perezfashion.com
    service: http://localhost:8080

  # Catch-all rule (required)
  - service: http_status:404
```

## Testing Your Setup

### 1. Test Locally First

Before setting up Cloudflare Tunnel, test with local hosts file:

**On Linux/Mac** (`/etc/hosts`):
```
127.0.0.1 perezfashion.com
127.0.0.1 admin.perezfashion.com
```

**On Windows** (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 perezfashion.com
127.0.0.1 admin.perezfashion.com
```

Then start your Docker container:
```bash
docker compose up -d
```

Visit:
- `http://perezfashion.com:8080` → Should show homepage
- `http://admin.perezfashion.com:8080` → Should redirect to admin login

### 2. Test Cloudflare Tunnel

After configuring the tunnel:
```bash
# If using cloudflared locally
cloudflared tunnel run your-tunnel-name

# Check tunnel status
cloudflared tunnel info your-tunnel-name
```

Visit:
- `https://perezfashion.com` → Homepage
- `https://admin.perezfashion.com` → Admin dashboard

## Troubleshooting

### Admin subdomain shows homepage instead of admin page
**Solution:** Check middleware.ts is deployed:
```bash
docker compose down
docker compose up -d --build
```

### SSL/HTTPS errors
**Solution:** Cloudflare handles SSL automatically. Ensure:
- SSL/TLS encryption mode in Cloudflare is set to **Flexible** or **Full**
- Service URL in tunnel config uses `http://` (not `https://`)

### "Bad Gateway" or 502 errors
**Solution:** Check:
1. Docker container is running: `docker ps`
2. Container is healthy: `docker inspect perez_fashion_web | grep Health`
3. Port 8080 is accessible: `curl http://localhost:8080`

### Middleware not working
**Solution:** Verify middleware.ts is in the root directory and rebuild:
```bash
npm run build
docker compose up -d --build
```

## Security Recommendations

1. **Cloudflare Access (Optional but Recommended for Admin)**
   - Set up Cloudflare Access policy for admin.perezfashion.com
   - Require email authentication before accessing admin dashboard
   - This adds a layer of security before the password login

2. **Change Admin Password**
   - Edit `app/admin/page.tsx:8` and change the hardcoded password
   - Move to environment variable in production

3. **Rate Limiting**
   - Enable Cloudflare Rate Limiting for /admin route
   - Prevent brute force attacks

## Summary: What to Enter in Cloudflare Form

Based on your screenshot, here's exactly what to enter:

```
Hostname:
  Subdomain: admin
  Domain: perezfashion.com
  Path: (leave empty)

Service:
  Type: HTTP
  URL: http://localhost:8080
```

**OR** if using Nginx:

```
Service:
  Type: HTTP
  URL: http://localhost:80
```

Click **Save** and the DNS record will be automatically created.

## Next Steps After Setup

1. Visit https://admin.perezfashion.com to verify it works
2. Change the admin password immediately
3. Consider setting up Cloudflare Access for additional security
4. Set up database for persistent gallery management
5. Configure Cloudflare caching rules for optimal performance

## Port Reference

- **3000**: Next.js app inside Docker container
- **8080**: Host port mapped to container (docker-compose.yml)
- **80**: Nginx (if using)
- **443**: Cloudflare handles SSL/HTTPS automatically

Choose the port based on your architecture. For most home server setups, use **http://localhost:8080**.
