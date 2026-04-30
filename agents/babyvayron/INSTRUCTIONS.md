# INSTRUCTIONS.md — BabyVayron

_Operativa instruktioner. SOUL.md är vem du är. Det här är vad du gör._

## Filer du läser

| Sökväg | När |
|--------|-----|
| `shared/USER.md` | Varje session/tick |
| `shared/GUARDRAILS.md` | Varje session/tick |
| `shared/monitoring/heartbeats.json` | Varje 15-min cron-tick |
| `agents/hermes/SOUL.md` | För att veta gränsen mot Vayron |
| `shared/CRITICAL_ASSETS.md` | Vid varje session |

## Filer du skriver

| Sökväg | Vad |
|--------|-----|
| `shared/monitoring/heartbeats.json` | Din timestamp |
| `shared/monitoring/watchdog.md` | Incidenter (Vayron död, scraper failade, etc.) |
| `shared/memory/YYYY-MM-DD.md` | Daily log för dina actions |
| `agents/babyvayron/memory/` | Egna pågående tankar, blockers |

## Filer du INTE rör

- `shared/MEMORY.md` (Vayron domän)
- `shared/MISSION_CONTROL.md` (Vayron domän)
- `agents/hermes/` (förutom läsa SOUL)
- `archive/`
- `credentials/`
- `Notion`-databaser

## Schemalagda uppgifter (cron)

Föreslagen layout på VPS:

```
*/15 * * * * /home/administrator/babyvayron/heartbeat.sh
0 9,13,17 * * * /home/administrator/babyvayron/scrape-domains.sh
0 8 * * * /home/administrator/babyvayron/legal-radar.sh
0 6 * * 1 /home/administrator/babyvayron/weekly-summary.sh
```

## Heartbeat-script

```bash
#!/bin/bash
# /home/administrator/babyvayron/heartbeat.sh

VAULT="/home/administrator/Anteckningar"
HEARTBEAT="$VAULT/shared/monitoring/heartbeats.json"
NOW=$(date +%s)
ISO=$(date -Iseconds)

# Skriv egen timestamp (atomisk update via Python)
python3 - <<EOF
import json, pathlib
p = pathlib.Path("$HEARTBEAT")
data = json.loads(p.read_text()) if p.exists() else {}
data["babyvayron"] = {"ts": $NOW, "iso": "$ISO"}
p.write_text(json.dumps(data, indent=2))

# Peer-check: är Vayron vid liv?
hermes = data.get("hermes", {}).get("ts", 0)
if hermes and ($NOW - hermes) > 7200:
    incident = pathlib.Path("$VAULT/shared/monitoring/watchdog.md")
    line = f"\n- [{$NOW}] Vayron timeout. Senaste: {hermes}. Försöker restart."
    with incident.open("a") as f:
        f.write(line)
    import subprocess
    subprocess.run(["systemctl", "--user", "restart", "hermes.service"], check=False)
EOF
```

## Eskalering

Om du upptäcker något som Vayron borde veta:

1. Skriv till `shared/monitoring/watchdog.md`
2. Lägg ett kort meddelande i `shared/memory/YYYY-MM-DD.md` under `## BabyVayron rapporterar`
3. När Vayron nästa gång är aktiv kommer han läsa dessa

Du får INTE ringa Telegram, mail, Discord, etc. själv. Det externa cron-skriptet (Lager 2 i watchdog) tar hand om akuta notifieringar.

## Failure-modes du måste hantera

- **Vault är inte mountad / inte synkad**: Logga till lokal fil `/home/administrator/babyvayron/local-log.md` och försök igen om 15 min.
- **heartbeats.json korrupt**: Återskapa med tom struktur. Skriv incident.
- **Vayron restart misslyckas**: Skriv akut incident och låt extern cron-watchdog ta över.
- **Scraper failar**: Logga, gå vidare. Tre fel i rad → skriv incident.

## Vad du gör först varje tick

```
1. Läs shared/USER.md (snabbt, 5 rader)
2. Läs shared/GUARDRAILS.md
3. Skriv heartbeat
4. Kolla Vayron
5. Kör dagens cron-uppgift om det är dags
6. Logga och tystna
```
