# Mission Control - Kanban Board Design 🎯

**Version:** 1.0 (Draft)  
**Datum:** 2026-02-23  
**GTD-fokus:** Context-driven task management

---

## 🎨 UI Layout

### Navigation (Tabs)
```
┌─────────────────────────────────────────────────────────────────┐
│ Mission Control                                    [vayron 👤]   │
├─────────────────────────────────────────────────────────────────┤
│  [📋 Kanban] [🖼️ Bilder] [📄 Dokument]                          │
├─────────────────────────────────────────────────────────────────┤
```

### Kanban Tab
```
┌─────────────────────────────────────────────────────────────────┐
│ Mission Control - Kanban                           [@dator ▼]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📥 Inbox    ▶️ Nästa    🚧 Pågående   ⏸️ Väntar   📦 Backlog   │
│  ────────    ─────────   ──────────   ─────────   ──────────   │
│  │ Task 1│   │ @dator │   │ Task  │   │ Email │   │ Someday│   │
│  │       │   │ Task 2│   │ Active│   │ answer│   │ /Maybe │   │
│  │ Task 2│   │       │   │       │   │       │   │        │   │
│  │       │   │ @vps  │   │       │   │       │   │        │   │
│  │ [+]   │   │ Task 3│   │ [+]   │   │ [+]   │   │ [+]    │   │
│  └───────┘   │       │   └───────┘   └───────┘   └────────┘   │
│              │ [+]   │                                          │
│              └───────┘                                          │
│                                                                  │
│  ✅ Klart (senaste veckan)                                      │
│  ──────────────────────────────                                 │
│  • [2026-02-23] Homebrew installerat                            │
│  • [2026-02-23] Mission Control startat i bakgrunden            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏷️ Context-filtrering (Viktigt!)

### Huvudfunktion: Context Selector
- **Dropdown i header:** `[@dator ▼]`
- **Val:** Alla / @dator / @telefon / @vps / @garaget / etc.
- **Beteende:** 
  - Visar endast tasks som matchar vald kontext
  - "Alla" visar allt, men grupperar per kontext
  - Dim-ar tasks som INTE matchar aktuell kontext (istället för att dölja helt)

### Context-display på tasks
```
┌──────────────────────┐
│ 🔧 Fixa webhook      │
│ @vps @dator          │  ← Context-badges
│ ──────────────────── │
│ Sätt upp endpoint... │
└──────────────────────┘
```

### Smart context-taggning
- Autocomplete vid skrivning: `@d` → förslag: @dator, @di (custom)
- Flera contexts per task OK (ex: @dator @vps)
- Färgkodning:
  - `@dator` = 🔵 blå
  - `@telefon` = 🟢 grön
  - `@vps` = 🟣 lila
  - `@garaget` = 🟠 orange
  - Custom = ⚪ grå

---

## 📊 Kolumner & States

### 1. 📥 Inbox (Capture)
- **Syfte:** Quick capture av idéer/tasks innan bearbetning
- **Action:** Drag till "Nästa steg" för att bearbeta
- **Lägg till:** Quick-add längst ner (enter = spara)

### 2. ▶️ Nästa steg (Next Actions)
- **Syfte:** Konkreta, actionable tasks
- **Gruppering:** Automatisk gruppering per context (@dator, @telefon, etc.)
- **Sortering:** Kan dra för att prioritera inom context

### 3. 🚧 Pågående (Doing)
- **Syfte:** Aktivt arbete just nu (max 3-5 tasks)
- **Varning:** Om >5 tasks, visa notis: "För många pågående!"

### 4. ⏸️ Väntar på (Waiting For)
- **Syfte:** Externa blockers
- **Extra info:** "Väntar på vem/vad?" (optional field)
- **Reminder:** Highlight tasks äldre än 7 dagar

### 5. 📦 Backlog
- **Syfte:** Someday/Maybe + misslyckade försök
- **Section headers:** "Someday/Maybe" + "Misslyckade försök"
- **Collapse:** Kan fällas ihop (default = collapsed)

### 6. ✅ Klart
- **Syfte:** Visa framsteg senaste veckan
- **Auto-arkivering:** Tasks äldre än 7 dagar flyttas till arkiv
- **Compact view:** Lista med datum + titel endast

---

## 💾 Datalagring & Sync

### Strategi: Hybrid (MISSION_CONTROL.md + JSON cache)

**Läsning (vid load):**
1. Parse MISSION_CONTROL.md → tasks
2. Bygg JSON-struktur i minnet
3. Cacha för snabb UI-rendering

**Skrivning (vid drag/edit):**
1. Uppdatera JSON-cache
2. Skriv tillbaka till MISSION_CONTROL.md (omedelbart)
3. Git commit + push (vid större ändringar, eller timer 5min)

**Format i MISSION_CONTROL.md:**
```markdown
## 📥 Inbox / Capture

- Fixa Google-inlogg för DI
- Undersök Homebrew på Mac

## 🎯 Att göra (Next Actions)

### @dator
- [ ] Bygg kanban board @dator @vps
- [ ] Updatera documentation @dator

### @telefon
- [ ] Ta foto på garaget @telefon @garaget
```

**Parsing-regler:**
- `- [ ]` = task (unchecked)
- `- [x]` = task (checked, flytta till Klart)
- `@keyword` = context tag
- `###` under "Att göra" = context-grupp

---

## 🎯 Features (Prioriterat)

### Must-have (MVP)
1. ✅ **Context-filtrering** - dropdown i header
2. ✅ **Drag & drop** mellan kolumner
3. ✅ **Quick-add** i varje kolumn
4. ✅ **Edit inline** (dubbelklick på task)
5. ✅ **Parse & sync** med MISSION_CONTROL.md

### Should-have (Phase 2)
6. 🔄 **Multi-context tagging** - flera @tags per task
7. 🎨 **Färgkodning** per context
8. ⚠️ **"För många pågående"** varning
9. 📅 **"Gamla väntare"** highlight (>7 dagar)
10. 📦 **Collapse backlog**

### Nice-to-have (Future)
11. 🔍 **Sök** i alla tasks
12. 📊 **Stats** (antal per kontext, velocity)
13. ⏰ **Deadlines** (optional på tasks)
14. 🔔 **Påminnelser** via Telegram
15. 📱 **Mobile-optimized** view

---

## 🛠️ Tech Stack

**Frontend:**
- Vanilla JS (keep it simple)
- Drag & drop: [SortableJS](https://sortablejs.github.io/Sortable/) (lightweight)
- Markdown parser: [marked.js](https://marked.js.org/)
- **Integration:** Lägg till kanban som ny tab i befintlig `public/index.html`

**Backend:**
- Node.js (redan i server.js)
- File I/O: fs.readFileSync / writeFileSync för MISSION_CONTROL.md
- Git commit: shell exec (`git add`, `git commit`, `git push`)
- **Nya endpoints i server.js:**
  - `/api/kanban/tasks` - GET/POST/PUT/DELETE
  - `/api/kanban/sync` - Force sync med MISSION_CONTROL.md

**Styling:**
- CSS Grid för kolumnlayout
- Flexbox för cards
- Dark mode friendly (inherit from current theme)
- **Matcha befintlig stil:** Använd samma färgschema som dokument/bilder

---

## 🚀 Implementation Plan

### Steg 1: Data Layer
- [ ] Parser för MISSION_CONTROL.md → JSON
- [ ] Writer för JSON → MISSION_CONTROL.md
- [ ] API endpoints:
  - `GET /api/tasks` → alla tasks
  - `POST /api/tasks` → ny task
  - `PUT /api/tasks/:id` → uppdatera task
  - `DELETE /api/tasks/:id` → ta bort task

### Steg 2: Basic UI
- [ ] Kanban grid layout (5 kolumner)
- [ ] Task cards (basic)
- [ ] Quick-add forms

### Steg 3: Drag & Drop
- [ ] SortableJS integration
- [ ] Move task mellan kolumner
- [ ] Persist till MISSION_CONTROL.md

### Steg 4: Context Features
- [ ] Context dropdown
- [ ] Context filtering logic
- [ ] Context badges på cards
- [ ] Färgkodning

### Steg 5: Polish
- [ ] Inline editing
- [ ] Varningar (många pågående, gamla väntare)
- [ ] Collapse backlog
- [ ] Mobile responsive

---

## 📐 Wireframe (Task Card)

```
┌────────────────────────────────────┐
│ 🔧 Fixa webhook                    │ ← Emoji + Titel
│ @vps @dator                        │ ← Context badges
│ ───────────────────────────────    │
│ Sätt upp endpoint för callbacks    │ ← Beskrivning (optional)
│                                    │
│ [✏️ Edit] [🗑️ Delete]              │ ← Actions (hover)
└────────────────────────────────────┘
```

---

## ✅ Beslut (2026-02-23)

1. **Projekt vs Tasks:** ✅ Ja till subtasks (nested tasks under projekt)
2. **Prioritering:** ✅ Sorteringsordning (drag för att ändra prioritet)
3. **Deadlines:** ❌ Inga due dates - flytta till backlog istället
4. **Arkivering:** ✅ Automatisk efter 7 dagar
5. **Git push frequency:** ✅ Batch var 5:e minut (eller vid större ändringar)

---

## 💬 Nästa steg

**Beslut från Mattias:**
- [ ] Godkänn design-skiss
- [ ] Besvara öppna frågor
- [ ] Prioritera features (MVP vs Later)

**Sedan:**
- Börja med Steg 1 (Data Layer)
- Iterera snabbt med feedback

---

_Designskiss skapad: 2026-02-23 | Vayron_
