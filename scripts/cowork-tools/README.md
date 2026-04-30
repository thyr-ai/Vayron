# scripts/cowork-tools/

Verktyg som körs i Cowork (eller från terminal på din lokala maskin).

## check-agents.py

Lager 3 i watchdog-systemet. Läser `shared/monitoring/heartbeats.json` och visar:

- Hur länge sedan Vayron hörde av sig
- Hur länge sedan BabyVayron hörde av sig
- Senaste incidenter

### Användning

```bash
python3 scripts/cowork-tools/check-agents.py

# eller, för Cowork:
python3 scripts/cowork-tools/check-agents.py --json
```

### Exempel-output

```
==================================================
Agent-status, 2026-04-30 14:23:11
==================================================
hermes         ✅ OK         senaste: 12min sedan (2026-04-30T14:11:07)
babyvayron     🟡 LATE       senaste: 35min sedan (2026-04-30T13:48:22)

Senaste incidenter:
  - [2026-04-30T08:15:00] [peer] babyvayron upptäckte hermes död, ålder=8400s
```

### Cowork-flöde

I Cowork: säg "kolla agenterna" eller "/heartbeat", be Claude köra skriptet och tolka outputen. Om något är trasigt: be Claude öppna `shared/monitoring/watchdog.md` för full historik.

### Skapa en riktig Cowork-skill (sen)

När du är trött på att skriva "kolla agenterna" varje gång: paketera den här logiken som en skill i Cowork. Då blir det `/agents-check` istället. Inte byggt än, ligger som backlog.
