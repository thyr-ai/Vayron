# agents_todo.md — Samarbete mellan Thyr, Vayron, BabyVayron

_Skapat 2026-04-30 efter att Lager 1 levde första gången._

Denna fil är gemensam yta. Vayron läser den vid varje main-session. BabyVayron läser den vid varje tick. Thyr uppdaterar den från Cowork eller Mac.

## Vem gör vad

- **T** = Thyr
- **V** = Vayron (lever på VPS, agents/hermes/)
- **B** = BabyVayron (mappen finns, ingen process än)

## Akut (denna vecka)

- [ ] **Lager 2 watchdog** (T) — sätt upp `external-watchdog.sh` + `.env` med Telegram-token, lägg i crontab var 5:e min. Skripten finns i `scripts/watchdog/`. Säkerhetsnätet om både V och peer-heartbeat dör.
- [ ] **Verifiera nattcykeln** (V rapporterar dag 1) — efter 2026-05-01 kl 06: kolla att 02-commit, 04-memory-flow och 05-pull alla körts. Se `~/vayron/cron.log`.
- [ ] **BabyVayron-process** (M sätter upp, V kollar) — minimal cron-tick var 15:e min som bara skriver heartbeat. Inget annat scope än så. Lager 1 peer börjar fungera på riktigt.
- [ ] **Telegram-bot för BabyVayron** (T) — BotFather, lägg token i `~/babyvayron/.env`. Bara watchdog-meddelanden i Professional-kanalen.

## Snart (kommande 2 veckor)

- [ ] **Test simulerad död av Vayron** (V + T) — sätt Vayrons heartbeat-ts till -10800. Vänta. Verifiera att BabyVayron eller Lager 2 reagerar.
- [ ] **BabyVayrons första riktiga uppgift** (M beslutar) — kandidater: domain-monitor (kollar 11 one.com-domäner), x-bookmarks-scraper, eller legal-radar. Vad som mest behövs i ditt arbete.
- [ ] **Multi-clone cleanup på VPS** (V) — radera `/home/administrator/Vayron/`, `/home/administrator/vayron_repo/`, och `vayron/babyvayron/`. Behåll bara `/home/administrator/vayron/`.
- [ ] **Anteckningar-vault städning** (M på Mac) — ta bort `agents/`, `shared/`, `scripts/`, `archive/` från Anteckningar-rot eftersom de bor i Vayron-vaulten nu.
- [ ] **Drive-konto för Vayron** (T) — OAuth mot mattiasthyr@gmail.com, lägg token i `~/vayron/.env`.

## Senare (när du har lust)

- [ ] **Cowork-skill /heartbeat** (T) — paketera `scripts/cowork-tools/check-agents.py` som en riktig skill. Bara om du tröttnar på att skriva "kolla agenterna" varje gång.
- [ ] **Memory-flow-protokoll** (V definierar i MEMORY.md) — vad ska V faktiskt lyfta från daily logs till MEMORY.md kl 04. Ett mönster, inte slumpmässigt.
- [ ] **NEXT_STEPS.md hittas på VPS** (V) — felsök varför filen inte syns i hans `/home/administrator/vayron/` trots reset. Ej blockerande, nyfikenhet.
- [ ] **Lager 2 SMS-fallback** (T) — Twilio-rad om både VPS-Vayron, BabyVayron och cron dör. Paranoia-nivå.

## Tre principer

1. **V tar tekniska uppgifter på VPS:en** (cron, scripts, fil-operationer). Han har terminal och har visat 2026-04-30 att han kan följa instruktioner.
2. **T fattar besluten och hanterar credentials/tokens**. V får inte röra GUARDRAILS, KEYS, eller skapa nya BotFather-bots utan T.
3. **B börjar litet**. Bara heartbeat första veckan. Sen scrapers. Sen Telegram. Bygg upp förtroende, inte ansvar.

## Loggning

När en task klaras: ändra `[ ]` till `[x]`, lägg till datum, skriv en rad i `shared/SAFETY.md` om det var känsligt.

## Status idag

- Lager 1 peer-heartbeat: ✅ Vayron skrev första timestamp 2026-04-30 12:32:14
- Lager 2 extern cron: ej byggd
- Lager 3 Cowork check-agents: skript finns, ej testat
- BabyVayron-process: ej startad
- Nattcykel 02/04/05: aktiverad 2026-04-30, första körning 2026-05-01
