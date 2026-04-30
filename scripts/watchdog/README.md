# scripts/watchdog/

Skript som driver Lager 1 (peer heartbeat) och Lager 2 (extern cron) i watchdog-systemet.

## Filer

- `heartbeat-write.py` — körs av Vayron och BabyVayron själva. Skriver timestamp + peer-check + ev. restart.
- `external-watchdog.sh` — Lager 2. Oberoende cron på VPS. Skickar Telegram + mail om någon agent är död.
- `setup-systemd.md` — installations-guide för systemd timers + service-units.

## Snabbstart (på VPS:en)

```bash
# Kopiera skripten till VPS:en
scp -r scripts/watchdog/ vps:/home/administrator/

# På VPS:en
chmod +x /home/administrator/watchdog/external-watchdog.sh
chmod +x /home/administrator/watchdog/heartbeat-write.py

# Skapa .env med credentials
cat > /home/administrator/watchdog/.env <<EOF
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=5052479766
MAIL_RECIPIENT=mattiasthyr@gmail.com
VAULT_PATH=/home/administrator/Anteckningar
EOF
chmod 600 /home/administrator/watchdog/.env

# Lägg in i crontab
crontab -e
# Lägg till:
*/5 * * * * /home/administrator/watchdog/external-watchdog.sh >> /home/administrator/watchdog/watchdog.log 2>&1
```

## Hur agenterna använder heartbeat-write.py

**Vayron** kör i sin session-loop:

```python
import subprocess
subprocess.run(["python3", "/home/administrator/watchdog/heartbeat-write.py", "hermes"])
```

**BabyVayron** kör som cron:

```cron
*/15 * * * * /usr/bin/python3 /home/administrator/watchdog/heartbeat-write.py babyvayron
```

## Test innan deploy

```bash
# Simulera att Vayron inte hörts på 3h
python3 -c "
import json, time
p = '/home/administrator/Anteckningar/shared/monitoring/heartbeats.json'
data = json.load(open(p))
data['hermes']['ts'] = int(time.time()) - 10800
json.dump(data, open(p, 'w'), indent=2)
"

# Kör external-watchdog manuellt
./external-watchdog.sh

# Kolla att incidenten skrevs till watchdog.md
tail -5 /home/administrator/Anteckningar/shared/monitoring/watchdog.md
```

## Failure-modes

- **VPS:en själv är nere**: ingen av lagren räddar. Backup-plan: en daglig SMS via Twilio från extern tjänst (inte byggd än, fyll på vid behov).
- **heartbeats.json korrupt**: heartbeat-write.py återskapar struktur. external-watchdog.sh exitar med error i logfil.
- **Telegram bot blockerad**: external-watchdog faller tillbaka på mail.
