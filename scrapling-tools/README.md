# Scrapling Tools för Vayron

Praktiska web scraping-verktyg byggda med Scrapling för automatisering och övervakning.

## 🚀 Installation

Scrapling är redan installerat i `scrapling-env/` venv med alla features:
- ✅ HTTP requests (fast & stealthy)
- ✅ Browser automation (Playwright + Patchright)
- ✅ Anti-bot bypass (Cloudflare Turnstile)
- ✅ MCP server för AI-integration
- ✅ Interactive shell

## 📦 Verktyg

### 1. Domain Monitor
Övervakar alla Mattias domäner (uptime, SSL, laddningstid):

```bash
./scrape.sh domains
```

**Output:** `domain_status.json` med status för alla 11 domäner

**Use cases:**
- Daglig heartbeat-check
- Alert om någon domän går ner
- SSL-certifikat monitoring
- Performance tracking

### 2. X Bookmarks Scraper (Proof of Concept)
Scraper X/Twitter bookmarks automatiskt:

```bash
./scrape.sh x-timeline mattiasthyr
```

**Status:** Fungerar för offentliga timelines. För bookmarks behövs:
- Cookies från inloggad X-session
- Eventuellt proxy-rotation för att undvika rate limits

**Framtida upgrade:**
- Cookie-export från Chrome
- Auto-uppdatering av Mission Control Bookmarks viewer
- Scraping av flera konton samtidigt

### 3. Test Suite
Verifierar att Scrapling fungerar:

```bash
./scrape.sh test
```

## 🛠️ Integration med Vayron

### Från Python (OpenClaw context):
```python
import subprocess
result = subprocess.run([
    '/home/administrator/vayron/scrapling-tools/scrape.sh', 
    'domains'
], capture_output=True, text=True)

# Parse JSON output
import json
with open('/home/administrator/vayron/scrapling-tools/domain_status.json') as f:
    domains = json.load(f)
    
    down_domains = [d for d in domains if d['status'] == 'down']
    if down_domains:
        notify_mattias(f"⚠️ {len(down_domains)} domains are down!")
```

### Från Shell/Heartbeat:
```bash
# Daglig check kl 09:00
cd /home/administrator/vayron && ./scrapling-tools/scrape.sh domains
```

## 🎯 Planerade Verktyg

### SISU/SCF Data Scraper
Scraper information om cykelföreningar, bidrag, etc:
- SISU Småland föreningslista
- SCF distriktsbidrag
- Automatisk uppdatering för Cykelförbundsprojektet

### One.com Domain Manager
Automatisera domänhantering trots bot-filter:
- DNS-uppdateringar
- SSL-certifikat check
- Backup-status

### Newsletter/Blog Monitor
Scraper Mattias favorit-bloggar och newsletters

## 🔧 Tekniska Detaljer

**Stealth Features:**
- Browser fingerprinting (Chrome TLS)
- Random delays mellan requests
- Google referer simulation
- Headless browser med verklig profil

**Performance:**
- ~12x snabbare än BeautifulSoup
- Adaptive element finding (hittar element efter hemsideuppdateringar)
- HTTP/3 support

## 📊 Första Test-resultat

Domain Monitor (2026-03-05):
```
✅ OK: 8 domains
⚠️  Error: 1 (ovning.se - HTTP 500)
❌ Down: 2 (konfident.se SSL-fel, voilavelo.fr DNS-fel)
```

**Upptäckta problem:**
1. **konfident.se** - SSL certificate hostname mismatch
2. **ovning.se** - Internal server error (500)
3. **voilavelo.fr** - DNS resolution failure

## 🚀 Nästa Steg

1. ✅ Domain monitoring i heartbeat (dagligen)
2. [ ] Fix konfident.se SSL-certifikat
3. [ ] Debugga ovning.se server error
4. [ ] Kolla voilavelo.fr DNS settings
5. [ ] X Bookmarks cookie-export
6. [ ] SISU scraper för Cykelförbundet
7. [ ] Mission Control integration (visa domain status)

## 📝 Dependencies

Installerat via `pip install "scrapling[all]"`:
- scrapling (0.4.1)
- playwright (1.56.0) 
- patchright (1.56.0)
- curl_cffi (0.14.0)
- browserforge (1.2.4)
- mcp (1.26.0)
- IPython (9.10.0)

**Total venv size:** ~300 MB (includes Chromium browsers)

## 🎨 Användning från Mission Control

Framtida feature: Domain Status dashboard
- Real-time uptime för alla domäner
- SSL-varningar
- Performance graphs
- One-click restart/fix
