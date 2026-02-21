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

### X Bookmark Samlingsplats
- **Status:** Väntar på data export från X-konton
- **Mål:** Multi-kolumn viewer (TweetDeck-style) för sparade tweets
- **Nästa steg:** Bygga HTML/JS viewer när export-filerna kommer
- **Långsiktig plan:** Scraper + nyhetsbevakningsfunktion

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

---

_Denna fil uppdateras kontinuerligt med viktiga insikter och lärdomar._
