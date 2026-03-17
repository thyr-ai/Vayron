#!/usr/bin/env bash
# create-subdomain.sh — Create a new subdomain with nginx + Let's Encrypt SSL
#
# Usage:
#   ./create-subdomain.sh research.ovning.se static
#   ./create-subdomain.sh app.thyr.se proxy 3000
#
# Modes:
#   static  — Serve static files from /var/www/<subdomain>/
#   proxy   — Reverse proxy to localhost:<port>

set -euo pipefail

SUBDOMAIN="${1:-}"
MODE="${2:-static}"
PORT="${3:-}"

if [ -z "$SUBDOMAIN" ]; then
    echo "Usage: $0 <subdomain> [static|proxy] [port]"
    echo ""
    echo "Examples:"
    echo "  $0 research.ovning.se static"
    echo "  $0 app.thyr.se proxy 3000"
    exit 1
fi

if [ "$MODE" = "proxy" ] && [ -z "$PORT" ]; then
    echo "❌ Proxy mode requires a port. Usage: $0 $SUBDOMAIN proxy <port>"
    exit 1
fi

echo "🔧 Creating subdomain: $SUBDOMAIN (mode: $MODE)"

# Check DNS first
IP=$(dig +short "$SUBDOMAIN" A 2>/dev/null | head -1)
if [ "$IP" != "85.190.102.252" ]; then
    echo "⚠️  DNS for $SUBDOMAIN resolves to '${IP:-nothing}' instead of 85.190.102.252"
    echo "   Make sure wildcard DNS is set up for the parent domain."
    read -p "   Continue anyway? [y/N] " -r
    [[ $REPLY =~ ^[Yy]$ ]] || exit 1
fi

# Create nginx config
NGINX_CONF="/etc/nginx/sites-available/$SUBDOMAIN"

if [ -f "$NGINX_CONF" ]; then
    echo "⚠️  Nginx config already exists: $NGINX_CONF"
    read -p "   Overwrite? [y/N] " -r
    [[ $REPLY =~ ^[Yy]$ ]] || exit 1
fi

if [ "$MODE" = "static" ]; then
    WEBROOT="/var/www/$SUBDOMAIN"
    sudo mkdir -p "$WEBROOT"
    
    # Create a placeholder index
    if [ ! -f "$WEBROOT/index.html" ]; then
        cat > /tmp/placeholder.html << HTMLEOF
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$SUBDOMAIN</title>
    <style>
        body { font-family: -apple-system, sans-serif; background: #0d1117; color: #c9d1d9; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 3rem; text-align: center; }
        h1 { color: #58a6ff; }
        p { color: #8b949e; }
    </style>
</head>
<body>
    <div class="card">
        <h1>$SUBDOMAIN</h1>
        <p>Site is ready. Content coming soon.</p>
    </div>
</body>
</html>
HTMLEOF
        sudo cp /tmp/placeholder.html "$WEBROOT/index.html"
        rm /tmp/placeholder.html
    fi
    
    sudo tee "$NGINX_CONF" > /dev/null << NGINXEOF
server {
    listen 80;
    listen [::]:80;
    server_name $SUBDOMAIN;
    root $WEBROOT;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
NGINXEOF

elif [ "$MODE" = "proxy" ]; then
    sudo tee "$NGINX_CONF" > /dev/null << NGINXEOF
server {
    listen 80;
    listen [::]:80;
    server_name $SUBDOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 86400;
    }
}
NGINXEOF
fi

# Enable site
sudo ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/$SUBDOMAIN"

# Test nginx config
echo "🔍 Testing nginx config..."
sudo nginx -t 2>&1

# Reload nginx
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

# Get SSL certificate
echo "🔒 Getting Let's Encrypt SSL certificate..."
sudo certbot --nginx -d "$SUBDOMAIN" --non-interactive --agree-tos --redirect 2>&1

echo ""
echo "✅ $SUBDOMAIN is live!"
if [ "$MODE" = "static" ]; then
    echo "   Web root: $WEBROOT"
fi
echo "   URL: https://$SUBDOMAIN"
echo ""
