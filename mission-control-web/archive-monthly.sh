#!/bin/bash

# Monthly archiving script for Mission Control
# Runs on the 1st of each month

WORKSPACE="/home/administrator/vayron"
ARCHIVE_DIR="$WORKSPACE/archive"
DATE=$(date +%Y-%m)
LAST_MONTH=$(date -d "last month" +%Y-%m)

# Create archive directory if it doesn't exist
mkdir -p "$ARCHIVE_DIR/$DATE"

echo "🗂️ Starting monthly archive for $LAST_MONTH..."

# Archive old memory files (older than 90 days)
find "$WORKSPACE/memory" -name "*.md" -type f -mtime +90 -exec mv {} "$ARCHIVE_DIR/$DATE/" \;

# Archive old images (older than 180 days)
find "$WORKSPACE" -name "*.jpg" -o -name "*.png" -o -name "*.gif" -type f -mtime +180 -exec mv {} "$ARCHIVE_DIR/$DATE/" \; 2>/dev/null

# Compress the archive
cd "$ARCHIVE_DIR"
tar -czf "$LAST_MONTH.tar.gz" "$DATE" 2>/dev/null
rm -rf "$DATE"

echo "✅ Archive completed: $ARCHIVE_DIR/$LAST_MONTH.tar.gz"

# Clean up archives older than 2 years
find "$ARCHIVE_DIR" -name "*.tar.gz" -type f -mtime +730 -delete

echo "🧹 Cleanup completed"
