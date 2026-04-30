# shared/monitoring/ — Watchdog-system

Tre lager redundans så att ingen agent dör tyst.

## Filer

- `heartbeats.json` — varje agent skriver sin senaste timestamp hit
- `watchdog.md` — incidenter, mail-logg, restart-logg
- `README.md` — det här dokumentet

## Lager 1: Peer heartbeat (inbyggt i agenterna)

Vayron och BabyVayron skriver var sitt fält i `heartbeats.json` varje gång de tickar. Innan de börjar sin egen body läser de den andras timestamp. Stale > 2h:

- Vayron notifierar Mattias på Telegram (Professional-kanalen)
- BabyVayron försöker restart Vayron via systemctl + skriver incident

**Risk:** Om båda dör samtidigt fångar Lager 1 ingenting. Därför Lager 2.

## Lager 2: Extern cron-watchdog (oberoende av agenterna)

Ett skalskript på VPS:en kör var 5:e minut via systemd timer. Beroende endast på filsystemet, inte på agenter.

Plats: `/home/administrator/watchdog/external-watchdog.sh`
Schema: `*/5 * * * * /home/administrator/watchdog/external-watchdog.sh`

Logik:
1. Läs `heartbeats.json`
2. Beräkna ålder för varje agent
3. Om någon är > 30 min gammal: skicka Telegram via curl till Mattias
4. Logga till `watchdog.md`

Skript-mall finns i `scripts/watchdog/external-watchdog.sh` i vault-roten.

## Lager 3: Cowork-skill /heartbeat

När Mattias startar Cowork på en av sina datorer kan han kalla skillen `/heartbeat` (eller liknande). Den läser `heartbeats.json` och visar:

- Hur länge sedan Vayron hörde av sig
- Hur länge sedan BabyVayron hörde av sig
- Senaste incident
- Senaste mail från Vayron

Skillen skapas i Cowork. Den behöver bara läsa filer (vaulten är synkad till båda hans maskiner via git).

## Heartbeat-format

```json
{
  "hermes": {
    "ts": 1714478400,
    "iso": "2026-04-30T12:00:00",
    "host": "vps-cloud-server-10381902",
    "version": "1.0"
  },
  "babyvayron": {
    "ts": 1714478100,
    "iso": "2026-04-30T11:55:00",
    "host": "vps-cloud-server-10381902",
    "version": "1.0"
  }
}
```

## Eskaleringströsklar

| Ålder | Aktion |
|-------|--------|
| 0-30 min | OK, ingen åtgärd |
| 30 min-2h | Lager 2 cron skickar mjuk Telegram-varning |
| 2h-6h | Lager 1 peer + Lager 2 cron eskalerar, försök auto-restart |
| 6h+ | Lager 2 cron mailar till mattiasthyr@gmail.com |

## Nödläge: båda agenter döda + cron-skript stannat

Backup-plan: en daglig SMS via Twilio från extern tjänst. Inte byggd än. Lägg till om paranoid.
