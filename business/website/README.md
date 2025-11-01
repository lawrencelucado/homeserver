# DataLux Consulting Website

**Live Site**: https://datalux.dev
**Status**: 🚧 In Development
**Server**: databin-server (Self-Hosted)

---

## Overview

The official website for **DataLux Consulting**, a Houston-based IT consulting firm specializing in cloud infrastructure, data engineering, and business intelligence.

**Business Identity**:
- **Legal Entity**: Cutens LLC
- **DBA**: DataLux Consulting
- **Location**: Houston, Texas
- **Services**: Cloud Infrastructure, Data Engineering, DevOps, Business Intelligence
- **Mission**: Illuminating Your Data Infrastructure

---

## Architecture

This website is self-hosted on a home server using Docker and Cloudflare Tunnel:

```
Internet → Cloudflare (SSL/TLS) → Cloudflare Tunnel → localhost:8002 → nginx:alpine → HTML
```

**Components**:
- **Web Server**: nginx:alpine Docker container (~23MB)
- **Port**: 8002 (localhost only)
- **Tunnel**: Cloudflare Tunnel (cloudflared-datalux service)
- **Domain**: datalux.dev (Cloudflare DNS)
- **SSL**: Managed by Cloudflare

---

## Project Structure

```
website/
├── docker-compose.yml          # Docker service configuration
├── html/
│   └── index.html             # Single-page website
├── nginx/
│   └── default.conf           # nginx server configuration
├── .git/                      # Git repository
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
└── project.md                 # Detailed project tracking
```

---

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Cloudflare account with domain datalux.dev
- cloudflared installed (for tunnel)
- Port 8002 available

### 1. Start the Website

```bash
cd /home/lawrence/projects/business/website
docker compose up -d
```

### 2. Verify Container is Running

```bash
docker compose ps
docker compose logs
```

### 3. Test Local Access

```bash
curl http://localhost:8002
```

### 4. Check Container Health

```bash
docker compose ps
# Look for "healthy" status
```

---

## Management Commands

### Docker Container

```bash
# Start container
docker compose up -d

# Stop container
docker compose down

# Restart container
docker compose restart

# View logs
docker compose logs -f

# Check status
docker compose ps

# Rebuild after changes
docker compose down && docker compose up -d
```

### Cloudflare Tunnel

```bash
# Check tunnel status
sudo systemctl status cloudflared-datalux

# Start tunnel
sudo systemctl start cloudflared-datalux

# Stop tunnel
sudo systemctl stop cloudflared-datalux

# Restart tunnel
sudo systemctl restart cloudflared-datalux

# View tunnel logs
sudo journalctl -u cloudflared-datalux -f

# Enable on boot
sudo systemctl enable cloudflared-datalux
```

---

## Configuration

### Docker Configuration

**File**: `docker-compose.yml`

Key settings:
- **Image**: nginx:alpine
- **Container Name**: datalux-website
- **Port Binding**: 127.0.0.1:8002:80 (localhost only)
- **Volumes**:
  - `./html:/usr/share/nginx/html:ro` (read-only)
  - `./nginx:/etc/nginx/conf.d:ro` (read-only)
- **Restart Policy**: unless-stopped
- **Health Check**: Every 30 seconds

### Nginx Configuration

**File**: `nginx/default.conf`

Features:
- Gzip compression for text/css/js
- Security headers (X-Frame-Options, X-Content-Type-Options)
- Static asset caching (1 year)
- Custom error pages
- Access and error logging

### Cloudflare Tunnel Configuration

**Service File**: `/etc/systemd/system/cloudflared-datalux.service`

Routes:
- `datalux.dev` → `http://localhost:8002`
- `www.datalux.dev` → `http://localhost:8002` (optional)

---

## Making Updates

### Update Website Content

1. Edit `html/index.html`
2. Restart container:
   ```bash
   docker compose restart
   ```

### Update Nginx Configuration

1. Edit `nginx/default.conf`
2. Restart container:
   ```bash
   docker compose restart
   ```

### Update Docker Configuration

1. Edit `docker-compose.yml`
2. Recreate container:
   ```bash
   docker compose down
   docker compose up -d
   ```

---

## Troubleshooting

### Website Not Loading Locally

```bash
# Check if container is running
docker compose ps

# Check container logs
docker compose logs

# Check if port 8002 is listening
sudo netstat -tlnp | grep 8002

# Restart container
docker compose restart
```

### Website Not Loading Externally

```bash
# Check tunnel status
sudo systemctl status cloudflared-datalux

# Check tunnel logs
sudo journalctl -u cloudflared-datalux -f

# Restart tunnel
sudo systemctl restart cloudflared-datalux

# Test DNS resolution
nslookup datalux.dev

# Test HTTPS
curl -I https://datalux.dev
```

### Port Already in Use

```bash
# Find what's using port 8002
sudo netstat -tlnp | grep 8002

# Change port in docker-compose.yml if needed
# Example: "127.0.0.1:8003:80"
```

### Container Health Check Failing

```bash
# Check container logs
docker compose logs

# Enter container to debug
docker compose exec datalux-website sh

# Inside container, test nginx
wget -O- http://localhost
```

---

## Security

### Security Features

1. **Port Isolation**: Port 8002 bound to localhost only (127.0.0.1)
2. **Read-Only Mounts**: HTML and nginx config mounted as :ro
3. **No Root User**: nginx runs as unprivileged user
4. **SSL/TLS**: Managed automatically by Cloudflare
5. **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
6. **Tunnel-Only Access**: No direct port exposure to internet

### Security Best Practices

- Never expose port 8002 to 0.0.0.0
- Keep Docker and cloudflared updated
- Regularly update nginx:alpine image
- Monitor logs for suspicious activity
- Use strong Cloudflare Tunnel token
- Enable Cloudflare WAF rules

---

## Performance

### Optimizations

- **Gzip Compression**: Enabled for text files
- **Static Asset Caching**: 1-year cache for images/css/js
- **CDN**: Cloudflare global network
- **Small Container**: nginx:alpine only ~23MB
- **Health Checks**: Automatic container restart on failure

### Metrics

- **Container Size**: ~23MB
- **Load Time**: < 1 second
- **Uptime Target**: 99.9%
- **Port**: 8002 (internal)

---

## Contact Form Integration

The contact form is configured to work with Formspree.

### Setup

1. Sign up at https://formspree.io
2. Create a new form
3. Copy the form ID
4. Update `html/index.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
5. Rebuild container:
   ```bash
   docker compose restart
   ```

---

## Email Configuration

Email forwarding for `lawrence@datalux.dev` is handled by Cloudflare Email Routing.

### Setup

1. Go to Cloudflare Dashboard → Email → Email Routing
2. Add destination email address
3. Create routing rule: `lawrence@datalux.dev` → personal email
4. Verify MX records are configured
5. Test email delivery

---

## Deployment Checklist

- [x] Create project structure
- [x] Configure Docker Compose
- [x] Configure nginx
- [x] Create website HTML
- [ ] Verify port 8002 available
- [ ] Start Docker container
- [ ] Test local access
- [ ] Create Cloudflare Tunnel
- [ ] Configure systemd service
- [ ] Test external access
- [ ] Set up contact form (Formspree)
- [ ] Configure email routing
- [ ] Set up Git repository
- [ ] Create GitHub repository

---

## Maintenance

### Regular Tasks

**Daily**:
- Monitor container health: `docker compose ps`
- Check logs for errors: `docker compose logs --tail=50`

**Weekly**:
- Review access logs
- Check tunnel status: `sudo systemctl status cloudflared-datalux`

**Monthly**:
- Update nginx:alpine image: `docker compose pull && docker compose up -d`
- Review Cloudflare analytics
- Test form submissions
- Verify email forwarding

**Quarterly**:
- Review security headers
- Update dependencies
- Backup configuration files
- Review and update content

---

## Backup & Recovery

### Backup Files

Important files to backup:
- `html/index.html` - Website content
- `nginx/default.conf` - nginx configuration
- `docker-compose.yml` - Docker configuration
- `/etc/systemd/system/cloudflared-datalux.service` - Tunnel service

### Backup Command

```bash
# Create backup
tar -czf datalux-website-backup-$(date +%Y%m%d).tar.gz \
  /home/lawrence/projects/business/website/

# Store in safe location
mv datalux-website-backup-*.tar.gz ~/backups/
```

### Recovery

```bash
# Extract backup
tar -xzf datalux-website-backup-YYYYMMDD.tar.gz

# Restore files
# Restart services
docker compose up -d
sudo systemctl restart cloudflared-datalux
```

---

## Resources

### Documentation
- nginx Documentation: https://nginx.org/en/docs/
- Docker Compose: https://docs.docker.com/compose/
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- Formspree: https://formspree.io/guides/
- Cloudflare Email Routing: https://developers.cloudflare.com/email-routing/

### Related Projects
- Business Context: `/home/lawrence/projects/business/AGENTS.md`
- Codex Service: `/home/lawrence/projects/business/docker-compose.yml`
- Existing Tunnel: `/etc/systemd/system/cloudflared-perezfashion.service`

---

## Contributing

This is a personal business website. For suggestions or issues:
1. Contact: lawrence@datalux.dev
2. Open an issue on GitHub (when repository is created)

---

## License

Copyright © 2025 DataLux Consulting (Cutens LLC). All rights reserved.

---

## Contact

**DataLux Consulting**
Houston, Texas
lawrence@datalux.dev
https://datalux.dev

---

**Last Updated**: October 31, 2025
**Version**: 1.0.0
**Maintained by**: Lawrence A.O.T. Lucas
