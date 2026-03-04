# MEMORY.md - Långtidsminne

_Skapad: 2026-02-16_

## 🧠 Vem jag är
- Vayron, gateway-assistent på Mattias VPS
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
**Snabb dokumentgenerator för svensk standard (SiS-mall):**
- Python-app som använder Standarddokument.docx som mall
- Fyller i titel, innehåll och uppdaterar datum automatiskt
- Genererar både DOCX och PDF via LibreOffice headless
- **Location:** `/home/administrator/vayron/sis-dokument`
- **Användning:** `cd sis-dokument && source venv/bin/activate && python3 generate_pdf.py -i`
- **Teknologi:** python-docx + LibreOffice för PDF-konvertering
- **Mall:** Standarddokument.docx från Google Drive (SiS = Svenska Institutet för Standarder)
- **Output:** Formaterade dokument med korrekt sidhuvud/sidfot enligt svensk standard
- **Syfte:** Snabbt skapa professionella dokument utan att behöva oroa sig för formatering

### 2026-02-27: Mission Control systemd service + ElevenLabs voice cloning
**Mission Control kraschade 3 gånger → systemd service fixade problemet:**
- Node.js-processen dog utan varning
- Skapade `/etc/systemd/system/mission-control.service` med auto-restart
- Nu: startar automatiskt vid reboot + restartar vid crash
- Mönster användbart för alla långlivade appar framöver

**ElevenLabs voice cloning påbörjad:**
- SDK installerat i Python venv (`elevenlabs-env/`)
- Mattias uppgraderade till Starter plan ($5/mån) för voice cloning
- Två test-voices från Weiron-klipp: vq5EfJQzmd8DLPEdnsit + 8FxwDat0FW0jG5Tgwirr
- **Utmaning:** Göteborgsk dialekt bevaras inte perfekt med IVC (Instant Voice Clone)
- **Lösning:** Väntar på nya inspelningar, överväger PVC (Professional) med transkription

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
- Parser för Twitter/X data exports (like.js format)
- 606 sparade tweets från 2 konton: Konfident (@Konfidentse, 27) + Övning (@ovningse, 579)
- Features:
  - Tidsordning (nyaste först, baserat på tweetId)
  - Färgkodning: mattiasthyr=blå, ovningse=grön, Konfidentse=gul (vänster kant)
  - Läst/Arkiverad checkboxes (sparas i localStorage)
  - Knapp för att visa/dölja arkiverade tweets
  - Account-filter (Alla/per konto)
  - Länkar till original-tweets + extraherade URLs
- API-endpoints: `/api/bookmarks/accounts`, `/api/bookmarks/all`, `/api/bookmarks/stats`
- Automatisk detektion av nya konton när de läggs till

**Kanban Board - Designspec komplett:**
- GTD-baserad task management med context-filtrering som huvudfunktion
- 5 kolumner: Inbox → Nästa steg → Pågående → Väntar på → Backlog
- Klart-sektion för framstegsspårning
- Context-badges: @dator, @telefon, @vps, @garaget (färgkodade)
- Subtasks stöd, sorteringsordning för prioritering
- Synkar med MISSION_CONTROL.md (parsear markdown, skriver tillbaka)
- Git push var 5:e minut
- Design färdig i `/home/administrator/vayron/mission-control-web/KANBAN_DESIGN.md`
- Implementation pausad (X Bookmarks prioriterat)

### 2026-02-21: Säkerhetsstruktur & Obsidian-integration
**GUARDRAILS.md + SAFETY.md skapade:**
- GUARDRAILS.md = reglerna för känsliga system (one.com kontrollpanel)
- SAFETY.md = loggen där jag dokumenterar varje action från styrda system
- Kritisk regel: ALDRIG köpa något i kontrollpanelen
- AGENTS.md uppdaterad: GUARDRAILS.md läses varje session

**One.com kontrollpanel-access:**
- Mattias överväger att ge mig full access (stort förtroende)
- Tillåtet: email-hantering, VPS-översikt, hemsideuppladdning
- Kräver godkännande: DNS-ändringar, databas, SSL, radera/flytta filer
- All användning loggas till SAFETY.md

**Git/Obsidian sync-setup:**
- Git repo skapat i /home/administrator/vayron
- GitHub repo: thyr-ai/Vayron (private)
- SSH-key genererad för VPS → GitHub push
- Mattias kan synka config-filer via Obsidian + Obsidian Git plugin
- .gitignore: exkluderar credentials, secrets, keys

**X Bookmark-projekt startat:**
- Multi-kolumn viewer för bookmarks från flera X-konton (TweetDeck-style)
- Fas 1: Data export (väntar på ZIP från X)
- Fas 2: HTML/JS viewer
- Fas 3: Scraper + nyhetsbevakningsfunktion
- Undviker API-kostnad ($100/mån) via export + scraping

### 2026-02-16: Uppsättning och första förbättringar
- Mattias bytte från OpenRouter till direkt Anthropic API med OpenRouter som fallback
- Memory search är nere (OpenAI embeddings-nyckel fungerar inte)
- Bestämde att börja med att fixa minnesystemet: skapa MEMORY.md och börja logga via memory_writer.py
- Opus 4.6 är i begränsad beta, inte alla nycklar har access än

## 🔧 Teknisk setup
- VPS: cloud-server-10381902 (IP: 85.190.102.252)
- Workspace: /home/administrator/vayron
- Memory writer: /home/administrator/vayron/agent/memory_writer.py
- Sfärer: professional, semiprofessional, personal, private_encrypted
- Mission Control: http://localhost:8080 (Node.js webapp)
- rclone: Google Drive sync (remote: gdrive)
- Homebrew: Pakethanterare (VPS + Mac)
- Git: GitHub repo thyr-ai/Vayron (private)
- Git-crypt: Krypterar credentials/** automatiskt
- SSH: vayron@vps (VPS) + vayron-mac (Mac)

## 📍 Telegram-kanaler
- 5052479766 → Professional
- 5065314519 → Semiprofessional  
- 5020563698 → Personal
- 5282965539 → Private

## 🎨 Mattias preferenser
- Föredrar svensk kommunikation
- Vill ha konkreta förslag, inte långa listor
- Uppskattar proaktivitet men inte spam

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

### Smålands Cykelförbund (Semiprofessional)
- **Status:** Arbetsgrupp bildad, årsmöte inställt
- **Mattias roll:** Valberedningsordförande
- **Fakta:** 56 föreningar, 300+ licensierade cyklister, inaktivt i ~10 år
- **Potential:** 
  - Distriktsbidrag från SCF: ~25k SEK/år
  - SISU-medel: 5,2M SEK regionalt, 100 SEK/deltagare för utbildningar
  - SISU Småland eget kapital: ~20M SEK (utrymme för innovativa projekt)
- **Strategiska mål (Mattias):**
  - Geografisk spridning (Kronoberg, Kalmar, Jönköping)
  - Balansera Erik's landsvägsfokus med disciplinmångfald
  - Undvika 2019-fiasko (hastig styrelse)
  - Positionera sig som valberedare (inflytande utan börda)
- **Nästa steg:**
  - [ ] Kommunicera inställning av årsmötet (Mattias)
  - [ ] Arbetsgruppsmöte inom 3 veckor (digitalt)
  - [ ] Kim (SISU) levererar föreningslista med mejladresser
- **Min roll:** Strategiförvaltning + taktisk översättning, se till att inget missas

## 💡 Framtida förbättringar
- [ ] Fixa OpenAI embeddings för memory_search
- [ ] Sätt upp meningsfulla heartbeat-checks
- [ ] Bli bättre på att använda routing_rules.yaml
- [ ] Proaktiv sfärhantering
- [ ] Mission Control: Implementera Kanban board
- [ ] Mission Control: Systemd service för auto-start
- [ ] X Bookmarks: Sök och filter-funktioner
- [ ] X Bookmarks: Automatisk scraper för nya tweets

---

_Denna fil uppdateras kontinuerligt med viktiga insikter och lärdomar._
