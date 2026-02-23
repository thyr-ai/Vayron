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

## 📚 Viktiga lärdomar

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
- VPS: cloud-server-10381902
- Workspace: /home/administrator/vayron
- Memory writer: /home/administrator/vayron/agent/memory_writer.py
- Sfärer: professional, semiprofessional, personal, private_encrypted
- Mission Control: http://localhost:8080 (Node.js webapp)
- rclone: Google Drive sync (remote: gdrive)
- Homebrew: Pakethanterare (VPS + Mac)

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

### Git/Obsidian Sync
- **Status:** SSH-nyckel väntar på att läggas till på GitHub
- **Mål:** Synka config-filer mellan VPS och Mattias Obsidian vault
- **Repo:** github.com/thyr-ai/Vayron (private)
- **Nästa steg:** Push till GitHub när SSH-nyckel är aktiverad

### One.com Kontrollpanel Access
- **Status:** Diskussion pågår, väntar på beslut
- **Mål:** Email-hantering, VPS-översikt, hemsideuppladdning
- **Säkerhet:** GUARDRAILS.md + SAFETY.md på plats
- **Nästa steg:** Få credentials när Mattias är redo

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
