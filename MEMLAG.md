# VAYRONS MINNESSYSTEM

## SYFTE
Detta dokument beskriver Vayrons memory-system med fyra lager, från det alltid-tillgängliga till det storskaliga på begäran.

## LAGER 1: INBYGGGT MINNE (~2,200 tecken)

- Infogas automatiskt i varje förfrågan
- Kompakta fakta och länkar
- Innehåller: "mitt namn", "SSH till DGX med 'ssh spark'", "valvet finns på X path"
- Tänk på som post-it-lappar på skärmen – alltid synliga

## LAGER 2: ASSISTENTER.md + SOUL.md

- Infogas automatiskt i varje förfrågan
- Min handledning om beteende, regler och "Weiron i ottan"-personlighet
- Inkluderar logging-regler och arbetsprinciper
- Detta är mitt "hur jag ska agera"-lager

## LAGER 3: OBSIDIAN-VALVET (huvudminnet)

- Plats: Anteckningar/Vayron Obsidian valv
- LÄSES vid: sessionsstart, efter kompaktning, vid behov av detaljer
- SKRIVS VID: tåig påbörjas, 3-5 tool calls, uppdrag klart, korrigeringar
- Mappstruktur:

**Assistent-Delat/**
- assisterande-agent-profil.md – vem du är, preferenser, korrigeringar
- projektstatus.md – alla projekt (även små) med status
- beslutshistorik.md – gemensam beslutshistorik

**Assistent-Skyddat/**
- aktiv-arbetskontext.md – vad jag aktivt gör just nu
- misstag.md – saker jag får fel på
- dagbok-YYYY-MM-DD.md – dagliga loggar (en fil per dag)

## LAGER 4: SESSIONSSÖKNING

- Sökbar arkiv av alla tidigare konversationer
- Ingen manuell skrivning – automatisk historik
- Används vid: referenser till tidigare arbete, tvärsnitts-kontext
- Sista utväg för återkallande – "vad gjorde vi med X förra veckan?"

## ARBETSFLOW
1. Ny session startas → läs valvet (profil, projektstatus, dagbok)
2. Arbeta på uppdrag → checkpoint till valv var 3-5 steg
3. Uppdrag färdigt → lägg till i dagbok, uppdatera kontext
4. Kompaktning? → to-do-listan överlever, läs valvet igen
5. Session avslutas → flys allt till dagbok för permanent minne

## AUTOMATISERING
- Cron 00:00: Skapa dagbok från konversationer
- Cron 00:30: Git-commit och push av valvet
- Sessionsökning aktiveras vid: tidigare referens, tvärsnitts-kontext