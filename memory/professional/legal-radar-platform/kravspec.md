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
