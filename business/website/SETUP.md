# DataLux Website Setup Guide

## Current Status

✅ **Website**: Live at https://datalux.dev  
✅ **Backend API**: Running on port 8003  
✅ **Database**: PostgreSQL on port 5433  
✅ **Telegram Notifications**: Configured and working  
⏳ **Email Notifications**: Awaiting email setup  

## Services

### Docker Containers
- `datalux-website` - nginx (port 8002)
- `datalux-backend` - FastAPI (port 8003)
- `datalux-postgres` - PostgreSQL (port 5433)

### Contact Form
- Endpoint: `POST /api/contact`
- Frontend: AJAX submission with validation
- Notifications: Telegram (working), Email (pending)

## Configuration

### Telegram Bot
- **Bot**: @datalux_contact_bot
- **Status**: ✅ Working
- **Chat ID**: Configured for Lawrence Lucas

### Email (Pending Setup)
Requires configuration in `.env`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lawrence@datalux.dev
SMTP_PASSWORD=<app_password>
NOTIFICATION_EMAIL=lawrence@datalux.dev
```

## Testing

### Test Contact Form
```bash
curl -X POST http://localhost:8002/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

### View Database Submissions
```bash
docker exec datalux-postgres psql -U datalux -d datalux_contacts \
  -c "SELECT id, name, email, created_at FROM contact_submissions ORDER BY created_at DESC;"
```

### Check Logs
```bash
docker compose logs fastapi-backend --tail=50
```

## Maintenance

### Restart Services
```bash
docker compose restart
```

### Update Environment
```bash
# After editing .env
docker compose down && docker compose up -d
```

### Backup Database
```bash
docker exec datalux-postgres pg_dump -U datalux datalux_contacts > backup.sql
```

## Next Steps

1. Set up lawrence@datalux.dev email
2. Configure SMTP credentials in .env
3. Test email notifications
4. Set up database backups
5. Monitor form submissions

---

Last Updated: November 1, 2025
