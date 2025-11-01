# DataLux Consulting Website - Project Documentation

**Project Status**: 🚧 In Progress
**Started**: October 31, 2025
**Owner**: Lawrence A.O.T. Lucas
**Server**: databin-server (Houston, TX)

---

## 📋 Project Overview

Deploying the DataLux Consulting website (datalux.dev) as a self-hosted solution on the home server using:
- **Web Server**: nginx:alpine (Docker container)
- **Port**: 8002 (localhost only)
- **Tunnel**: Cloudflare Tunnel (dedicated service)
- **Domain**: datalux.dev
- **SSL/TLS**: Managed by Cloudflare

---

## 🏗️ Architecture

```
Internet → Cloudflare (SSL/TLS) → Cloudflare Tunnel → localhost:8002 → nginx:alpine → index.html
```

**Components**:
1. **Docker Container** (`datalux-website`)
   - Image: nginx:alpine (~23MB)
   - Port: 127.0.0.1:8002:80 (internal only)
   - Volumes: html/ (website files), nginx/ (configuration)

2. **Cloudflare Tunnel** (`cloudflared-datalux`)
   - Service: systemd unit
   - Routes: datalux.dev → http://localhost:8002
   - User: lawrence

3. **DNS**:
   - Provider: Cloudflare
   - Domain: datalux.dev
   - Record Type: CNAME (managed by tunnel)

---

## 📂 Project Structure

```
/home/lawrence/projects/business/website/
├── docker-compose.yml          # Docker service definition
├── html/
│   └── index.html             # Website HTML (single-page)
├── nginx/
│   └── default.conf           # nginx web server configuration
├── .git/                      # Git repository (pending)
├── .gitignore                 # Git ignore rules (pending)
├── README.md                  # Project documentation (pending)
└── project.md                 # This file (project tracking)
```

---

## ✅ Completed Tasks

### Phase 1: Project Setup ✓
- [x] Created website directory structure (`/home/lawrence/projects/business/website/`)
- [x] Created subdirectories: `html/` and `nginx/`
- [x] Created `docker-compose.yml` with nginx:alpine service
  - Port binding: 127.0.0.1:8002:80
  - Health check configured
  - Restart policy: unless-stopped
  - Network: datalux-network
- [x] Created `nginx/default.conf` with production settings
  - Gzip compression enabled
  - Security headers configured
  - Static asset caching
  - Error page handling
- [x] Saved `index.html` to `html/` directory
  - Single-page responsive design
  - DataLux brand colors and typography
  - Sections: Hero, Services, Deliverables, Tiers, About, Contact
  - Form ready for Formspree integration

---

## 🚧 In Progress

### Phase 2: Documentation & Version Control
- [ ] Create `project.md` (this file) - IN PROGRESS
- [ ] Create `.gitignore`
- [ ] Create `README.md`
- [ ] Initialize Git repository
- [ ] Create GitHub repository

---

## 📝 Pending Tasks

### Phase 3: Deployment & Testing
- [ ] Verify port 8002 availability
- [ ] Start Docker container (`docker compose up -d`)
- [ ] Test local access (http://localhost:8002)
- [ ] Verify container health and logs

### Phase 4: Cloudflare Tunnel Setup
- [ ] Create Cloudflare Tunnel in dashboard
  - Navigate to: Cloudflare Dashboard → Zero Trust → Networks → Tunnels
  - Create tunnel named "datalux-tunnel"
  - Copy tunnel token
- [ ] Create systemd service file (`/etc/systemd/system/cloudflared-datalux.service`)
- [ ] Configure tunnel routing (datalux.dev → http://localhost:8002)
- [ ] Enable and start systemd service
- [ ] Verify tunnel status

### Phase 5: DNS & External Access
- [ ] Verify DNS records created by tunnel
- [ ] Test external access (https://datalux.dev)
- [ ] Verify SSL/TLS working

### Phase 6: Contact Form Integration
- [ ] Sign up for Formspree (free tier)
- [ ] Get form endpoint ID
- [ ] Update index.html form action URL
- [ ] Rebuild container
- [ ] Test form submission

### Phase 7: Email Configuration
- [ ] Set up Cloudflare Email Routing
- [ ] Configure lawrence@datalux.dev forwarding
- [ ] Verify MX records
- [ ] Test email delivery

---

## 🔧 Technical Specifications

### Port Usage
**Selected Port**: 8002 (verified available)

**Rationale**:
- Follows DataLux 800x numbering pattern
- 8000: codex service (DataLux AI)
- 8001: soccer-intelligence-docs
- 8002: datalux-website ← NEW
- 8080: perez_fashion-web

**Binding**: 127.0.0.1:8002 (localhost only, not exposed to external network)

### Docker Configuration
**Service Name**: datalux-website
**Image**: nginx:alpine
**Size**: ~23MB
**Restart Policy**: unless-stopped
**Health Check**: wget http://localhost every 30s
**Network**: datalux-network (bridge)

### Nginx Configuration
**Listen Port**: 80 (inside container)
**Root Directory**: /usr/share/nginx/html
**Gzip**: Enabled for text/css/js/json
**Security Headers**:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: no-referrer-when-downgrade

**Caching**: Static assets cached for 1 year

### Cloudflare Tunnel
**Tunnel Name**: datalux-tunnel
**Service Type**: systemd
**User**: lawrence
**Restart Policy**: always (5s delay)
**Routes**:
- datalux.dev → http://localhost:8002
- www.datalux.dev → http://localhost:8002 (optional)

---

## 🔐 Security Considerations

1. **Port Isolation**: Port 8002 bound to localhost only (not 0.0.0.0)
2. **Read-Only Mounts**: HTML and nginx config mounted as :ro
3. **No Root**: nginx:alpine runs as unprivileged user
4. **SSL/TLS**: Managed by Cloudflare (automatic)
5. **Security Headers**: Configured in nginx
6. **Tunnel Only Access**: No direct port exposure to internet

---

## 📊 Project Metrics

**Start Date**: October 31, 2025
**Target Completion**: November 1, 2025
**Estimated Time**: 45-60 minutes
**Time Spent**: ~20 minutes
**Progress**: ~40% complete

### Milestones
- ✅ Project Setup (100%)
- 🔄 Documentation (50%)
- ⏳ Deployment (0%)
- ⏳ Tunnel Setup (0%)
- ⏳ Testing (0%)
- ⏳ Form Integration (0%)
- ⏳ Email Setup (0%)

---

## 🐛 Issues & Blockers

**Current Issues**: None

**Resolved Issues**: None

**Blockers**:
- Need Cloudflare Dashboard access to create tunnel token

---

## 📚 Resources & References

### Documentation
- nginx:alpine Image: https://hub.docker.com/_/nginx
- Cloudflare Tunnel Docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- Formspree Docs: https://formspree.io/guides/
- Cloudflare Email Routing: https://developers.cloudflare.com/email-routing/

### Related Files
- Business Context: `/home/lawrence/projects/business/AGENTS.md`
- Codex Service: `/home/lawrence/projects/business/docker-compose.yml`
- Existing Tunnel: `/etc/systemd/system/cloudflared-perezfashion.service`

### Commands Reference

**Docker Management**:
```bash
# Start container
cd /home/lawrence/projects/business/website
docker compose up -d

# View logs
docker compose logs -f

# Check status
docker compose ps

# Restart container
docker compose restart

# Stop container
docker compose down
```

**Tunnel Management**:
```bash
# Check tunnel status
sudo systemctl status cloudflared-datalux

# View tunnel logs
sudo journalctl -u cloudflared-datalux -f

# Restart tunnel
sudo systemctl restart cloudflared-datalux

# Enable tunnel on boot
sudo systemctl enable cloudflared-datalux
```

**Testing**:
```bash
# Test local access
curl http://localhost:8002

# Test external access
curl -I https://datalux.dev

# Check port usage
sudo netstat -tlnp | grep 8002

# Test form submission
curl -X POST https://datalux.dev/contact -d "name=Test&email=test@example.com"
```

---

## 📝 Notes & Observations

### Design Decisions
1. **Why nginx:alpine?**
   - Lightweight (~23MB vs ~150MB for apache)
   - Fast startup time
   - Well-tested and stable
   - Simple configuration

2. **Why port 8002?**
   - Follows existing numbering pattern (8000, 8001, 8002)
   - Easy to remember and identify
   - No conflicts with existing services

3. **Why dedicated tunnel?**
   - Clean separation from other projects
   - Independent management and monitoring
   - Easier troubleshooting
   - Can scale independently

4. **Why localhost binding?**
   - Security: Not exposed to external network
   - Tunnel is only access point
   - Prevents port scanning and direct attacks

### Future Enhancements
- [ ] Add Google Analytics
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Add automated backups
- [ ] Create staging environment
- [ ] Add CI/CD pipeline for updates
- [ ] Implement rate limiting
- [ ] Add WAF rules in Cloudflare

---

## 🎯 Success Criteria

The project will be considered complete when:
1. ✅ Website files are properly organized
2. ⏳ Docker container running and healthy
3. ⏳ Website accessible at http://localhost:8002
4. ⏳ Cloudflare Tunnel configured and running
5. ⏳ Website live at https://datalux.dev
6. ⏳ SSL/TLS working (HTTPS)
7. ⏳ Contact form functional
8. ⏳ Email forwarding working
9. ⏳ Git repository initialized
10. ⏳ Documentation complete

---

## 📞 Contact & Support

**Project Owner**: Lawrence A.O.T. Lucas
**Email**: lawrence@datalux.dev (pending setup)
**Location**: Houston, Texas
**Server**: databin-server

**Business**:
- Legal Entity: Cutens LLC
- DBA: DataLux Consulting
- Website: https://datalux.dev
- Services: Cloud Infrastructure, Data Engineering, Business Intelligence

---

## 🔄 Change Log

### 2025-10-31
- Created project structure
- Created docker-compose.yml
- Created nginx configuration
- Saved index.html
- Created project.md (this file)

---

**Last Updated**: October 31, 2025, 23:15 CST
**Status**: 🚧 Active Development
**Next Steps**: Create .gitignore, README.md, then deploy container
