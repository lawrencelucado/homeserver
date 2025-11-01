#!/bin/bash
# Manual backup script for FE-SCADA Dashboard
# Usage: ./scripts/backup.sh [sqlite|postgres]

set -e

BACKUP_TYPE=${1:-auto}
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="backups"

mkdir -p "$BACKUP_DIR"

echo "💾 FE-SCADA Dashboard Backup Utility"
echo "===================================="

# Detect which level is running
if docker ps | grep -q fe-scada-db; then
    LEVEL="postgres"
elif [ -f data/dev.db ]; then
    LEVEL="sqlite"
else
    echo "❌ No database found"
    exit 1
fi

if [ "$BACKUP_TYPE" = "auto" ]; then
    BACKUP_TYPE="$LEVEL"
fi

case "$BACKUP_TYPE" in
    sqlite)
        echo "📦 Backing up SQLite database..."
        if [ ! -f data/dev.db ]; then
            echo "❌ SQLite database not found at data/dev.db"
            exit 1
        fi

        cp data/dev.db "$BACKUP_DIR/sqlite-$TIMESTAMP.db"
        echo "   ✅ Backup created: $BACKUP_DIR/sqlite-$TIMESTAMP.db"

        # Show size
        SIZE=$(du -h "$BACKUP_DIR/sqlite-$TIMESTAMP.db" | cut -f1)
        echo "   📊 Size: $SIZE"
        ;;

    postgres)
        echo "📦 Backing up PostgreSQL database..."
        if ! docker ps | grep -q fe-scada-db; then
            echo "❌ PostgreSQL container not running"
            exit 1
        fi

        # Manual backup via pg_dump
        docker exec fe-scada-db pg_dump -U appuser study > "$BACKUP_DIR/postgres-$TIMESTAMP.sql"
        echo "   ✅ Backup created: $BACKUP_DIR/postgres-$TIMESTAMP.sql"

        # Also trigger automated backup
        if docker ps | grep -q fe-scada-backup; then
            echo "   🔄 Triggering automated backup..."
            docker exec fe-scada-backup backup
        fi

        # Show size
        SIZE=$(du -h "$BACKUP_DIR/postgres-$TIMESTAMP.sql" | cut -f1)
        echo "   📊 Size: $SIZE"
        ;;

    *)
        echo "❌ Invalid backup type: $BACKUP_TYPE"
        echo "Usage: $0 [sqlite|postgres]"
        exit 1
        ;;
esac

# List recent backups
echo ""
echo "📁 Recent backups:"
ls -lht "$BACKUP_DIR" | head -6

# Cleanup old backups (keep last 30)
echo ""
echo "🧹 Cleaning old backups (keeping last 30)..."
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR" | wc -l)
if [ "$BACKUP_COUNT" -gt 30 ]; then
    ls -1t "$BACKUP_DIR" | tail -n +31 | xargs -I {} rm "$BACKUP_DIR/{}"
    echo "   ✅ Cleaned $(($BACKUP_COUNT - 30)) old backups"
else
    echo "   ✅ No cleanup needed ($BACKUP_COUNT backups)"
fi

echo ""
echo "✅ Backup complete!"
