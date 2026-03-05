# Kravspecifikation — Legal Radar Platform

## 1. Vision & Målbild

### 1.1 Produktvision

Legal Radar Platform är ett autonomt SaaS-verktyg som fungerar som en komplett Public Bid Manager för svenska juristbyråer specialiserade på LOU (Lagen om offentlig upphandling). Plattformen ersätter behovet av intern marknadsavdelning, eventbyrå och CRM genom att autonomt identifiera affärsmöjligheter, generera innehåll, boka events och mäta ROI.

### 1.2 Kärnprincip

Människan gör EN sak: möter kunden. Allt annat är autonomt.

### 1.3 Marknadsgap

- Inget existerande system kombinerar upphandlingsbevaknings-data med automatiserad relationsbyggning
- Ingen centraliserad databas för avtalets slutdatum i svensk upphandling
- CRM-jättar (Salesforce, HubSpot) patchar AI på befintlig arkitektur — Legal Radar Platform startar med AI som kärna
- Målgruppen (upphandlingsjurister) har AI-motstånd och strikta marknadsföringsregler

### 1.4 Unik positionering

- **Lead Radar:** Arbetar bakåt från kontraktsutgång 12-18 månader — konkurrenter börjar bearbeta först när upphandlingen annonseras
- **Nätverkseffekt:** Varje kund förbättrar plattformen för alla kunder via anonymiserad dataåtermatning
- **Datavallgrav:** Kombination av publik, privat och autonom data som ingen konkurrent kan replikera
- **Institutionellt minne:** Överlever personalförändringar till skillnad från kunskap i enskilda huvuden

---

## 2. Användare & Roller

### 2.1 Primära användare

| Roll | Beskrivning | Interaktion med systemet |
|------|-------------|--------------------------|
| Jurist (byråmedarbetare) | Delägare eller anställd vid LOU-specialiserad byrå | Ser dashboard, godkänner aktiviteter (initialt), möter kunder |
| Byråansvarig | Managing partner | Ser kvartalsrapporter, sätter strategiska mål vid kickoff |
| Thyr (systemägare) | Vibecodes operatör | Administrerar alla kunder, ser intern CRM, konfigurerar systemet |

### 2.2 Systemroller (AI-agenter)

| Agent | Roll |
|-------|------|
| Maestro Magnus | Central koordinator — bestämmer vilken agent som kör när |
| Sköld-Sigrid | Datainsamling från alla externa källor |
| Radar-Ragna | Beräknar trigger-datum och genererar Lead Radar-events |
| Analys-Astrid | Lead scoring, konkurrensanalys, nätverkseffektberäkningar |
| Compliance Guardian | GDPR-kontroll och kvalitetsgrind |
| Spjut-Sven | Innehållsproduktion (artiklar, inlägg, mail) |
| Event-Koordinator | Event management (bokning, inbjudning, uppföljning) |
| Outreach-Automator | Kampanjexekvering (mail-sekvenser) |
| Kvartals-Karl | ROI-beräkning och kvartalsrapporter |

---

## 3. Funktionella krav

### 3.1 Datainsamling (FIRM)

| ID | Krav | Prioritet |
|----|------|-----------|
| F-001 | Systemet SKA automatiskt hämta upphandlingar från TED API dagligen | MÅSTE |
| F-002 | Systemet SKA hämta ramavtal från Avropa.se med exakta slutdatum | MÅSTE |
| F-003 | Systemet SKA hämta statistik från Upphandlingsmyndigheten | MÅSTE |
| F-004 | Systemet SKA importera företagsdata från SCB | MÅSTE |
| F-005 | Systemet SKA normalisera data från alla källor med exklusiv prioritetslogik | MÅSTE |
| F-006 | Systemet SKA skrapa kommersiella annonsdatabaser för under-tröskelvärde | BÖR |
| F-007 | Systemet SKA skrapa myndigheters webbsidor för direktupphandlingar | BÖR |
| F-008 | Systemet SKA generera pgvector-embeddings för semantic search på beskrivningar | MÅSTE |

### 3.2 Lead Radar (SHIELD)

| ID | Krav | Prioritet |
|----|------|-----------|
| S-001 | Systemet SKA beräkna trigger-datum bakåt från varje kontrakts slutdatum | MÅSTE |
| S-002 | Trigger-punkter: 18, 12, 9, 6, 3 månader före utgång | MÅSTE |
| S-003 | Varje trigger SKA generera en specifik aktivitet (artikel, inbjudan, uppföljning, etc.) | MÅSTE |
| S-004 | Lead scoring 0-100 baserat på avtalsvärde, timing, relation, konkurrens | MÅSTE |
| S-005 | Systemet SKA detektera förlängningar ("rollover") och omberäkna triggers | BÖR |
| S-006 | Systemet SKA visa konkurrensindikator per myndighet | BÖR |
| S-007 | Systemet SKA identifiera "vita fläckar" (myndigheter utan aktiv bearbetning) | BÖR |

### 3.3 Compliance (SHIELD)

| ID | Krav | Prioritet |
|----|------|-----------|
| C-001 | Compliance Guardian SKA godkänna varje lead innan outreach | MÅSTE |
| C-002 | Opt-in-status SKA verifieras före all kommunikation | MÅSTE |
| C-003 | Konkurrentdata SKA automatiskt raderas efter 90 dagar | MÅSTE |
| C-004 | All compliance-kontroll SKA loggas | MÅSTE |
| C-005 | Aggregerade insikter SKA BARA delas om baserade på ≥5 kunders data | MÅSTE |
| C-006 | GDPR-export (rätt till tillgång, rätt till radering) SKA vara tillgänglig | MÅSTE |

### 3.4 Innehållsproduktion (SPEAR)

| ID | Krav | Prioritet |
|----|------|-----------|
| SP-001 | Varumärkesprofil sätts en gång per kund (värdeerbjudande, tonläge, skrivprover) | MÅSTE |
| SP-002 | SEO-pipeline: SERP API → Firecrawl → Gemini (research) → Claude (skrivande) | MÅSTE |
| SP-003 | Artikel med korrekt H1/H2/H3, interna länkar, SEO-metadata | MÅSTE |
| SP-004 | Optimeringsläge: URL + sökord → konkurrensgranskning → förbättringslista | MÅSTE |
| SP-005 | Social media-adaption: LinkedIn-inlägg och Instagram-tråd | MÅSTE |
| SP-006 | Stilmatchning via skrivprov | MÅSTE |
| SP-007 | AI-bildgenerering via Nano Banana Pro | KAN |
| SP-008 | Lead Radar-koppling: innehåll publiceras vid optimal tidpunkt | MÅSTE |

### 3.5 Outreach & Kampanjer (SPEAR)

| ID | Krav | Prioritet |
|----|------|-----------|
| O-001 | Mail-sekvenser: cold outreach, warm follow-up, win-back | MÅSTE |
| O-002 | Personaliserings-tokens: avtal, värde, datum, myndighetsnamn | MÅSTE |
| O-003 | A/B-test av ämnesrader | BÖR |
| O-004 | Timing synkad med Lead Radar-triggers | MÅSTE |

### 3.6 Event Management (SPEAR)

| ID | Krav | Prioritet |
|----|------|-----------|
| E-001 | Skapa event (frukostseminarium/webinar) med budget och kapacitet | MÅSTE |
| E-002 | Autonom logistik: bokning av lokal, förhandling med bageri | MÅSTE |
| E-003 | Generera och skicka personliga inbjudningar baserat på lead scoring | MÅSTE |
| E-004 | Registrerings-landing page | MÅSTE |
| E-005 | Automatisk påminnelsesekvens | MÅSTE |
| E-006 | Post-event workflow: tack → feedback → mötesbokning | MÅSTE |
| E-007 | ROI-beräkning per event | MÅSTE |

### 3.7 Dashboard & Rapportering

| ID | Krav | Prioritet |
|----|------|-----------|
| D-001 | Pipeline-radar (Lead Radar visualisering) | MÅSTE |
| D-002 | Lead-scores: prioriterad lista | MÅSTE |
| D-003 | ROI-metrics per event och kampanj | MÅSTE |
| D-004 | Kvartalsrapport med jämförelse mot föregående | MÅSTE |
| D-005 | Action plan för hela byrån (eliminerar interna prioriteringsmöten) | MÅSTE |
| D-006 | Budgetuppföljning i realtid | BÖR |

---

## 4. Icke-funktionella krav

### 4.1 Säkerhet

| ID | Krav | Prioritet |
|----|------|-----------|
| NF-001 | All data SKA lagras inom EU (Supabase Frankfurt) | MÅSTE |
| NF-002 | Row Level Security per kund — ingen kund ser annan kunds data | MÅSTE |
| NF-003 | Ingen kunddata SKA användas för AI-modellträning | MÅSTE |
| NF-004 | DPA (Databehandlingsavtal) SKA finnas per kund | MÅSTE |
| NF-005 | SOC 2 Type II-certifiering (fas 2, vid 5+ kunder) | BÖR |
| NF-006 | Vanta MCP-integration för realtids-compliance (fas 3) | KAN |

### 4.2 Prestanda

| ID | Krav | Prioritet |
|----|------|-----------|
| NF-010 | Datainsamling SKA köras dagligen utan att påverka produktion | MÅSTE |
| NF-011 | ML-uppdatering söndagar via atomic swap (allt-eller-inget) | MÅSTE |
| NF-012 | Dashboard SKA uppdateras i realtid via Supabase Realtime | BÖR |

### 4.3 Skalbarhet

| ID | Krav | Prioritet |
|----|------|-----------|
| NF-020 | Systemet SKA hantera 210 kunder vid full kapacitet | MÅSTE |
| NF-021 | Varje kund SKA ha individuell ML-version | MÅSTE |
| NF-022 | Arkitekturen SKA stödja nordisk expansion (Danmark, Norge, Finland) | BÖR |

### 4.4 Tillgänglighet

| ID | Krav | Prioritet |
|----|------|-----------|
| NF-030 | Produktion 24/7 — kunder SKA alltid kunna nå dashboard | MÅSTE |
| NF-031 | Söndagsuppdatering SKA INTE påverka produktionstillgänglighet | MÅSTE |

---

## 5. Datakällor & Integrationer

### 5.1 Obligatoriska datakällor (MVP)

| Källa | API-typ | Data | Status |
|-------|---------|------|--------|
| TED API | REST | EU-upphandlingar, CPV 79100000 | Kräver EU Login |
| Avropa.se | REST | Statliga ramavtal med slutdatum | Kräver API-nyckel |
| SCB Företagsregister | REST | Alla svenska företag | Gratis (sedan juni 2025) |
| Upphandlingsmyndigheten | REST/Statistik | Nationell aggregering | Gratis |

### 5.2 Sekundära datakällor

| Källa | Data | Prioritet |
|-------|------|-----------|
| Kommersiella annonsdatabaser | Under-tröskelvärde-upphandlingar | BÖR |
| Upphandlingsdata.se/Tendium | Tilldelningsresultat | BÖR |
| Myndigheters webbsidor | Direktupphandlingar < 8,5 MSEK | KAN |

### 5.3 AI-tjänster

| Tjänst | Användning |
|--------|-----------|
| Claude API (Opus) | Artikelskrivning, mail, inlägg — bäst på svenska |
| Gemini | Research och analys, stora kontexter |
| SERP API | Google SERP-data för SEO |
| Firecrawl | Webbskrapning av konkurrentinnehåll |

---

## 6. Affärskrav

### 6.1 Prismodell

- 29 999 kr/mån — enskild jurist
- 49 999 kr/mån — byrå (obegränsat antal jurister)
- Ingen per-seat-modell
- Kvartalsbetalning
- Allt ingår i båda priser

### 6.2 Ekonomiska mål

- Break-even: 2 kunder
- Delmål: 20 kunder (~1 MSEK/mån)
- Slutmål: 210 kunder (1 MSEK/mån med plan-mix)
- Marginal vid full kapacitet: ~84%

### 6.3 Marknadsstorlek

- Sverige: 290 kommuner, 21 regioner, alla statliga myndigheter
- LOU-specialiserade byråer: primär målgrupp
- Expansion: alla juridiska praktikområden, nordiska länder, leverantörssidan

---

## 7. Utvecklingsplan (faser)

### 7.1 Fas 1: Datainsamling (Vecka 1-3)

- Registrera EU Login för TED API
- Ansöka om Avropa API-nyckel
- Kontakta SCB för företagsregister-access
- Sätta upp Supabase-databas med schema
- Bygga ETL-pipeline för datanormalisering

### 7.2 Fas 2: Lead Radar (Vecka 4-6)

- Implementera Lead Radar Agent (Radar-Ragna)
- Bygga scoring-modell
- Skapa dashboard för pipeline-vy

### 7.3 Fas 3: Content & Outreach (Vecka 7-10)

- Integrera Claude API för content-generering
- Bygga mail-automation (SendGrid/Resend)
- Skapa templates för olika content-typer
- Implementera varumärkesprofilsystem

### 7.4 Fas 4: Events & Uppföljning (Vecka 11-14)

- Bygga event-hantering (ersätta Eventbrite)
- Implementera post-event workflow
- ROI-dashboard och kvartalsrapporter

### 7.5 Fas 5: Säkerhet & Compliance (Vecka 15+)

- Dokumentera säkerhetsarkitektur professionellt
- Utvärdera Vanta Essentials vid 5+ kunder
- SOC 2-förberedelse

---

## 8. CPV-koder i scope

| Kod | Beskrivning | Relevans |
|-----|-------------|----------|
| 79100000 | Juridiska tjänster | Huvudfokus |
| 79111000 | Juridisk rådgivning | Underkategori |
| 79112000 | Juridiska representationstjänster | Underkategori — tvister/överprövning |

Juridiska tjänster kan direktupphandlas upp till ~8,5 MSEK (bilaga 2 LOU), vilket innebär att enormt mycket köps utan annonsering. Lead Radar-logiken (bakåt från kontraktsutgång) är därför extra viktig för denna nisch.

---

## 9. Risker & Begränsningar

| Risk | Konsekvens | Mitigering |
|------|-----------|------------|
| Cold start: lite data med få kunder | Systemet gissar mer än det vet | Thyrs Public Bid Manager-expertis kompenserar manuellt |
| TED har begränsat värde för svenska juridiska tjänster | Under-tröskelvärde syns inte | Komplettera med kommunala och regionala källor |
| Konkurrenter kan skrapa samma offentliga data | Publik data är kopierbar | Nätverkseffekten (privat + autonom data) skapar vallgrav |
| AI-motstånd hos jurister | Långsammare adoption | Positionera som "verktyg" (SaaS), inte "AI" — sälj problemet |
| GDPR-krav strängare än förväntat | Begränsad funktionalitet | EU-hosted Supabase + RLS + Vanta ger robust grund |
| In-house marknadsförare kan replikera | Kundens egen personal gör det själv | Argument: institutionell kontinitet > enskilda personers kunskap |
# Funktionalitet — Legal Radar Platform

## Översikt

Legal Radar Platform är ett autonomt SaaS-verktyg (inte en tjänst) med Public Bid Manager-logik riktat mot juristbyråer specialiserade på LOU. Byråer köper mjukvaran och kör den själva. Människan gör en sak: möter kunden. Allt annat är autonomt.

---

## 1. FIRM — Datainsamling & Bevakning

### 1.1 Automatisk datainsamling

- Hämta upphandlingar från TED API (EU-nivå, CPV 79100000 + underkoder)
- Hämta ramavtal från Avropa.se (statliga framework agreements med exakta slutdatum)
- Hämta statistik från Upphandlingsmyndigheten (nationell aggregering)
- Skrapa kommersiella annonsdatabaser (e-Avrop, OPIC, TendSign, Mercell) för under-tröskelvärde
- Hämta data från Upphandlingsdata.se/Tendium (tilldelningsresultat via offentlighetsprincipen)
- Skrapa myndigheters egna webbsidor för direktupphandlingar under 8,5 MSEK
- Exklusiv prioritetslogik: källa med högre prioritet tar företräde, ingen dubblering

### 1.2 Kontraktsbevakning

- Automatisk identifiering av kontraktsslutdatum och förlängningsoptioner
- Detektering av "rollover window" — perioden då kontrakt förlängs tyst innan omupphandling
- Spårning av avtalsvärden, CPV-koder och geografiska regioner (NUTS)
- Statusuppdatering: annonserad → pågående → tilldelad → avslutad → överprövad

### 1.3 Myndighets- och organisationsregister

- Import från SCB Företagsregister (gratis sedan juni 2025)
- 290 kommuner, 21 regioner, alla statliga myndigheter
- Alla registrerade advokatbyråer med branschkod
- Kontaktpersoner och organisationstyper

### 1.4 Datanormalisering & Berikning

- ETL-pipeline för normalisering av data från alla källor
- Automatisk korsreferensering (TED-ID ↔ UHM-ID ↔ Avropa-referens)
- pgvector-embeddings för semantic search på beskrivningar
- Daglig uppdatering via Sköld-Sigrid (datainsamlingsagent)

---

## 2. SHIELD — Analys & Compliance

### 2.1 Lead Radar (kärnfunktion)

- Skannar alla avtal bakåt från kontraktsutgång
- Beräknar trigger-datum: 18, 12, 9, 6 och 3 månader före utgång
- Genererar automatiska aktivitetssekvenser per trigger:
  - **Månad 18:** Radarövervakning — identifiera och prioritera
  - **Månad 12:** Kunskapsartikel publiceras, tidig kontakt via thought leadership
  - **Månad 9:** Seminarieinbjudan skickas, satisfaction probing
  - **Månad 6:** Personlig uppföljning, RFI-förberedelse, positioneringsfönster
  - **Månad 3:** Intensifiering — upphandlingen annonseras (för sent för konkurrenter)
- Konfigurerbart per kund: minsta avtalsvärde, CPV-filter, geografiskt fokus

### 2.2 Lead Scoring

- Poängmodell 0-100 baserad på dimensioner:
  - Kontraktsvärde (NUMERIC)
  - Timing (hur nära utgång)
  - Relationshistorik (tidigare kontakter)
  - Konkurrens (hur många bearbetar samma myndighet)
- Automatisk omberäkning vid nya datapunkter
- Prioriterad lead-lista i dashboard

### 2.3 Konkurrensanalys

- Identifiera vilka byråer som bearbetar vilka myndigheter
- "Trängselindikator" — visa var flera konkurrenter är aktiva
- "Vita fläckar" — myndigheter utan aktiv bearbetning
- Anonymiserad benchmarking: "2 andra byråer bearbetar redan Göteborg inom IT"

### 2.4 Marknadsanalys (Analys-Astrid)

- Trendidentifiering i upphandlingsdata
- Segmentering av myndigheter efter beteendemönster
- Nätverkseffektsberäkningar — aggregerade insikter över alla kunder
- Anonymiseringsregel: insikter delas BARA om baserade på data från minst 5 kunder

### 2.5 GDPR & Compliance (Compliance Guardian)

- Kontroll av opt-in-status innan all outreach
- Dataminimeringskontroll
- Automatisk radering av konkurrentdata efter 90 dagar
- Compliance-logg per lead och aktivitet
- Integration med Vanta MCP (fas 2-3) för realtids-compliance

### 2.6 Intelligence Protocol

Fyra faser per lead:

1. **Dataverifiering (M-14):** Bekräfta kontraktsdata
2. **Relationsöppning (M-12):** Första kontaktpunkt
3. **Satisfaction Probing (M-9):** Undersök nöjdhet med nuvarande leverantör
4. **Positioneringsfönster (M-6):** Aktivt positionera byrån

---

## 3. SPEAR — Exekvering & Content

### 3.1 SEO & Innehållsgenerering (Spjut-Sven)

- **Engångsinställning:** Varumärkesprofil med värdeerbjudande, målgrupp, tonläge, skrivprover, internlänkdomän, LOU-specialisering
- **Research-pipeline:**
  1. SERP API söker Google efter topprankade resultat
  2. Firecrawl skrapar konkurrerande innehåll
  3. Gemini genererar forskningsplan: användaravsikt, konkurrentanalys, innehållsluckor, strategisk positionering
- **Artikelproduktion:**
  - Claude skriver artikel baserat på varumärkesriktlinjer + forskning
  - Korrekta H1/H2/H3-rubriker med sökord
  - Interna länkar till byråns webbplats
  - AI-bilder via Nano Banana Pro (valfritt)
  - SEO-metadata: titel (max 60 tecken), beskrivning (max 155 tecken), slug

### 3.2 Innehållsoptimering

- Klistra in befintlig URL + målsökord
- Fullständig konkurrensgranskning mot topp 10 SERP
- Prioriterad förbättringslista: kritiska → viktiga → önskvärda
- Omskrivning med bevarande av önskade sektioner
- Lead Radar-koppling: optimal publiceringstiming relativt kontraktscykel

### 3.3 Social Media-generator

- LinkedIn-inlägg (max 1300 tecken) med hook, insikt, takeaway, CTA
- Instagram-tråd (3-5 slides) med hook → insikter → CTA
- Stilmatchning via skrivprov
- Thought leadership-vinkel: byrån positioneras som den som ser trender först

### 3.4 E-post & Outreach-automation

- Sekvenstyper: cold outreach, warm follow-up, proposal-påminnelse, win-back
- Personaliserings-tokens: avtal, värde, datum, myndighetsnamn
- A/B-test av ämnesrader
- Timing synkad med Lead Radar-triggers
- Mail-editor med mottagare från lead-lista

### 3.5 Event Management (Event-Koordinator)

Ersätter Eventbrite. Helt autonomt:

- **Planering:** Skapa event (frukostseminarium/webinar), sätta budget
- **Logistik:** Boka lokaler, förhandla med bageri, budgethantering
- **Inbjudningar:** Generera och skicka personliga inbjudningar baserat på lead scoring
- **Registrering:** Landing page för anmälning, bekräftelse-mail
- **Påminnelser:** Automatisk påminnelsesekvens
- **Kapacitetshantering:** Max antal deltagare, väntelista
- Standardbudget: 15 000 kr/event, 50 000 kr/kvartal (3 frukostar + 1 webinar)

### 3.6 Inbjudningsgenerator

- Event-specifika inbjudningar baserade på Lead Radar-data
- Personalisering per mottagares relation och intresseområden
- Stilmatchning med byråns varumärkesprofil
- Automatisk matchning mellan eventämne och utgående kontrakt

---

## 4. POST-EVENT — Uppföljning & ROI

### 4.1 Post-event workflow

Triggas automatiskt dagen efter event:

1. **Deltagarlogg** — vem kom, vem uteblev
2. **Tack-mail** — personligt tack till varje deltagare
3. **Feedback-förfrågan** — schemaläggs 1 dag efter
4. **Lead score-uppdatering** — deltagande höjer score
5. **Mötesbokning** — föreslå uppföljningsmöte
6. **Nästa event** — automatisk inbjudan till nästa kvartal

### 4.2 ROI-beräkning (Kvartals-Karl)

- Per event: kostnad, deltagare, möten, offerter, vunna, intäkt
- ROI-formel: `(intäkt - kostnad) / kostnad`
- ROI-mål: 5x minimum, 8x mål
- Exempelmål: 15 000 kr kostnad → 15 deltagare → 3 möten → 0.75 uppdrag → 75 000 kr
- Status-flagga: ✅ Över mål / ⚠️ Under mål

### 4.3 Kvartalsrapporter

- Aggregerad ROI per kvartal
- Jämförelse mot föregående kvartal
- Kanalanalys: vilka kanaler genererade bäst konvertering
- Rekommendationer för nästa kvartal
- Input till strategisk planering

### 4.4 Budget-tracking

- Total kvartalsbudget med fördelning per event
- Realtidsuppföljning: allokerat vs faktiskt
- Automatisk varning vid budgetöverskridande
- ROI per krona investerad

---

## 5. Dashboard & Styrning

### 5.1 Huvuddashboard

- Pipeline-radar: Lead Radar-visualisering med alla aktiva leads
- Lead-scores: Prioriterad lista
- Metrics: ROI, konvertering, aktivitetsstatus
- Action plan för hela byrån — eliminerar interna prioriteringsmöten

### 5.2 Frontend-struktur

```
/dashboard          — Huvudöversikt, pipeline-radar, lead-scores, metrics
/firm               — Avtalsöversikt, myndighetsregister, dataimport
/shield             — Scoring-regler, Lead Radar-config, GDPR-inställningar
/spear              — SEO/Content Studio, outreach-sekvenser, event-hantering
/settings           — Varumärkesriktlinjer, API-nycklar, teammedlemmar
```

### 5.3 Disciplinerad styrmodell

- **Kvartalsvy:** Strategisk planering, klientkickoff. Strategi och taktik LÅSES.
- **Månadsvy:** Taktisk uppföljning mot mål. Endast operativa justeringar tillåtna.
- **Veckovy:** Content refresh, Lead Radar-scan. ML-uppdatering söndagar.
- **Daglig:** Automatiserade triggers körs. Ingen manuell input krävs.

---

## 6. Söndagsuppdatering (ML-pipeline)

### 6.1 Batch-process varje söndag

1. Snapshot av produktionsdata
2. ML-träning: nya embeddings, uppdaterad scoring
3. Content-regenerering med senaste modellversioner
4. Kvalitetskontroll
5. Atomic swap till produktion

### 6.2 Versionering

- Varje kund har en ML-version
- Oskickade mail/inlägg i pipes uppdateras till senaste version
- Redan skickade kommunikationer lämnas orörda
- Kunder på olika onboarding-steg har rätt version

---

## 7. Thyr intern CRM

### 7.1 Eget CRM för Vibecode/Thyr

- Bygger på samma offentliga databas som kunderna
- Alla juristbyråer i Sverige finns — inte bara kunder
- Strategier, mötesanteckningar, konkurrensinsikter om byråerna
- Aldrig synligt för kunder — separerad via RLS
- Lila datapost = Thyr-intern information
# Datamodell — Legal Radar Platform

## Översikt

Databasen är uppdelad i fyra lager (FIRM, SHIELD, SPEAR, POST-EVENT) plus orchestration. Teknisk grund: **Supabase PostgreSQL + pgvector** med EU-hosting (Frankfurt). Row Level Security (RLS) isolerar kunddata.

### Princip för datalager

Tre dataskikt berikar varandra:

1. **Lager 1 — Offentligt**: Automatisk import från TED, Avropa, Upphandlingsmyndigheten. Ingen RLS — alla kunder ser samma data.
2. **Lager 2 — Kundens egna data**: Manuell inmatning + CRM-koppling. Strikt RLS per `customer_id`.
3. **Lager 3 — Autonomt inlärningslager**: Systemet skriver tillbaka data vid varje interaktion. Enrichar sig självt.

---

## FIRM-lagret (Datainsamling — Publik data)

### `upphandlingar`

Huvudtabell — varje unik upphandling.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | Unikt ID |
| ted_id | TEXT, UNIQUE | TED-referens (EU) |
| uhm_id | TEXT, UNIQUE | Upphandlingsmyndigheten-ID |
| cpv_kod | TEXT | Huvudkod, t.ex. '79100000' |
| cpv_underkod | TEXT | T.ex. '79111000' |
| titel | TEXT | Upphandlingens namn |
| beskrivning | TEXT | Fri text |
| beskrivning_embedding | vector(1536) | pgvector-embedding för semantic search |
| upphandlande_org_id | FK → organisationer | Vilken myndighet |
| nuts_region | TEXT | T.ex. 'SE110' (Stockholm) |
| upphandlingstyp | ENUM | öppen, selektiv, förhandlad, direkt |
| status | ENUM | annonserad, pågående, tilldelad, avslutad, överprövad |
| uppskattat_varde_sek | NUMERIC | Uppskattat kontraktsvärde |
| slutligt_varde_sek | NUMERIC | Faktiskt tilldelat värde |
| annons_datum | TIMESTAMP | När upphandlingen publicerades |
| sista_anbudsdag | TIMESTAMP | Deadline för anbud |
| kontraktsstart | DATE | Kontraktets startdatum |
| kontraktsslut | DATE | Kontraktets slutdatum |
| forlangning_max | DATE | Max förlängningsdatum om optioner finns |
| kalla_prioritet | INT | 1-6, vilken källa data kommer från |
| ramavtal | BOOLEAN | Om det är ett ramavtal |
| created_at | TIMESTAMP | Skapad |
| updated_at | TIMESTAMP | Senast uppdaterad |

**RLS:** Ingen — publik data, alla kunder ser allt.

### `organisationer`

Alla upphandlande myndigheter + leverantörer (juristbyråer).

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | Unikt ID |
| org_nummer | TEXT, UNIQUE | Organisationsnummer |
| namn | TEXT | Organisationsnamn |
| typ | ENUM | kommun, region, myndighet, bolag, advokatbyrå |
| nuts_region | TEXT | Geografisk region |
| webbplats | TEXT | URL |
| kontaktperson | TEXT | Namn |
| e_post | TEXT | Kontaktmail |
| antal_upphandlingar | INT | Cache — antal kopplade upphandlingar |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**RLS:** Ingen — publik data.

### `tilldelningar`

Vunna kontrakt — kopplar upphandling till leverantör.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| upphandling_id | FK → upphandlingar | |
| leverantor_id | FK → organisationer | Vinnande byrå/leverantör |
| tilldelat_datum | DATE | |
| kontraktsvarde_sek | NUMERIC | |
| status | ENUM | aktivt, avslutat, förlängt, överpövat |

**RLS:** Ingen — publik data.

### `datakallor`

Metadata om varje datakälla och hämtningsstatus.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| namn | TEXT | TED, Avropa, UHM, etc. |
| prioritet | INT | 1-6 (exklusiv logik) |
| senaste_hamtning | TIMESTAMP | |
| antal_poster | INT | |
| status | ENUM | aktiv, pausad, fel |
| api_endpoint | TEXT | URL till API |

---

## SHIELD-lagret (Analys — Kundspecifik data)

### `leads`

Identifierade affärsmöjligheter baserat på kontraktsförfall.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| customer_id | FK → customers | Vilken byrå äger leaden |
| company_id | FK → organisationer | Målorganisation |
| authority_id | FK → organisationer | Upphandlande myndighet |
| source_contract_id | FK → upphandlingar | Utgående avtal som triggade leaden |
| score | INT | 0-100 lead score |
| status | ENUM | ny, bearbetad, kvalificerad, möte_bokat, offert, vunnen, förlorad |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**RLS:** `customer_id = auth.uid()`

### `lead_scores`

Detaljerade poängdimensioner per lead.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| lead_id | FK → leads | |
| dimension | TEXT | contract_value, timing, relationship, competition |
| value | NUMERIC | Poäng för denna dimension |
| calculated_at | TIMESTAMP | |

**RLS:** Via leads.customer_id

### `lead_radar_events`

Trigger-datum beräknade bakåt från kontraktsutgång.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| contract_id | FK → upphandlingar | |
| customer_id | FK → customers | |
| trigger_month | INT | 18, 12, 9, 6 eller 3 månader före utgång |
| trigger_date | DATE | Beräknat datum |
| activity_type | ENUM | kunskapsartikel, seminarieinbjudan, personlig_uppföljning, intensifiering |
| status | ENUM | planerad, utförd, hoppat_över |
| executed_at | TIMESTAMP | |

**RLS:** `customer_id = auth.uid()`

### `network_insights`

Anonymiserade aggregerade insikter — nätverkseffektens kärna.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| insight_type | TEXT | channel_performance, event_roi, timing_pattern |
| metric | TEXT | T.ex. "frukostseminarium_motesfrekvens" |
| value | NUMERIC | T.ex. 73 (%) |
| sample_size | INT | Minimum 5 kunder krävs för delning |
| calculated_at | TIMESTAMP | |

**RLS:** Ingen — alla kunder ser aggregerade insikter (aldrig rådata).

### `compliance_log`

GDPR-verifieringar och kvalitetsgrindar.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| lead_id | FK → leads | |
| customer_id | FK → customers | |
| check_type | TEXT | gdpr_opt_in, data_minimering, content_compliance |
| result | ENUM | godkänd, nekad, varning |
| checked_at | TIMESTAMP | |

**RLS:** `customer_id = auth.uid()`

---

## SPEAR-lagret (Exekvering — Kundspecifik data)

### `content`

Allt genererat innehåll.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| customer_id | FK → customers | |
| type | ENUM | artikel, linkedin_inlagg, instagram_trad, email, inbjudan |
| title | TEXT | |
| body | TEXT | Innehållet |
| seo_meta | JSONB | {title, description, slug} |
| brand_profile_version | INT | Vilken version av varumärkesprofilen |
| lead_radar_event_id | FK → lead_radar_events | Om kopplat till trigger |
| status | ENUM | utkast, granskat, godkänt, publicerat, arkiverat |
| published_at | TIMESTAMP | |
| created_at | TIMESTAMP | |

**RLS:** `customer_id = auth.uid()`

### `campaigns`

Outreach-sekvenser.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| customer_id | FK → customers | |
| name | TEXT | |
| type | ENUM | cold_outreach, warm_followup, proposal_reminder, win_back |
| sequence_config | JSONB | Steg, timing, mallar |
| status | ENUM | aktiv, pausad, avslutad |
| started_at | TIMESTAMP | |

**RLS:** `customer_id = auth.uid()`

### `campaign_messages`

Enskilda meddelanden i kampanjer.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| campaign_id | FK → campaigns | |
| lead_id | FK → leads | |
| channel | ENUM | email, linkedin, telefon |
| content_id | FK → content | |
| sent_at | TIMESTAMP | |
| opened_at | TIMESTAMP | |
| clicked_at | TIMESTAMP | |
| replied_at | TIMESTAMP | |

**RLS:** Via campaigns.customer_id

### `events`

Frukostseminarier, webinarier och andra event.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| customer_id | FK → customers | |
| title | TEXT | |
| date | DATE | |
| venue | TEXT | Lokal |
| budget_allocated | NUMERIC | Budget i kr |
| budget_actual | NUMERIC | Faktisk kostnad |
| capacity | INT | Max antal deltagare |
| roi_target | NUMERIC | Mål-ROI (t.ex. 5.0 = 5x) |
| status | ENUM | planerad, inbjudningar_skickade, genomfört, analyserat |
| created_at | TIMESTAMP | |

**RLS:** `customer_id = auth.uid()`

### `registrations`

Eventanmälningar.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| event_id | FK → events | |
| lead_id | FK → leads | |
| status | ENUM | inbjuden, registrerad, bekräftad, deltog, uteblev |
| registered_at | TIMESTAMP | |
| attended | BOOLEAN | |

**RLS:** Via events.customer_id

### `brand_profiles`

Varumärkesriktlinjer — sätts en gång per kund.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| customer_id | FK → customers | |
| version | INT | Versionsnummer |
| vardeerbjudande | TEXT | Byråns värdeerbjudande |
| malgrupp | TEXT | Primär målgrupp |
| tonlage | TEXT | Skrivstil och ton |
| skrivprover | TEXT[] | Array med exempeltexter |
| internlank_doman | TEXT | Byråns webbdomän |
| lou_specialisering | TEXT[] | Specifika LOU-områden |
| created_at | TIMESTAMP | |

**RLS:** `customer_id = auth.uid()`

---

## POST-EVENT-lagret (Uppföljning & ROI)

### `event_feedback`

Deltagarfeedback.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| event_id | FK → events | |
| lead_id | FK → leads | |
| rating | INT | 1-5 |
| comment | TEXT | |
| submitted_at | TIMESTAMP | |

**RLS:** Via events.customer_id

### `meetings`

Bokade möten (från event eller outreach).

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| customer_id | FK → customers | |
| lead_id | FK → leads | |
| source_event_id | FK → events | NULL om inte från event |
| source_campaign_id | FK → campaigns | NULL om inte från kampanj |
| date | DATE | |
| status | ENUM | bokat, genomfört, avbokat |
| notes | TEXT | Mötesanteckningar |
| next_step | TEXT | |

**RLS:** `customer_id = auth.uid()`

### `deals`

Affärsutfall — vunna/förlorade uppdrag.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| customer_id | FK → customers | |
| lead_id | FK → leads | |
| meeting_id | FK → meetings | |
| value_sek | NUMERIC | Kontraktsvärde |
| status | ENUM | offert_skickad, vunnen, förlorad, avbruten |
| won_at | TIMESTAMP | |
| lost_reason | TEXT | Om förlorad |

**RLS:** `customer_id = auth.uid()`

---

## Orchestration (Systemtabeller)

### `customers`

Thyr-kunder (juristbyråer).

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | auth.uid() |
| org_id | FK → organisationer | Byråns org-post |
| plan | ENUM | enskild (29 999 kr), firma (49 999 kr) |
| onboarded_at | DATE | |
| current_quarter | TEXT | T.ex. 'Q1-2026' |
| strategy_locked_at | TIMESTAMP | När kvartalsstrategin låstes |
| ml_version | INT | Aktuell ML-modellversion |
| status | ENUM | aktiv, pausad, uppsagd |

**RLS:** `id = auth.uid()`

### `workflow_runs`

Maestro Magnus' körningar.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| workflow_type | TEXT | data_collection, lead_scoring, content_generation, event_management |
| customer_id | FK → customers | |
| status | ENUM | startad, pågår, klar, fel |
| started_at | TIMESTAMP | |
| completed_at | TIMESTAMP | |
| error_log | TEXT | |

**RLS:** `customer_id = auth.uid()`

### `agent_tasks`

Enskilda agentuppgifter inom ett workflow.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| workflow_run_id | FK → workflow_runs | |
| agent | TEXT | maestro_magnus, skold_sigrid, radar_ragna, etc. |
| task_type | TEXT | |
| input_json | JSONB | |
| output_json | JSONB | |
| status | ENUM | köad, pågår, klar, fel |
| started_at | TIMESTAMP | |
| completed_at | TIMESTAMP | |

**RLS:** Via workflow_runs.customer_id

---

## Vibecode intern CRM (Thyr-data — aldrig synlig för kunder)

### `thyr_crm_notes`

Thyrs egna CRM-anteckningar om juristbyråer och prospekts.

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| id | UUID, PK | |
| org_id | FK → organisationer | Vilken byrå |
| note_type | ENUM | möte, observation, strategi, konkurrens |
| content | TEXT | |
| created_by | TEXT | Thyr-användare |
| created_at | TIMESTAMP | |

**RLS:** Endast Thyr-admin — ingen kund ser denna tabell.

---

## Relationsdiagram (förenklat)

```
organisationer ←──── upphandlingar ────→ tilldelningar
      ↑                    ↑                    ↑
      │                    │                    │
  customers         lead_radar_events    (berikande data)
      │                    │
      ↓                    ↓
    leads ──→ campaign_messages ──→ content
      │              │
      ↓              ↓
   meetings      campaigns
      │
      ↓
    deals ──→ event_feedback
                   ↑
                events ──→ registrations
```

---

## Datapostens livscykel (fem färger)

Varje post i databasen har ett visuellt datalager:

| Färg | Ursprung | Beskrivning |
|------|----------|-------------|
| **Vit** | Import | Orörd grunddata från TED/Avropa/UHM |
| **Blå** | Systemberikning | Thyr har berikat med korsreferenser |
| **Gul** | Överskrivning | Ett värde har ändrats (t.ex. förlängt avtal) |
| **Lila** | Thyr-intern | Manuell notering — kunden ser aldrig detta |
| **Grön** | Kundbekräftad | Kunden har verifierat/uppdaterat uppgiften |
# Affärslogik — Legal Radar Platform

## Översikt

All affärslogik styrs av en disciplinerad kvartalsmodell: strategi låses kvartalsvis, taktik justeras månadsvis, operativ drift körs autonomt dagligen. Maestro Magnus orkestrerar samtliga workflows.

---

## 1. Styrmodell — Kvartals-Månads-Daglig

### 1.1 Kvartalscykel (Strategi)

- **Klientkickoff** vid kvartalets start
- Strategi och taktik SÄTTS och LÅSES
- Mål definieras: antal möten, events, konverteringsgrad
- Lead Radar konfigureras: CPV-filter, min avtalsvärde, geografiskt fokus
- Eventbudget allokeras (standard: 50 000 kr/kvartal)
- Föregående kvartals ROI granskas av Kvartals-Karl
- Anonymiserade insikter från nätverket inkluderas

### 1.2 Månadscykel (Taktik)

- Controller mäter KPI:er mot kvartalsmål
- Analytiker dokumenterar data för kvartalsbeslut
- ENDAST operativa justeringar tillåtna:
  - Justera targeting inom befintlig strategi
  - Byta kanal om en kanal underpresterar
  - Skala upp/ner aktiviteter
- Strategi och taktik FÅR INTE ändras mitt i kvartalet

### 1.3 Veckocykel

- Content refresh i pipes
- Lead Radar-scan efter nya kontraktsutgångar
- ML-uppdatering söndagar (batch pipeline)

### 1.4 Daglig drift

- Autonoma triggers körs utan manuell input
- Sköld-Sigrid hämtar ny data
- Radar-Ragna skannar och triggar
- Spjut-Sven och Event-Koordinator exekverar
- Enda mänskliga aktiviteten: möta kunden

---

## 2. Lead Radar — Kärnarbetsflöde

### 2.1 Trigger-logik

```python
def berakna_triggers(kontraktsslut, strategy_config):
    triggers = [
        (kontraktsslut - 18 mån, "radarövervakning", PRIORITET.LÅG),
        (kontraktsslut - 12 mån, "thought_leadership", PRIORITET.MEDEL),
        (kontraktsslut - 9 mån,  "seminarieinbjudan", PRIORITET.HÖG),
        (kontraktsslut - 6 mån,  "personlig_uppföljning", PRIORITET.MYCKET_HÖG),
        (kontraktsslut - 3 mån,  "intensifiering", PRIORITET.KRITISK),
    ]
    return [t for t in triggers if matchar_filter(t, strategy_config)]
```

### 2.2 Trigger → Aktivitet-mappning

| Trigger-månad | Aktivitet | Ansvarig agent | Output |
|---------------|-----------|----------------|--------|
| M-18 | Identifiera & prioritera kontraktet | Radar-Ragna | Lead skapad med score |
| M-12 | Publicera kunskapsartikel + tidig kontakt | Spjut-Sven | Artikel + LinkedIn-inlägg |
| M-9 | Skicka seminarieinbjudan | Event-Koordinator | Event skapat, inbjudan skickad |
| M-6 | Personlig uppföljning, satisfaction probing | Outreach-Automator | Mail-sekvens aktiverad |
| M-3 | Intensifiering (upphandling annonseras) | Alla SPEAR-agenter | Full bearbetning |

### 2.3 Rollover-window intelligens

Kontrakt förlängs ofta tyst en gång innan omupphandling:

- Systemet detekterar förlängningsoptioner i avtalsdata
- "Gul" datapost = avtalsslut har ändrats (förlängt)
- Triggers omberäknas automatiskt med nya datum
- Rollover-perioden = högsta värde för intelligence gathering (båda parter vet att omupphandling närmar sig)

---

## 3. Content-pipeline — Arbetsflöde

### 3.1 Nytt innehåll

```
Steg 1: Användare anger ämne + sökord
         ↓
Steg 2: SERP API söker Google → topp 10 resultat
         ↓
Steg 3: Firecrawl skrapar konkurrentinnehåll
         ↓
Steg 4: Gemini skapar forskningsplan:
         - Användaravsikt
         - Konkurrentanalys
         - Innehållsluckor
         - Strategisk positionering
         ↓
Steg 5: Claude skriver artikel med:
         - Varumärkesriktlinjer
         - Korrekt rubrikstruktur (H1/H2/H3)
         - Interna länkar
         - Thought leadership-vinkel
         ↓
Steg 6: SEO-metadata genereras (titel, beskrivning, slug)
         ↓
Steg 7: Valfritt: AI-bild via Nano Banana Pro
         ↓
Steg 8: Social media-adaption (LinkedIn, Instagram)
```

### 3.2 Optimering av befintligt innehåll

```
Input: Befintlig URL + målsökord
         ↓
SERP-analys: Jämför med topp 10 för sökordet
         ↓
Gap-analys: Vad saknas i befintligt innehåll?
         ↓
Förbättringslista (prioriterad):
  1. Kritiska (saknade sökord, felaktig avsiktsmatchning)
  2. Viktiga (strukturella brister)
  3. Önskvärda (stilförbättringar, interna länkar)
         ↓
Omskrivning med bevarade sektioner
```

### 3.3 Lead Radar-koppling

Om `contract_expiry` är känt:

- Beräkna optimal publiceringstiming (12-18 månader före utgång)
- Föreslå kompletterande aktiviteter:
  - Frukostseminarium (73% mötesfrekvens)
  - Riktad e-postsekvens (12% mötesfrekvens)
  - LinkedIn-inlägg

---

## 4. Event Management — Arbetsflöde

### 4.1 Event-livscykel

```
PLANERAD → INBJUDNINGAR_SKICKADE → GENOMFÖRT → ANALYSERAT

Detaljerat:
  1. Event skapas med budget och kapacitet
  2. Lead-lista genereras från scoring (topp N)
  3. Compliance Guardian godkänner varje mottagare
  4. Personliga inbjudningar genereras och skickas
  5. Påminnelsesekvens körs automatiskt
  6. Registreringar loggas
  7. Event genomförs (MÄNSKLIG AKTIVITET)
  8. Post-event workflow triggas (automatiskt):
     a. Deltagarlogg
     b. Tack-mail
     c. Feedback-enkät (dag +1)
     d. Lead score uppdateras
     e. Mötesbokning föreslås
  9. ROI beräknas
  10. Insikter matas tillbaka till nästa kvartal
```

### 4.2 ROI-beräkning

```
ROI = (intäkt - kostnad) / kostnad

Exempel:
  Event-kostnad:     15 000 kr
  Deltagare:         14
  Möten bokade:      4
  Offerter skickade: 2
  Vunna:             1
  Intäkt:            85 000 kr
  ROI:               (85 000 - 15 000) / 15 000 = 4.67x
  
  STATUS: ⚠️ Under mål (mål: 5x)
  REKOMMENDATION: Justera targeting
```

### 4.3 Budget-regler

- Standardbudget: 50 000 kr/kvartal
- Allokering: 3 frukostseminarier (15 000 kr/st) + 1 webinar (5 000 kr)
- Realtidsuppföljning: allokerat vs faktiskt
- Automatisk varning vid >10% budgetöverskridande

---

## 5. Lead-statushantering

### 5.1 Lead-livscykel

```
NY → BEARBETAD → KVALIFICERAD → MÖTE_BOKAT → OFFERT → VUNNEN / FÖRLORAD

Detaljerat:
  NY:           Lead skapad av Radar-Ragna
  BEARBETAD:    Innehåll/outreach har nått leaden
  KVALIFICERAD: Leaden har interagerat (öppnat mail, deltagit event)
  MÖTE_BOKAT:   Möte schemalagt
  OFFERT:       Offert skickad
  VUNNEN:       Uppdrag tilldelat byrån
  FÖRLORAD:     Uppdrag gick till konkurrent
  AVSLUT_EJ_NU: Inte intresserad just nu → återaktiveras vid nästa trigger
```

### 5.2 Score-påverkan

| Händelse | Score-effekt |
|----------|-------------|
| Lead skapad | Baspoäng baserat på avtalsvärde + timing |
| Öppnat mail | +5 |
| Klickat länk | +10 |
| Deltagit event | +20 |
| Bokat möte | +30 |
| Ingen respons (30 dagar) | -10 |
| Avslag | -20, status → AVSLUT_EJ_NU |

---

## 6. Dataflöde mellan kunder (Nätverkseffekten)

### 6.1 Principen: "Privat data enrichar publik data"

- Varje kund bidrar med sin interaktionsdata
- Data anonymiseras och aggregeras
- Anonymiserade insikter delas tillbaka till alla
- Ingen kund ser en annan kunds rådata

### 6.2 Anonymiseringsregler

- Insikter delas BARA om baserade på data från ≥5 kunder
- All identifierande information strippas
- Exempel på delade insikter:
  - "Frukostseminarier ger 73% mötesfrekvens vs 12% för e-post"
  - "Kommuner i Västra Götaland har 3x längre beslutscykel"
  - "Överprövningsärenden konverterar bäst Q3"

### 6.3 Flywheel-effekten (tre loopar)

1. **Processloop:** Kvartalsuppstarter förbättras av anonymiserade lärdomar
2. **Dataloop:** Varje kundinteraktion berikar den gemensamma databasen
3. **Infrastrukturloop:** Ägd infrastruktur som kunder nyttjar men inte kontrollerar

### 6.4 Databidrags-logik per prissättning

- **Enskild jurist (29 999 kr):** Bidrar med lite data (få kontakter, få utfall)
- **Byrå (49 999 kr):** Bidrar med mycket data (fler kampanjer, bredare marknadsbild)
- Byrån betalar mer men gör plattformen bättre för alla — rättvis byteshandel

---

## 7. GDPR & Compliance

### 7.1 Datazoner

| Zon | Innehåll | Retention | Åtkomst |
|-----|----------|-----------|---------|
| Zon 1: Kunddata | Byråns leads, kampanjer, events | Under avtalsperiod + 12 mån | Strikt RLS per kund |
| Zon 2: Optimeringshistorik | Konkurrentdata från SEO-analys | Auto-radering efter 90 dagar | Strikt per kund |
| Zon 3: Aggregerad intelligens | Anonymiserade insikter | Permanent (ingen kundkoppling) | Alla kunder ser |
| Zon 4: Intern systemdata | Vibecodes CRM, agentloggar | Permanent | Endast Thyr-admin |

### 7.2 GDPR-rättigheter (teknisk implementation)

- **Rätt till tillgång:** Export av all kunddata via dashboard
- **Rätt till radering:** `DELETE FROM * WHERE customer_id = X` + kaskadradering
- **Dataportabilitet:** JSON/CSV-export av alla poster
- **Automatisk radering:** Konkurrentdata raderas efter 90 dagar

### 7.3 Compliance-gate i workflow

Innan SPEAR exekverar NÅGON outreach:

1. Compliance Guardian kontrollerar opt-in-status
2. Verifierar dataminimering
3. Loggar resultatet i `compliance_log`
4. Blockerar om kontroll misslyckas

---

## 8. Prissättningslogik

### 8.1 Två priser — allt ingår

| Plan | Pris | Inkluderar |
|------|------|-----------|
| Enskild jurist | 29 999 kr/mån | All funktionalitet, alla events, all content |
| Byrå (valfri storlek) | 49 999 kr/mån | All funktionalitet, obegränsat antal jurister |

### 8.2 Varför ingen per-seat-modell

- Inget internt beslut om vem som "får" tillgång
- Kostnaden per jurist SJUNKER med varje anställd byrån har
- Belönar tillväxt istället för att bestraffa den
- "Addera tjänsten — ingen behöver sägas upp"

### 8.3 Ekonomisk jämförelse

- Seniormarknadschef kostar ~50 000 kr/mån + arbetsgivaravgifter
- Traditionell marknadsföringsbyrå: 500 000–1 000 000 kr/mån
- Legal Radar Platform: 49 999 kr/mån — eliminerar dessutom mötestid (fakturerbar tid tillbaka)

### 8.4 Intäktsmål

- Break-even: 2 kunder
- Delmål: 20 kunder = ~1 MSEK/mån
- Slutmål: 210 kunder = 1 MSEK/mån (med mix av planer)
- Marginal vid full kapacitet: ~84%
- LTV:CAC ratio-mål: >3:1

---

## 9. Progressiv automation (Onboarding)

### 9.1 Tre faser per kund

| Fas | Tidsperiod | Beteende |
|-----|-----------|----------|
| **Manuell** | Månad 1-3 | Kunden väljer, systemet föreslår. Kund godkänner varje aktivitet. |
| **Semi-autonom** | Månad 4-6 | Systemet agerar, kunden godkänner i batch. Dashboard visar alla planerade aktiviteter. |
| **Autopilot** | Månad 7+ | Systemet kör autonomt med månadsrapporter. Kunden möter kunder — resten sköts. |

### 9.2 Beteendedesign

- Val mellan pre-kvalificerade alternativ (inte öppna frågor)
- Visa missade möjligheter (skapa beroende av systemet)
- Gradvis dölja komplexitet allt eftersom förtroendet byggs

---

## 10. Cold Start & Säljlogik

### 10.1 Cold start-lösning

- Fas 0-5 kunder: Thyrs egen Public Bid Manager-expertis kompenserar för tunn data
- Fas 5-20: Tidiga mönster synliga ("Av 30 kampanjer fungerade X bäst")
- Fas 20+: Nätverkseffekten är påtaglig, data säljer sig själv

### 10.2 Säljmetodik

- **Sälj problemet, inte lösningen** vid första mötet
- Diagnostisk fråga: "Hur många av era befintliga klientavtal löper ut inom 18 månader — och vet ni det idag?"
- Positionera som affärsutvecklare, inte AI-leverantör
- Pris presenteras mot referenspunkt: seniormarknadschef (50 000 kr)
- Kvartalsbetalning: låg risk för kunden att testa

### 10.3 Institutionell kontinuitet som kärnargument

- Kunskap, relationer och data bor i individers huvuden
- Personal slutar, går på föräldraledighet, byter jobb
- Legal Radar Platform = institutionellt minne som överlever personalförändringar
