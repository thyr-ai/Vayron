# Watchdog-logg

_Cross-agent incidentlogg och mail-spår._

Lager 1 (peer): Vayron och BabyVayron skriver hit när de upptäcker att den andra är död eller ostädad.
Lager 2 (extern cron): VPS-skriptet skriver hit när det måste väcka någon eller pinga Mattias.
Lager 3 (Cowork): Cowork-skill kan läsa hit för att visa status i dashboard.

## Incidenter

<!-- Format: - [TIMESTAMP] [AGENT] kort beskrivning. Detalj. -->

## Mail-logg

<!-- Vayron loggar varje skickat mail här -->
<!-- Format: - [DATUM] [TILL] [ÄMNE] (anledning) -->

## Restart-logg

<!-- När en agent har restartats -->
<!-- Format: - [DATUM] [VEM RESTARTADES] [AV VEM] (anledning) -->

## Status idag

_Uppdateras manuellt eller av Cowork-skillen `/heartbeat`._

- Vayron: ej startad än
- BabyVayron: ej startad än
- Senaste mail från Vayron: ingen
- Senaste incident: ingen
