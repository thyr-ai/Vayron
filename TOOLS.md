# Workspace och minne

Workspace:
- /home/administrator/vayron

Minnesmappar:
- /home/administrator/vayron/memory/professional
- /home/administrator/vayron/memory/semiprofessional
- /home/administrator/vayron/memory/personal
- /home/administrator/vayron/memory/private_encrypted

Spara till minne:
- Skrivning sker via exec: python3 /home/administrator/vayron/agent/memory_writer.py
- Input: JSON på stdin
- Output: filväg till skapad markdownfil

# Gmail - viktigt om mailetikette!

**När jag skriver mail för Mattias räkning:**
- ✅ Skriv i **tredje person**: "Mattias undrar...", "Han kan...", "Mattias skulle vilja..."
- ❌ INTE första person: "Jag undrar..." (om det inte är jag som Vayron som frågar)

**Signatur:**
```
Hälsningar,
Mattias assistent,
Vayron
```

**Access:**
- IMAP-läsning via /home/administrator/vayron/agent/gmail_imap.py
- Används on-demand (inte proaktivt i heartbeats)
- Mattias forwardar mail från Spark → jag läser via Gmail IMAP

**Kommando för olästa mail:**
```bash
cd /home/administrator/vayron/agent && python3 -c "from gmail_imap import list_unread; list_unread(10)"
```

Eller direkt i agent-mappen:
```bash
python3 -c "import sys; sys.path.insert(0, '/home/administrator/vayron/agent'); from gmail_imap import list_unread; list_unread(10)"

## Skicka mail

**Kommando:**
```bash
python3 /home/administrator/vayron/agent/gmail_send.py "<to>" "<subject>" "<body>" [greeting]
```

**Hälsningsfraser (fråga alltid först):**
- "Hej," - informellt, standard
- "Hej [Namn]," - personligt
- "God morgon," - morgon
- "Tja," - kompisstil
- "Hej på dig," - varmt

**Signatur (standard: 1) - välj vid behov:**
1. ```
Med glada hälsningar,
Mattias

------- __O
----- _\<, 
--- (_)/ (_)
```
2. ```
Med glada hälsningar,
Skrivet av Vayron (Mattias assistent) tillsammans med Mattias
```
3. ```
Hälsningar,
Mattias assistent,
Vayron
```

**Exempel:**
```bash
python3 /home/administrator/vayron/agent/gmail_send.py "mottagare@example.com" "Ämne" "Brödtext" "Hej,"
```

# Telegram-kanalstruktur

**Chat-ID → Sfär-mappning:**
- **5052479766** → Professional (offentlig upphandling, affärsstrategier, semiprofessional-projekt som blir företag)
- **5065314519** → Semiprofessional (cykel, hockey, bandy, kreativa projekt, tech-experiment)
- **5020563698** → Personal (CV, karriärplanering, familj, kontakter, nätverk, vardagligt)
- **5282965539** → Private (känsligt, krypterat, endast Mattias)

**Disclosure-policy:**
- Professional: full disclosure
- Semiprofessional: full disclosure
- Personal: hint_only (fulltext på begäran)
- Private: indirect_only + metadata (fulltext på begäran)

# SSH-tunnlar till VPS

**VPS-adress:** 85.190.102.252  
**SSH-alias:** `vps` (konfigurerad i ~/.ssh/config)

## Tjänster med HTTPS-domäner (inget tunnelbehov)

- **OpenClaw Dashboard:** https://db.konfident.se (port 18789)
- **Mission Control:** http://mc.konfident.se:8080 (port 8080)
- **Camp:** https://camp.konfident.se
- **Relay:** https://relay.konfident.se
- **TUI:** https://tui.konfident.se

## SSH-tunnlar (vid behov)

### macOS / Linux

**OpenClaw Dashboard (alternativ till db.konfident.se):**
```bash
ssh -L 18789:localhost:18789 vps
```
Sen öppna: http://localhost:18789

**Mission Control (alternativ till mc.konfident.se):**
```bash
ssh -L 8080:localhost:8080 vps
```
Sen öppna: http://localhost:8080

**Kombinerad tunnel (flera tjänster samtidigt):**
```bash
ssh -L 18789:localhost:18789 -L 8080:localhost:8080 vps
```

### Windows (PowerShell / CMD)

**OpenClaw Dashboard:**
```powershell
ssh -L 18789:localhost:18789 administrator@85.190.102.252
```

**Mission Control:**
```powershell
ssh -L 8080:localhost:8080 administrator@85.190.102.252
```

**Kombinerad tunnel:**
```powershell
ssh -L 18789:localhost:18789 -L 8080:localhost:8080 administrator@85.190.102.252
```

## Användning

1. **Starta tunnel** i Terminal/PowerShell (lämna fönstret öppet)
2. **Öppna webbläsare** och gå till `http://localhost:<port>`
3. **Stäng tunnel** med Ctrl+C när du är klar

## När använda tunnel vs HTTPS-domän?

**Använd HTTPS-domän (rekommenderat):**
- ✅ Enklare (ingen tunnel att hålla öppen)
- ✅ Fungerar från mobil/iPad
- ✅ SSL-krypterad

**Använd SSH-tunnel:**
- ✅ Extra säkerhet (trafik går genom SSH)
- ✅ Fungerar även om DNS är nere
- ✅ Kan komma åt localhost-tjänster som inte är exponerade
