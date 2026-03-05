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
