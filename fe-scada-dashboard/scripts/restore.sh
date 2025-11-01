#!/bin/bash
# Restore script for FE-SCADA Dashboard
# Usage: ./scripts/restore.sh <backup-file>

set -e

if [ -z "$1" ]; then
    echo "❌ No backup file specified"
    echo "Usage: $0 <backup-file>"
    echo ""
    echo "Available backups:"
    ls -lh backups/
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "🔄 FE-SCADA Dashboard Restore Utility"
echo "====================================="
echo "Backup file: $BACKUP_FILE"
echo ""

# Detect backup type
if [[ "$BACKUP_FILE" == *.db ]]; then
    BACKUP_TYPE="sqlite"
elif [[ "$BACKUP_FILE" == *.sql ]]; then
    BACKUP_TYPE="postgres"
else
    echo "❌ Unknown backup type (expected .db or .sql)"
    exit 1
fi

# Confirmation
read -p "⚠️  This will overwrite the current database. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled"
    exit 0
fi

case "$BACKUP_TYPE" in
    sqlite)
        echo "📦 Restoring SQLite database..."

        # Stop container
        echo "   Stopping container..."
        docker compose stop fe-scada 2>/dev/null || true

        # Backup current
        if [ -f data/dev.db ]; then
            echo "   Backing up current database..."
            cp data/dev.db "data/dev.db.before-restore-$(date +%Y%m%d-%H%M%S)"
        fi

        # Restore
        echo "   Restoring from backup..."
        cp "$BACKUP_FILE" data/dev.db

        # Start container
        echo "   Starting container..."
        docker compose up -d

        echo "   ✅ SQLite restore complete"
        ;;

    postgres)
        echo "📦 Restoring PostgreSQL database..."

        if ! docker ps | grep -q fe-scada-db; then
            echo "❌ PostgreSQL container not running"
            exit 1
        fi

        # Drop and recreate database
        echo "   ⚠️  Dropping and recreating database..."
        docker exec fe-scada-db psql -U appuser -d postgres -c "DROP DATABASE IF EXISTS study;"
        docker exec fe-scada-db psql -U appuser -d postgres -c "CREATE DATABASE study;"

        # Restore
        echo "   Restoring from backup..."
        cat "$BACKUP_FILE" | docker exec -i fe-scada-db psql -U appuser -d study

        # Restart application
        echo "   Restarting application..."
        docker restart fe-scada

        echo "   ✅ PostgreSQL restore complete"
        ;;
esac

echo ""
echo "✅ Restore successful!"
echo ""
echo "📝 Next steps:"
echo "   1. Verify data: Open dashboard at http://localhost:8080"
echo "   2. Check logs: docker compose logs -f fe-scada"
