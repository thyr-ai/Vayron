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
