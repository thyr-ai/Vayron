# NEXT_STEPS.md — Vad du behöver göra för att aktivera systemet

_Skapat: 2026-04-30. Filerna är på plats. Det här är vad som krävs för att Vayron och BabyVayron faktiskt ska börja andas._

## 1. VPS-status (kolla att den lever)

```bash
# Från din lokala maskin
ssh administrator@85.190.102.252 "uptime && df -h /"
```

Om VPS:en svarar: bra. Om inte: kontakta one.com support eller kolla cloud-server-10381902 i deras kontrollpanel.

## 2. Pulla nya vault-strukturen till VPS:en

```bash
ssh administrator@85.190.102.252
cd ~/Anteckningar
git pull
ls shared/ agents/ scripts/  # bekräfta att allt synkat
```

## 3. Sätt upp Vayron-tjänsten

På VPS:en:

```bash
mkdir -p ~/hermes
cd ~/hermes

# Kopiera in run.sh, .env-mall, etc. (skapa enligt dina nuvarande Vayron-skript)
# Eller ännu enklare: starta från en kopia av Vayron-koden och döp om

# Lägg till heartbeat-call i Vayron loop
# Vayron ska vid varje "tick" köra:
python3 ~/Anteckningar/scripts/watchdog/heartbeat-write.py hermes
```

`.env` för Vayron ska ha:

```
ANTHROPIC_API_KEY=...
GMAIL_USER=mattiasthyr@gmail.com
GMAIL_APP_PASSWORD=...           # generera i Google Account → Security → App passwords
TELEGRAM_BOT_TOKEN=...
VAULT_PATH=/home/administrator/Anteckningar
```

## 4. Sätt upp BabyVayron-tjänsten

```bash
mkdir -p ~/babyvayron

# tick.sh
cat > ~/babyvayron/tick.sh <<'EOF'
#!/bin/bash
set -e
python3 /home/administrator/Anteckningar/scripts/watchdog/heartbeat-write.py babyvayron

# Plats för dagens scrape-uppgift, t.ex.
# /home/administrator/babyvayron/scrape-domains.sh
EOF
chmod +x ~/babyvayron/tick.sh
```

## 5. Aktivera systemd timers

Följ `scripts/watchdog/setup-systemd.md`. Kortversion:

```bash
# Skapa unit-filerna enligt setup-systemd.md
mkdir -p ~/.config/systemd/user
# (klistra in hermes.service, babyvayron.service, babyvayron.timer)

systemctl --user daemon-reload
systemctl --user enable --now hermes.service
systemctl --user enable --now babyvayron.timer

sudo loginctl enable-linger administrator   # så det körs efter logout
```

## 6. Sätt upp extern watchdog (Lager 2)

```bash
mkdir -p ~/watchdog
cp ~/Anteckningar/scripts/watchdog/external-watchdog.sh ~/watchdog/

cat > ~/watchdog/.env <<EOF
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=5052479766    # Professional-kanalen
MAIL_RECIPIENT=mattiasthyr@gmail.com
VAULT_PATH=/home/administrator/Anteckningar
EOF
chmod 600 ~/watchdog/.env
chmod +x ~/watchdog/external-watchdog.sh

crontab -e
# Lägg till:
*/5 * * * * /home/administrator/watchdog/external-watchdog.sh >> /home/administrator/watchdog/log 2>&1
```

## 7. Testa Lager 3 (Cowork) på din lokala maskin

```bash
# Mac mini eller Windows-dator
cd ~/Obsidian/Anteckningar    # eller motsvarande
git pull
python3 scripts/cowork-tools/check-agents.py
```

Du borde se båda agenterna som "NEVER" tills de skrivit första heartbeat. Efter 15-30 min ska BabyVayron vara "OK" och Vayron "OK" om tjänsten kör.

## 8. Bekräfta watchdog-flödet med simulerad död

Trick-test:

```bash
# På VPS:en
python3 -c "
import json, time
p = '/home/administrator/Anteckningar/shared/monitoring/heartbeats.json'
data = json.load(open(p))
data['hermes']['ts'] = int(time.time()) - 10800  # 3h gammal
json.dump(data, open(p, 'w'), indent=2)
"

# Vänta 5 min, kolla telegram + mail
# Återställ:
python3 -c "
import json, time
p = '/home/administrator/Anteckningar/shared/monitoring/heartbeats.json'
data = json.load(open(p))
data['hermes']['ts'] = int(time.time())
json.dump(data, open(p, 'w'), indent=2)
"
```

## 9. Telegram-bot för BabyVayron (när du är redo)

Just nu är BabyVayron stum. När du vill att han ska kunna posta själv:

1. Skapa ny Telegram-bot via BotFather, döp till BabyVayron eller liknande
2. Lägg till bot-token i `~/babyvayron/.env`
3. Uppdatera `shared/GUARDRAILS.md` och `agents/babyvayron/SOUL.md`: `❌ Posta på Telegram` → `✅ Posta på Telegram (Telegram-bot konfigurerad 2026-XX-XX)`
4. Bestäm vilka kanaler han får posta i (förslag: bara Professional, för watchdog-meddelanden)

## 10. Drive-konto

Cowork-MCP:en pekar på `mattias@konfident.se`. Vayron ska peka på `mattiasthyr@gmail.com`. För Vayron:

- Generera Google Workspace OAuth eller Service Account för `mattiasthyr@gmail.com`
- Spara i `~/hermes/.env` som `GOOGLE_DRIVE_TOKEN_PATH=...`
- Vayron använder denna för Drive-anrop

Cowork rör inte detta. Om Mattias senare vill att Cowork ska se `mattiasthyr@gmail.com`-Drive: byta connector i Cowork-inställningarna.

## Klart

När de fyra första stegen rullar och Lager 2 har pingat dig en gång (testat med simulerad död): du har två agenter, en watchdog-triangel och en arbetsbänk. Det är där jag kör vidare nästa session.
