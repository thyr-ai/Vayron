# Mission Control - Nginx + DNS Setup

**Mål:** Exponera Mission Control (localhost:8080) som `https://mc.konfident.se`

## Arkitektur

```
Telefon/Dator
    ↓ HTTPS
DNS: mc.konfident.se → 85.190.102.252 (VPS IP)
    ↓
VPS: nginx (port 443)
    ↓ reverse proxy
VPS: Mission Control Node.js app (localhost:8080)
```

**Viktigt:** 
- Mission Control körs på VPS:en
- one.com används BARA för DNS (A-record)
- Allt innehåll serveras från VPS

## Krav

### 1. Credentials (one.com)
- Sparas i: `credentials/one-com-dns.md` (git-crypt krypterat)
- Behövs för: Skapa DNS A-record
- Format:
  ```
  Username: <one.com-login>
  Password: <lösenord>
  Domän: konfident.se
  ```

### 2. VPS-paket
- nginx
- certbot + python3-certbot-nginx

## Setup-steg

### Steg 1: DNS (one.com kontrollpanel)
**Manuellt eller via API:**
- Skapa A-record:
  - **Host:** `mc`
  - **Type:** A
  - **IP:** `85.190.102.252`
  - **TTL:** 3600 (1 timme)

**Verifiering:**
```bash
dig mc.konfident.se
# Ska returnera 85.190.102.252
```

### Steg 2: Installera nginx + certbot (VPS)
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Steg 3: Nginx konfiguration
**Skapa:** `/etc/nginx/sites-available/mission-control`

```nginx
server {
    listen 80;
    server_name mc.konfident.se;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Basic auth
        auth_basic "Mission Control";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

**Aktivera site:**
```bash
sudo ln -s /etc/nginx/sites-available/mission-control /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Steg 4: Basic Auth
```bash
# Installera htpasswd verktyg
sudo apt install apache2-utils -y

# Skapa lösenordsfil
sudo htpasswd -c /etc/nginx/.htpasswd vayron
# Lösenord: mission-control-2026
```

### Steg 5: SSL-certifikat (Let's Encrypt)
```bash
sudo certbot --nginx -d mc.konfident.se
```

**Certbot gör automatiskt:**
- Hämtar SSL-certifikat
- Uppdaterar nginx config för HTTPS
- Sätter upp auto-förnyelse

**Efter certbot:**
```nginx
# /etc/nginx/sites-available/mission-control uppdateras automatiskt
server {
    listen 443 ssl;
    server_name mc.konfident.se;
    
    ssl_certificate /etc/letsencrypt/live/mc.konfident.se/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mc.konfident.se/privkey.pem;
    
    # ... resten av proxy-config
}

server {
    listen 80;
    server_name mc.konfident.se;
    return 301 https://$server_name$request_uri;
}
```

### Steg 6: Testa
```bash
# Kolla att nginx kör
sudo systemctl status nginx

# Kolla att Mission Control kör
curl http://localhost:8080

# Testa extern åtkomst
curl -u vayron:mission-control-2026 https://mc.konfident.se
```

**Från telefon:**
1. Öppna `https://mc.konfident.se`
2. Logga in: vayron / mission-control-2026
3. Mission Control ska visas

## Säkerhet

### Layers:
1. **HTTPS:** Krypterad trafik via Let's Encrypt
2. **Basic Auth:** Användarnamn + lösenord
3. **Firewall:** Endast port 443 (HTTPS) exponerad

### Credentials:
- **Basic auth:** vayron / mission-control-2026
- Byt vid behov via `sudo htpasswd /etc/nginx/.htpasswd vayron`

## Troubleshooting

### DNS fungerar inte:
```bash
# Kolla DNS-propagering
dig mc.konfident.se
nslookup mc.konfident.se 8.8.8.8
```
**Fix:** Vänta 1-24h för DNS-propagering

### Nginx-fel:
```bash
# Kolla logs
sudo tail -f /var/log/nginx/error.log

# Testa config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

### SSL-certifikat fungerar inte:
```bash
# Kolla certbot logs
sudo certbot certificates

# Förnya manuellt
sudo certbot renew --dry-run
```

### Mission Control inte tillgänglig:
```bash
# Kolla att Node.js app kör
ps aux | grep node

# Starta om Mission Control
cd /home/administrator/vayron/mission-control-web
node server.js
```

## Underhåll

### SSL-förnyelse:
- **Automatiskt:** Certbot cron job förnyas var 12:e timme
- **Manuellt:** `sudo certbot renew`

### Nginx reload (vid config-ändringar):
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Mission Control systemd service (framtida):
Skapa `/etc/systemd/system/mission-control.service` för auto-start vid reboot.

## Status

- [x] One.com credentials mottagna
- [x] DNS A-record skapad (mc.konfident.se → 85.190.102.252)
- [x] Nginx installerad
- [x] Site-config skapad
- [x] Basic auth konfigurerad (vayron / mission-control-2026)
- [x] SSL-certifikat installerat (expires 2026-05-28)
- [x] Firewall konfigurerad (port 80 & 443)
- [x] Mission Control startat
- [x] Testad via curl (200 OK)
- [ ] Testad från telefon

**URL:** https://mc.konfident.se  
**Login:** vayron / mission-control-2026

---

**Skapad:** 2026-02-27  
**Uppdaterad:** 2026-02-27 06:00 CET  
**Setup av:** Vayron (automated)
