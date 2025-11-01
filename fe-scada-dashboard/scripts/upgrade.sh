#!/bin/bash
# Upgrade script for FE-SCADA Dashboard
# Usage: ./scripts/upgrade.sh [level1|level2|level3]

set -e

TARGET_LEVEL="$1"

echo "⬆️  FE-SCADA Dashboard Upgrade Utility"
echo "======================================"

# Detect current level
CURRENT_LEVEL="unknown"
if docker ps | grep -q fe-scada-mqtt && docker ps | grep -q fe-scada-nodered; then
    CURRENT_LEVEL="level3"
elif docker ps | grep -q fe-scada-db && docker ps | grep -q fe-scada-backup; then
    CURRENT_LEVEL="level2"
elif docker ps | grep -q fe-scada; then
    CURRENT_LEVEL="level1"
fi

echo "Current deployment: $CURRENT_LEVEL"
echo "Target deployment:  $TARGET_LEVEL"
echo ""

if [ "$CURRENT_LEVEL" = "unknown" ]; then
    echo "❌ No existing deployment detected"
    echo "   Use deploy scripts instead:"
    echo "   - ./scripts/deploy-level1.sh"
    echo "   - ./scripts/deploy-level2.sh"
    echo "   - ./scripts/deploy-level3.sh"
    exit 1
fi

if [ -z "$TARGET_LEVEL" ]; then
    echo "Usage: $0 [level1|level2|level3]"
    echo ""
    echo "Available upgrades from $CURRENT_LEVEL:"
    case "$CURRENT_LEVEL" in
        level1) echo "  - level2 (add PostgreSQL + backups)" ;;
        level2) echo "  - level3 (add MQTT + Node-RED + auth)" ;;
        level3) echo "  ✅ Already at highest level" ;;
    esac
    exit 1
fi

# Validate upgrade path
case "$CURRENT_LEVEL-$TARGET_LEVEL" in
    level1-level1|level2-level2|level3-level3)
        echo "⚠️  Already at $TARGET_LEVEL - running update instead..."
        ;;
    level1-level2)
        echo "🔄 Upgrading from Level 1 (SQLite) to Level 2 (PostgreSQL)..."
        ./scripts/deploy-level2.sh
        ;;
    level1-level3|level2-level3)
        echo "🔄 Upgrading to Level 3 (Full Stack)..."
        ./scripts/deploy-level3.sh
        ;;
    level2-level1|level3-level1|level3-level2)
        echo "❌ Downgrade not supported: $CURRENT_LEVEL → $TARGET_LEVEL"
        echo "   Please backup your data and do a fresh deployment"
        exit 1
        ;;
    *)
        echo "❌ Invalid upgrade path: $CURRENT_LEVEL → $TARGET_LEVEL"
        exit 1
        ;;
esac

echo ""
echo "✅ Upgrade complete!"
