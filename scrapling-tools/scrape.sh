#!/bin/bash
# Wrapper script för Scrapling-verktyg
# Används från OpenClaw/Vayron

VENV_PATH="/home/administrator/vayron/scrapling-env"
TOOLS_PATH="/home/administrator/vayron/scrapling-tools"

# Aktivera venv
source "$VENV_PATH/bin/activate"

case "$1" in
    test)
        echo "Running Scrapling tests..."
        python3 "$TOOLS_PATH/test_scrapling.py"
        ;;
    
    domains)
        echo "Monitoring all domains..."
        python3 "$TOOLS_PATH/domain_monitor.py"
        ;;
    
    x-bookmarks)
        if [ -z "$2" ]; then
            echo "Usage: $0 x-bookmarks <username>"
            exit 1
        fi
        python3 "$TOOLS_PATH/x_bookmarks_scraper.py" "$2"
        ;;
    
    x-timeline)
        if [ -z "$2" ]; then
            echo "Usage: $0 x-timeline <username>"
            exit 1
        fi
        python3 -c "
import sys
sys.path.insert(0, '$VENV_PATH/lib/python3.12/site-packages')
from x_bookmarks_scraper import scrape_public_timeline
scrape_public_timeline('$2')
        "
        ;;
    
    *)
        echo "Scrapling Tools - Usage:"
        echo "  $0 test              - Test Scrapling installation"
        echo "  $0 domains           - Monitor all Mattias domains"
        echo "  $0 x-timeline <user> - Scrape public X timeline"
        echo "  $0 x-bookmarks <user> - Scrape X bookmarks (requires auth)"
        ;;
esac
