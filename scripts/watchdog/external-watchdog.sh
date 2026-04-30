#!/bin/bash
# external-watchdog.sh
# Lager 2: oberoende cron-watchdog. Behöver inte agenterna leva.
#
# Installera på VPS:
#   chmod +x external-watchdog.sh
#   crontab -e
#   */5 * * * * /home/administrator/watchdog/external-watchdog.sh >> /home/administrator/watchdog/watchdog.log 2>&1
#
# Kräver: jq, curl, en TELEGRAM_BOT_TOKEN och TELEGRAM_CHAT_ID i .env

set -euo pipefail

# Konfiguration
VAULT="${VAULT_PATH:-/home/administrator/Anteckningar}"
HEARTBEAT="$VAULT/shared/monitoring/heartbeats.json"
WATCHDOG_LOG="$VAULT/shared/monitoring/watchdog.md"
ENV_FILE="${ENV_FILE:-/home/administrator/watchdog/.env}"

# Tröskelvärden (sekunder)
THRESHOLD_SOFT=1800   # 30 min: mjuk Telegram-varning
THRESHOLD_HARD=21600  # 6h: mail-eskalering

# Ladda env (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, MAIL_RECIPIENT)
if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

# Sanity
if [ ! -f "$HEARTBEAT" ]; then
  echo "[$(date -Iseconds)] Heartbeat-fil saknas: $HEARTBEAT" >&2
  exit 1
fi

NOW=$(date +%s)

check_agent() {
  local agent=$1
  local ts
  ts=$(jq -r ".${agent}.ts // 0" "$HEARTBEAT")
  if [ "$ts" -eq 0 ]; then
    echo "[$(date -Iseconds)] $agent: aldrig startad"
    return
  fi
  local age=$((NOW - ts))
  if [ "$age" -gt "$THRESHOLD_HARD" ]; then
    notify_hard "$agent" "$age"
  elif [ "$age" -gt "$THRESHOLD_SOFT" ]; then
    notify_soft "$agent" "$age"
  fi
}

notify_soft() {
  local agent=$1 age=$2
  local minutes=$((age / 60))
  local msg="⚠️ Watchdog: $agent har inte hört av sig på $minutes min."
  if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_CHAT_ID}" \
      -d "text=$msg" > /dev/null
  fi
  log_incident "$agent" "soft" "$age"
}

notify_hard() {
  local agent=$1 age=$2
  local hours=$((age / 3600))
  local msg="🚨 Watchdog HARD: $agent död sedan $hours h. Försöker restart."
  if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_CHAT_ID}" \
      -d "text=$msg" > /dev/null
  fi
  # Försök restart via systemd
  systemctl --user restart "${agent}.service" 2>/dev/null || true
  # Mail om mailrecipient finns
  if [ -n "${MAIL_RECIPIENT:-}" ] && command -v mail >/dev/null 2>&1; then
    echo "$msg" | mail -s "[INCIDENT] $agent död" "$MAIL_RECIPIENT"
  fi
  log_incident "$agent" "hard" "$age"
}

log_incident() {
  local agent=$1 level=$2 age=$3
  printf '\n- [%s] [%s] %s ålder=%ss\n' \
    "$(date -Iseconds)" "$level" "$agent" "$age" >> "$WATCHDOG_LOG"
}

# Kör för båda agenterna
check_agent "hermes"
check_agent "babyvayron"

echo "[$(date -Iseconds)] watchdog ok"
