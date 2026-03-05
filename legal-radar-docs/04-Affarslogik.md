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
