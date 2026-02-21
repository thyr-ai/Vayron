#!/bin/bash

# Mission Control Web - Stop Script

echo "🛑 Stopping Mission Control Web..."

pkill -f "node server.js"

if [ $? -eq 0 ]; then
    echo "✅ Server stopped"
else
    echo "⚠️  No running server found"
fi
