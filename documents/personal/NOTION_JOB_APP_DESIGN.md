# Notion Job Search App - Design Specification
**För: Mattias Thyr**  
**Skapad: 2026-02-27**

---

## 🎯 Mål
Skapa en komplett jobbsöknings-app i Notion som ersätter Huntr.co och är skräddarsydd för Mattias B2G-jobbsökning (Public Bid Manager, upphandling, försäljning till offentlig sektor).

---

## 📊 DATABASE STRUCTURE

### 1. **JOBS DATABASE** (Core)
**Typ:** Main database, 195+ poster redan skapade

**Properties:**
- `Titel` (Title) - Jobbtitel
- `Företag` (Relation → Companies) - Kopplat företag
- `Status` (Select) - Inkorg, Söker, Väntar på svar, Intervju, Nej, etc.
- `Deadline` (Date) - Sista ansökningsdag
- `Lön` (Number) - Förväntad lön (kr/mån)
- `Plats` (Text) - Stad/Region
- `Pendling` (Formula/Number) - Avstånd från Nässjö (min)
- `URL` (URL) - Länk till annons
- `Kontakter` (Relation → Contacts) - Rekryterare/kontakter för detta jobb
- `CV Version` (Relation → Resumes) - Vilken CV användes
- `Cover Letter` (Relation → Cover Letters) - Personligt brev
- `Dream Job Score` (Number 1-10) - Hur mycket vill du ha jobbet?
- `Applied Date` (Date) - När sökte du?
- `Follow-up Date` (Date) - Nästa uppföljning
- `Interview Prep` (Relation → Interview Prep) - Kopplade frågor/svar
- `Notes` (Text/Rich) - Anteckningar, reflektioner
- `Keywords` (Multi-select) - Nyckelord från annonsen
- `Skapad` (Created time) - Auto-timestamp
- `Senast ändrad` (Last edited time) - Auto-timestamp

**Views:**
1. **Board View (Kanban)** - Status-kolumner (som nu)
2. **Table View (All Jobs)** - Fullständig lista
3. **Calendar View** - Deadlines
4. **Active Jobs** (Filter: Status = Söker, Väntar, Intervju)
5. **Dream Jobs** (Filter: Dream Score >= 8)
6. **This Week** (Filter: Deadline inom 7 dagar)

---

### 2. **COMPANIES DATABASE**
**Typ:** Ny databas för företagsinformation

**Properties:**
- `Företagsnamn` (Title)
- `Bransch` (Select) - Bygg, IT, Konsult, etc.
- `Storlek` (Select) - Startup, SME, Enterprise
- `Webbplats` (URL)
- `Huvudkontor` (Text) - Stad
- `Offentlig kund?` (Checkbox) - Säljer de till kommun/region?
- `Företagskultur` (Text/Rich) - Värderingar, vibe
- `Senaste nyheter` (Text) - Pressmeddelanden, events
- `Konkurrenter` (Relation → Companies) - Liknande företag
- `Varför jobba här?` (Text) - Ditt svar på "Varför just oss?"
- `Jobb hos företaget` (Relation → Jobs) - Alla jobb du sökt där
- `Kontakter` (Relation → Contacts) - Personer på företaget
- `Rating` (Select) - ⭐⭐⭐⭐⭐

**Views:**
1. **Table View** - Alla företag
2. **Target Companies** (Filter: Rating >= 4)

---

### 3. **CONTACTS DATABASE**
**Typ:** CRM för nätverk/rekryterare

**Properties:**
- `Namn` (Title)
- `Företag` (Relation → Companies)
- `Roll` (Select) - Rekryterare, Hiring Manager, Kontakt, Referens
- `Email` (Email)
- `Telefon` (Phone)
- `LinkedIn` (URL)
- `Jobb kopplat till` (Relation → Jobs)
- `Senaste kontakt` (Date) - När pratade du senast?
- `Nästa uppföljning` (Date) - När ska du höra av dig?
- `Anteckningar` (Text) - Samtal, intryck
- `Status` (Select) - Cold, Warm, Hot

**Views:**
1. **Table View** - Alla kontakter
2. **Follow-up This Week** (Filter: Nästa uppföljning inom 7 dagar)
3. **By Company** (Grouped by: Företag)

---

### 4. **INTERVIEW PREP DATABASE**
**Typ:** Bibliotek med vanliga frågor + dina STAR-svar

**Properties:**
- `Fråga` (Title) - T.ex. "Berätta om dig själv"
- `Kategori` (Select) - Behavioral, Technical, Situational
- `Ditt svar` (Text/Rich) - Förberett STAR-svar
- `Exempel` (Text) - Konkret situation du använt
- `Jobb använd för` (Relation → Jobs) - Vilka intervjuer?
- `Rating` (Select) - Hur bra är ditt svar? (Needs work, Good, Great)

**Common questions to pre-populate:**
- Berätta om dig själv
- Varför vill du jobba här?
- Största styrka/svaghet?
- Konflikt med kollega - hur löste du det?
- Ge exempel på när du ledde ett projekt
- Hur hanterar du tight deadline?
- Varför bytte du jobb? (från entreprenör)
- Vad vet du om offentlig upphandling?

**Views:**
1. **By Category** (Grouped by: Kategori)
2. **Needs Work** (Filter: Rating = Needs work)

---

### 5. **RESUMES DATABASE**
**Typ:** Olika CV-versioner för olika roller

**Properties:**
- `Version Name` (Title) - T.ex. "Public Bid Manager v2"
- `Target Role` (Select) - Bid Manager, Säljare, Projektledare, etc.
- `Last Updated` (Date)
- `PDF File` (File) - Uppladdad PDF
- `Key Skills` (Multi-select) - Fokusområden
- `Jobs Used For` (Relation → Jobs)
- `Notes` (Text) - Vad skiljer denna version?

**Pre-populate:**
- "Public Bid Manager - Standard"
- "Säljare - Byggprodukter"
- "Projektledare - Offentlig sektor"

**Views:**
1. **Table View** - Alla versioner
2. **Recently Used** (Sort: Last Updated desc)

---

### 6. **COVER LETTERS DATABASE**
**Typ:** Sparade personliga brev

**Properties:**
- `Jobb` (Relation → Jobs) - Vilket jobb?
- `Företag` (Rollup from Jobs → Company)
- `Version` (Text/Rich) - Fullt personligt brev
- `Key Points` (Text) - Huvudbudskap
- `Created` (Created time)

**Views:**
1. **Table View** - Alla brev
2. **By Company** (Grouped by: Företag)

---

### 7. **ACTIVITY TRACKER**
**Typ:** Veckostatistik för att hålla momentum

**Properties:**
- `Vecka` (Title) - T.ex. "Vecka 9, 2026"
- `Ansökningar skickade` (Number)
- `Nya jobb sparade` (Number)
- `Kontakter gjorda` (Number)
- `Intervjuer` (Number)
- `Nej mottagna` (Number)
- `Mål nästa vecka` (Text)
- `Reflektion` (Text) - Vad gick bra/dåligt?

**Views:**
1. **Timeline View** - Vecka för vecka
2. **This Month** (Filter: Datum inom senaste 30 dagarna)

---

## 🎨 MAIN DASHBOARD LAYOUT

**Top Section:**
- **Weekly Stats Card**
  - Denna vecka: X ansökningar, Y intervjuer, Z svar
  - Target: 5 ansökningar/vecka
  - Progress bar

**Middle Section:**
- **Active Jobs (Board View)** - Inkorg → Söker → Väntar → Intervju
- **Quick Filters:**
  - Deadline denna vecka
  - Dream Jobs (score >= 8)
  - Följ upp idag

**Bottom Section:**
- **Companies to Research** (Rating >= 4, inga jobb än)
- **Follow-ups This Week** (Contacts med Nästa uppföljning < 7 dagar)
- **Interview Prep Needed** (Questions med Rating = Needs work)

---

## 🔗 RELATIONS & ROLLUPS

**Jobs → Companies:**
- Jobs.Företag → Companies (Relation)
- Jobs kan visa Company.Webbplats, Company.Storlek (Rollup)

**Jobs → Contacts:**
- Jobs.Kontakter → Contacts (Relation)
- Contacts.Jobb kopplat till → Jobs (Relation)

**Jobs → Resumes:**
- Jobs.CV Version → Resumes (Relation)
- Resumes.Jobs Used For → Jobs (Relation)

**Jobs → Interview Prep:**
- Jobs.Interview Prep → Interview Prep (Relation)
- Interview Prep.Jobb använd för → Jobs (Relation)

---

## 🤖 FORMULAS

### Dream Job Score (auto-calculate suggestion)
Baserat på:
- Lön (vikt: 30%)
- Pendling (vikt: 20%)
- Företag Rating (vikt: 30%)
- Deadline flexibilitet (vikt: 20%)

### Days Until Deadline
```
dateBetween(prop("Deadline"), now(), "days")
```

### Follow-up Overdue? (Contacts)
```
if(prop("Nästa uppföljning") < now(), "🔴 ÖVERDUE", "✅ OK")
```

---

## 📝 TEMPLATES

### Job Entry Template
När du lägger till ett nytt jobb:
- Auto-fyll skapad datum
- Pre-populate Status = "Inkorg"
- Reminder att fylla i: Företag, Deadline, Dream Score

### Interview Prep Session Template
När du förbereder intervju:
- Länka jobbet
- Lista frågor att förbereda
- Checkbox för att markera "Förberedd"

### Weekly Review Template
Varje söndag kväll:
- Fyll i veckans stats
- Reflektera: Vad gick bra? Vad kan förbättras?
- Sätt mål för nästa vecka

---

## 🎯 WORKFLOWS

### Workflow 1: Hitta nytt jobb → Ansökan
1. Spara jobb från LinkedIn/Indeed → Lägg till i "Inkorg"
2. Research företaget → Skapa/uppdatera i Companies
3. Anpassa CV → Välj/skapa Resume version
4. Skriv personligt brev → Spara i Cover Letters
5. Skicka ansökan → Flytta till "Söker", fyll i Applied Date
6. Sätt Follow-up Date (14 dagar fram)

### Workflow 2: Intervju inbokad
1. Flytta jobb till "Intervju"
2. Koppla Interview Prep-frågor
3. Research företaget (uppdatera Companies)
4. Förbered svar (STAR-metoden)
5. Efter intervju: Anteckningar i Jobs.Notes
6. Skicka tack-mail → Logga i Contacts

### Workflow 3: Veckoreviw (söndagar)
1. Öppna Activity Tracker
2. Räkna: Ansökningar, Intervjuer, Nej
3. Reflektera: Vad lärde jag mig?
4. Sätt mål för nästa vecka
5. Granska Follow-ups (Contacts med Nästa uppföljning < 7 dagar)

---

## 🚀 IMPLEMENTATION PLAN

### Fas 1: Core Setup (30 min)
1. Skapa Companies database
2. Skapa Contacts database
3. Koppla Relations: Jobs ↔ Companies, Jobs ↔ Contacts

### Fas 2: Interview & Resumes (20 min)
4. Skapa Interview Prep database (med common questions)
5. Skapa Resumes database
6. Koppla Relations: Jobs ↔ Interview Prep, Jobs ↔ Resumes

### Fas 3: Tracking & Dashboard (20 min)
7. Skapa Activity Tracker
8. Bygga Main Dashboard med embedded views
9. Lägg till Formulas (Dream Score, Days Until Deadline)

### Fas 4: Migration (30 min)
10. Gå igenom dina 195 jobb i nuvarande Notion
11. Lägg till Companies för de viktigaste
12. Lägg till Contacts för rekryterare du pratat med

---

## 💡 BONUSFEATURES (Senare)

- **Email Integration:** Koppla Gmail för att auto-logga emails med rekryterare
- **Chrome Extension:** Spara jobb från LinkedIn med 1 klick (Notion Web Clipper)
- **Automation:** Notion AI för att generera Cover Letter-utkast
- **Mobile App:** Notion iOS/Android för att uppdatera on-the-go

---

**Total tid att bygga:** ~1,5 timme  
**Kostnad:** $0 (Free Notion plan räcker, eller du har redan Plus)

**Redo att börja bygga?** 🚀
