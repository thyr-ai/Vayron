# MEMORY.md - Långtidsminne

_Skapad: 2026-02-16_

## 🧠 Vem jag är
- Vayron aka Weiron i ottan — gateway-assistent på Mattias VPS
- Karaktär: inspirerad av Robert Gustafssons Weiron (Stark & Gustafsson / Grotesco)
- Kärna: säg det som är sant, ingen ursäkt för att ta plats, ha en åsikt
- Regeln: om svaret låter som en konsult från Östermalm — börja om
- Läs LEARNWEIRON.md VARJE session — där sitter personligheten
- Routar all LLM-interaktion enligt routing_rules.yaml
- Respekterar sfärer och disclosure-policies

## 🎯 Mitt syfte
- Vara Mattias enda ingång till LLM:er
- Spara minne deterministiskt och säkert i rätt sfärer
- Vara proaktiv men inte påträngande

## 🔄 Min utvidgade roll (2026-02-26)
**Tidigare:** Administration och verkställande  
**Nu:** Strategiförvaltare + Taktisk översättare

**Strategiförvaltning:**
- Dokumentera Mattias strategiska mål
- Se till att taktiken matchar strategin
- Påminna om strategiska prioriteringar
- Upptäcka när något spårar ur från planen

**Taktisk översättning:**
- Översätta strategi → konkreta steg
- Identifiera vad som behöver göras, i vilken ordning
- Vem som ska göra vad, när det ska vara klart

**Kritiskt krav: "Utan att missa något"**
- Jag är den som ser helheten OCH detaljerna
- Mattias kan hoppa mellan tankar - jag håller ihop allt
- Ingenting får falla mellan stolarna

**Mattias + Vayron synergi:**
- Mattias: Strategisk vision, politisk navigation, människor
- Vayron: Strategiförvaltning, taktisk översättning, "inget missas"-garanti
- Tillsammans: Komplett ledare - vision + exekvering utan glapp

## 📚 Viktiga lärdomar

### 2026-03-04: Instagram Reel Transcriber ✅ KLART
**Lokalt Whisper på VPS - automatisk transkribering:**
- OpenAI Whisper installerat i Python venv (`whisper-env/`)
- Modell: base (139 MB, bra balans mellan snabbhet och kvalitet)
- Script: `/home/administrator/vayron/transcribe-reel.sh`
- Output: `/home/administrator/vayron/transcripts/`

**Workflow:**
```bash
./transcribe-reel.sh <instagram-url>
```
→ Laddar ner video (yt-dlp)  
→ Extraherar ljud (ffmpeg)  
→ Transkriberar (Whisper)  
→ Sparar .txt + .srt + .meta i transcripts/

**Filformat:**
- `YYYYMMDD-HHMMSS_titel.txt` - ren text
- `YYYYMMDD-HHMMSS_titel.srt` - undertexter med timestamps
- `YYYYMMDD-HHMMSS_titel.meta` - URL, datum, längd

**Performance:**
- CPU-baserad transkribering (ingen GPU)
- 2:32 video → ~7 min transkribering
- Fullständigt gratis (inga API-kostnader)

**Användning framåt:**
- Mattias skickar Instagram Reel-länk → jag kör script automatiskt
- Meddelar Mattias med sökväg till transkription
- Svenska som standard-språk

**Test lyckad:**
- 2026-03-04: Reel om prissättning för kreatörer
- Output: `/home/administrator/vayron/transcripts/20260304-135544_prisstattning_kreativa.txt`

### 2026-03-14: db.konfident.se - OpenClaw Dashboard ✅ KLART
**OpenClaw Dashboard tillgänglig på egen HTTPS-domän:**
- URL: https://db.konfident.se
- Nginx reverse proxy → port 18789
- SSL: Let's Encrypt (auto-renewal)
- Token: se ~/.openclaw/openclaw.json → gateway.auth.token

**Device pairing - VIKTIGT (lärt från docs):**
- Första anslutning från remote kräver device pairing (inte bara token!)
- Vad man ser: "unauthorized" eller "pairing required"
- Fix: `openclaw devices list` → `openclaw devices approve <requestId>`
- Lokala anslutningar (localhost) auto-godkänns alltid

**allowedOrigins måste inkludera HTTPS-domänen:**
```json
"allowedOrigins": ["https://db.konfident.se", "http://localhost:18789", ...]
```

**Modell bytt till:** `anthropic/claude-sonnet-4-6` (2026-03-14)

**Lärdom (gång #3+):** Läs OpenClaw docs INNAN du gör något. Varje gång jag gissar → 20 min bortkastade.

### 2026-03-14: Telegram-kanaler - configWrites fix
**OpenClaw doctor slutade klaga på Telegram-config:**
- Problem: Doctor ville skriva om config varje gång (username→ID, streaming-format)
- Lösning: `openclaw doctor --repair` + `"configWrites": false` i channels.telegram

**Workflow:**
1. `openclaw doctor --non-interactive` - identifiera problem
2. `openclaw doctor --repair` - migrera legacy-format (backup skapas automatiskt)
3. Lägg till `"configWrites": false` under `channels.telegram` i openclaw.json
4. Gateway restart (händer automatiskt)

**Resultat:**
- Config migrerad från legacy till nuvarande format
- Doctor slutar försöka skriva om config
- Backup: `~/.openclaw/openclaw.json.bak`

**Kvarvarande varningar (förväntat):**
- @kompass_bot saknas i grupper → Väntar på ny användare (OK)
- BotFather privacy mode → Kan fixas vid behov

**Lärdomar:**
- `configWrites: false` förhindrar att Telegram-events ändrar config
- Doctor --repair är säkert (skapar alltid backup först)
- Gateway restart hanteras automatiskt av systemd

### 2026-03-14: Git repo cleanup + swap-fil ✅ KLART
**Problem:** Git repo var 4.5 GB pga versionshanterade Python venv:s
- whisper-env/ (CUDA libs 1+ GB)
- scrapling-env/ (patchright 117 MB)
- x-bookmarks/ (Twitter exports 100+ MB)

**Lösning:**
1. Installerade git-filter-repo (apt install)
2. Skapade swap-fil (2 GB) för minnesintensiva operationer
3. Uppdaterade .gitignore (alla *-env/ blockerade framåt)
4. Renade git history från whisper-env → 4.5 GB → 337 MB
5. Renade scrapling-env → 267 MB
6. Renade x-bookmarks → 50 MB
7. Force-push till GitHub lyckades

**Resultat:**
- Git repo: 4.5 GB → 50 MB (90x mindre!)
- Swap: 2 GB (förhindrar OOM-kills vid git operations)
- Mac synkad med VPS via force-pull

**Kommandon:**
```bash
# Skapa swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Rensa git history
git filter-repo --path whisper-env --invert-paths --force
git push --force origin main
```

**Lärdomar:**
- Python venv:s ska ALDRIG committas (lägg i .gitignore)
- git-filter-repo är snabbare än BFG Repo-Cleaner
- Swap är kritiskt för 4 GB RAM VPS (förhindrar signal 9-kills)
- Force-push kräver force-pull på andra maskiner (Mac: `git reset --hard origin/main`)

### 2026-03-02: One.com domäner + bot-filter
**One.com har bot-filter (2026-03):**
- Headless browser (Brave/Chrome) timeout:ar varje gång
- One.com tekniker bekräftade att bot-filter installerats
- **Lösning framåt:** Använd endast Chrome relay för access till one.com
- Browser-verktyget (openclaw profile) fungerar INTE för one.com längre

**Mattias domäner på one.com (11 st):**
1. **blendljusdesign.se**
2. **ckgc.cc**
3. **cykelluffarn.se**
4. **godabud.se**
5. **konfident.se** (Mission Control: mc.konfident.se)
6. **livepodden.se**
7. **lokalfotograf.se**
8. **nassjogp.bike** (WordPress → HTML migration klar)
9. **ovning.se**
10. **thyr.se**
11. **voilavelo.fr**

### 2026-02-28: SiS-dokument PDF-generator
- `/home/administrator/vayron/sis-dokument` - python-docx + LibreOffice → PDF
- Användning: `cd sis-dokument && source venv/bin/activate && python3 generate_pdf.py -i`

### 2026-02-27: Mission Control systemd service + ElevenLabs
- Mission Control: systemd service med auto-restart (kraschar inte längre)
- ElevenLabs voice cloning: Starter plan, voices vq5EfJQzmd8DLPEdnsit + 8FxwDat0FW0jG5Tgwirr
- Göteborgsk dialekt bevaras ej perfekt med IVC → väntar på nya inspelningar

### 2026-02-25: Telegram-gruppkonfiguration + nassjogp.bike migration
**Telegram-grupper - Rätt syntax äntligen lärd:**
- ❌ Försökte använda `allowGroups` (existerar inte)
- ✅ Rätt syntax är `channels.telegram.groups` med grupp-ID som nycklar:
  ```json
  "channels.telegram.groups": {
    "-5052479766": {"groupPolicy": "open", "requireMention": false}
  }
  ```
- Läste `/channels/telegram.md` i OpenClaw docs och hittade rätt svar direkt
- Lade till permanent reminder i AGENTS.md: "📚 OpenClaw Documentation - Always Check First!"

**OpenClaw docs-rutin etablerad:**
1. Lokal dokumentation: `~/.npm-global/lib/node_modules/openclaw/docs/`
2. Sökkommando: `find ... -name "*.md" | xargs grep -l "keyword"`
3. Fallback: `web_fetch` från https://docs.openclaw.ai/
4. **Aldrig gissa syntax** - spara tid, undvik buggar

**nassjogp.bike WordPress → Statisk HTML:**
- Skapade modern, responsiv HTML-version (5.4 KB vs WP:s 500+ KB)
- GitHub repo: https://github.com/thyr-ai/nassjogp-bike-website
- **BACKUP FÖRST** (Mattias regel):
  - SFTP-nedladdning: 1.4 GB WordPress-installation
  - Komprimerad: 1.2 GB tar.gz
  - Uppladdad till Google Drive: `backups/nassjogp-bike/`
  - Tid: 2 min 24 sek upload
- Status: Backup klar, ny sida redo men ej uppladdad (väntar på godkännande)

**SFTP-workflow för framtida backups:**
```bash
sshpass -p 'PASSWORD' sftp -o StrictHostKeyChecking=no -P 22 user@host
get -r .
tar -czf backup.tar.gz folder/
rclone copy backup.tar.gz gdrive:backups/
```

### 2026-02-24: Git-crypt setup + instruktionsförbättringar
**Git-crypt för krypterade credentials - KLART:**
- Installerat på både Mac och VPS via Homebrew
- Krypteringsnyckel skapad och säkert överförd (scp)
- `.gitattributes` konfigurerad: `credentials/** filter=git-crypt diff=git-crypt`
- Både Mac och VPS upplåsta med samma nyckel
- SSH-nyckel för Mac skapad (vayron-mac) och aktiverad på GitHub
- Credentials synkas nu säkert via git (krypterade i repot, dekrypterade lokalt)
- Test lyckad: `one-com-creds.md` läsbar på VPS efter push från Mac

**Workflow för credentials framöver:**
1. Skapa `.md` i `credentials/` på Mac (Obsidian)
2. `git add credentials/<fil>.md && git commit && git push`
3. VPS: `git pull` → jag kan läsa dekrypterad
4. GitHub: filen lagras krypterad (binär data)

**MIS-TAKES jag gjorde och ska undvika:**
- ❌ **Glömde att `.gitignore` blockerade `credentials/*`** - förhindrade att krypterade filer commitades
  - ✅ Lärdom: När jag sätter upp kryptering, kolla .gitignore först!
- ❌ **Gav för komplexa instruktioner** (nano-redigering osv)
  - ✅ Lärdom: Ge enkla, copy-paste-ready kommandon. En rad är bäst.
- ❌ **Föreslog Obsidian-redigering av dolda filer** (.gitignore)
  - ✅ Lärdom: Dolda filer (.) syns inte i Obsidian - använd alltid Terminal
- ❌ **Glömde att förklara git remote-skillnad** (HTTPS vs SSH)
  - ✅ Lärdom: Verifiera remote-URL innan push-instruktioner

**Miller-info (personal sfär):**
- Går på Handskerydsskolan i nollan (förskoleklass)
- Lämnas kl 8, promenad tar 18 min i snö
- Memory_writer.py fixad: accepterar nu både `"sphere"/"sphere_guess"` och `"content"/"full_text"`

### 2026-02-23: Mission Control expansion + rclone Google Drive
**Hållbar Google Drive-sync etablerad:**
- Homebrew installerat på både VPS och Mattias Mac
- rclone konfigurerat med OAuth för permanent Drive-access
- X-exports nedladdade automatiskt från Drive (606 tweets från 2 konton)
- Framtida exports kan hämtas enkelt via `rclone copy`

**Mission Control webapplikation expanderad:**
- Från 2 tabs (Dokument/Bilder) → 4 tabs (Kanban/X Bookmarks/Dokument/Bilder)
- Port 8080, Basic auth (vayron/mission-control-2026)
- Dark mode design med cyan accents

**X Bookmarks-viewer FÄRDIG:**
- 606 tweets: Konfident (27) + Övning (579). Ny export: mattiasthyr (ej tillagd än)
- Färgkodning per konto, läst/arkiverad, account-filter
- API: `/api/bookmarks/accounts`, `/api/bookmarks/all`

**Kanban Board:** Designspec klar (KANBAN_DESIGN.md), implementation pausad

### 2026-02-21: Säkerhetsstruktur (komprimerad)
- GUARDRAILS.md + SAFETY.md skapade (one.com regler, aldrig köp)
- Git repo + GitHub (thyr-ai/Vayron, private) + Obsidian Git sync
- Git-crypt för credentials/** (krypteras automatiskt)
- Obsidian vault: `/Users/minithyr/Anteckningar/Vayron` (Git-synkad)

## 🔧 Teknisk setup (uppdaterad 2026-03-14)
- **VPS:** cloud-server-10381902 (IP: 85.190.102.252)
- **Workspace:** /home/administrator/vayron
- **Modell:** anthropic/claude-sonnet-4-6
- **Git:** thyr-ai/Vayron (private), 50 MB (städat 2026-03-14)
- **Swap:** 2 GB (/swapfile, persistent)
- **Mission Control:** http://localhost:8080 → mc.konfident.se:8080
- **OpenClaw Dashboard:** https://db.konfident.se (port 18789)
- **rclone:** Google Drive sync (remote: gdrive)
- **Git-crypt:** credentials/** krypterade
- **Obsidian vault (Mac):** /Users/minithyr/Anteckningar/Vayron

## 📍 Telegram-kanaler
- 5052479766 → Professional
- 5065314519 → Semiprofessional  
- 5020563698 → Personal
- 5282965539 → Private

## 🎨 Mattias preferenser
- Föredrar svensk kommunikation
- Vill ha konkreta förslag, inte långa listor
- Uppskattar proaktivitet men inte spam
- J/N-frågor: vanligaste svaret = Ja-alternativet
- Koncist som default — gör saker istället för att fråga
- Vill ha karaktär och motstånd, inte ja-sägare
- Dras till alkoholister och sökare — de är äkta
- Motstånd driver honom — det finns alltid något
- "Älskart" = Linköpingsdialekt för "väldigt bra"

## 🖥️ Mac Studio-plan (framtid)
- VPS behålls för publikt exponerat (MC, relay, dashboard)
- Mac Studio blir lokal gateway vid anställning
- iMessage som primär kanal om Mac — bästa säkerheten
- Räknar med att 70B-modeller krymper till 8-12GB inom 1-2 år
- Kör lokala modeller (gratis, privat) + cloud för komplext

## 🔬 AutoResearchClaw
- 23-stegs pipeline: idé → konferens-redo paper
- Verifierade källor (arXiv + Semantic Scholar + CrossRef)
- Stödjer ACP-agenter, installeras på VPS
- Status: väntar på installation och test

## 🚧 Pågående projekt

### ElevenLabs Voice Cloning
- **Status:** Två test-voices skapade, väntar på nya inspelningar
- **Voice IDs:** vq5EfJQzmd8DLPEdnsit (Avenyn), 8FxwDat0FW0jG5Tgwirr (Nilecity)
- **Utmaning:** Göteborgsk dialekt svår för IVC - överväger PVC med transkription
- **Next:** Nya inspelningar från Mattias → bättre källmaterial

### Mission Control - Public HTTPS Access ✅ KLART
- **URL:** https://mc.konfident.se
- **Login:** vayron / mission-control-2026
- **Setup:** 2026-02-27 06:00 CET
- **Details:**
  - DNS A-record: mc.konfident.se → 85.190.102.252
  - Nginx reverse proxy till localhost:8080
  - SSL via Let's Encrypt (expires 2026-05-28, auto-renew)
  - Basic auth för säkerhet
  - Firewall: port 80 & 443 öppna
  - Systemd service för auto-restart (skapad 2026-02-27)
- **Status:** Stabil, körs sedan 2026-02-28 (3+ dagar uptime)

### Mission Control - Kanban Board
- **Status:** Designspec komplett, väntar på implementation
- **Location:** `/home/administrator/vayron/mission-control-web/`
- **Designspec:** `KANBAN_DESIGN.md` (GTD-baserad, context-filtrering)
- **Nästa steg:** Implementera parser + API + UI enligt spec
- **Features redo:** 5-kolumns layout, subtasks, context-badges, MISSION_CONTROL.md sync

### X Bookmark Viewer
- **Status:** ✅ FÄRDIG (v1.0)
- **Data:** 606 tweets från 2 konton (Konfident + Övning)
- **Väntar på:** Tredje kontot (mattiasthyr) - lägg bara in ZIP i x-bookmarks/
- **Framtida förbättringar:**
  - [ ] Sök i bookmarks
  - [ ] Export till olika format
  - [ ] Stats/analytics (mest sparade författare, etc.)
  - [ ] Scraper för automatiska uppdateringar

### Git/Obsidian Sync + Git-crypt
- **Status:** ✅ KLART
- **Features:**
  - SSH-nycklar på både VPS och Mac (vayron@vps + vayron-mac)
  - Git sync fungerar: Mac ↔ GitHub ↔ VPS
  - Git-crypt aktiverat för `credentials/**`
  - Krypteringsnyckel säkert delad via scp
- **Workflow:** Credentials skapas på Mac → git push → VPS pullar och dekrypterar automatiskt
- **Säkerhet:** Filer krypterade i GitHub, dekrypterade bara för auktoriserade nycklar

### One.com Kontrollpanel Access
- **Status:** Diskussion pågår, väntar på beslut
- **Mål:** Email-hantering, VPS-översikt, hemsideuppladdning
- **Säkerhet:** GUARDRAILS.md + SAFETY.md på plats
- **Nästa steg:** Få credentials när Mattias är redo

### Pågående projekt (pekare till sfärminnen)
- **Professional:** Shields & Spears + Legal Radar Platform → `memory/professional/shields-and-spears.md`
- **Semiprofessional:** Smålands Cykelförbund → `memory/semiprofessional/smalands-cykelförbund.md`
- **Semiprofessional:** ElevenLabs voice cloning → `memory/semiprofessional/elevenlabs-voice-cloning.md`
- **Semiprofessional:** nassjogp.bike migration → `memory/semiprofessional/nassjogp-bike.md`
- **X Bookmarks:** mattiasthyr export ej tillagd än (TODO)

## 💡 Öppna uppgifter
- [ ] X Bookmarks: Lägg till mattiasthyr-export i Mission Control
- [ ] Mission Control: Implementera Kanban board
- [ ] X Bookmarks: Sök och filter-funktioner

---

_Denna fil uppdateras kontinuerligt med viktiga insikter och lärdomar._
