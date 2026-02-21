# TODO Dashboard - Vayron

**Interaktiv visualisering av TODO.md**

## Features

✅ **Overview Dashboard**
- Total progress (circular chart)
- Task completion stats
- Active projects count

✅ **Timeline View**
- Visual runway av projekt
- Progress bars per projekt
- Status-indikatorer (completed/in-progress/future)

✅ **Project Management**
- Detaljerad vy av varje projekt
- Step-by-step tracking (✅/⏳)
- File attachments
- Collapsible sections

✅ **Next Actions**
- Top 5 nästa steg att göra
- Prioritering baserat på projekt
- Quick-reference för vad som är viktigt NU

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (inga dependencies!)
- **Styling:** Custom CSS med gradient themes
- **Data:** Parser för TODO.md markdown-format
- **Responsive:** Fungerar på desktop & mobile

## Användning

### Lokal utveckling

Öppna bara `index.html` i en webbläsare:
\`\`\`bash
cd /home/administrator/vayron/todo-dashboard
python3 -m http.server 8000
# Öppna http://localhost:8000
\`\`\`

### Integration med TODO.md

Nuvarande version använder mock-data. För att integrera med riktig TODO.md:

1. **Node.js backend:**
\`\`\`javascript
// server.js - exempel
const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.static('.'));

app.get('/api/todo', (req, res) => {
    const todo = fs.readFileSync('../TODO.md', 'utf8');
    res.json({ markdown: todo });
});

app.listen(8000);
\`\`\`

2. **Uppdatera parser.js:**
\`\`\`javascript
async function loadTodoData() {
    const response = await fetch('/api/todo');
    const { markdown } = await response.json();
    const parser = new TodoParser(markdown);
    return parser.parse();
}
\`\`\`

### Google AI Studio Integration

För att förbättra med Gemini API:

1. **Lägg till AI-features:**
   - Auto-suggest next steps
   - Smart prioritering
   - Project complexity analysis
   - Time estimates

2. **API-integration:**
\`\`\`javascript
// Exempel: AI-powered suggestions
async function getAISuggestions(project) {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': 'YOUR_API_KEY'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: \`Analysera detta projekt och föreslå nästa steg: \${JSON.stringify(project)}\`
                }]
            }]
        })
    });
    return response.json();
}
\`\`\`

## Nästa steg

1. ⏳ Koppla live TODO.md-parsing
2. ⏳ Lägg till edit-funktionalitet (uppdatera TODO.md från UI)
3. ⏳ Gemini API för smart suggestions
4. ⏳ Dark/light mode toggle
5. ⏳ Export-funktioner (PDF, PNG)
6. ⏳ Notifications för deadlines
7. ⏳ Collaboration features (dela projekt)

## Deployment

**GitHub Pages:**
\`\`\`bash
git init
git add .
git commit -m "Initial TODO dashboard"
git branch -M main
git remote add origin https://github.com/USERNAME/todo-dashboard.git
git push -u origin main
# Enable GitHub Pages in repo settings
\`\`\`

**Netlify/Vercel:**
Dra och släpp `todo-dashboard/` mappen till Netlify Drop.

## Anpassning

Byt färger i `css/styles.css`:
\`\`\`css
:root {
    --primary: #667eea;    /* Din primärfärg */
    --secondary: #764ba2;  /* Din sekundärfärg */
    --success: #10b981;    /* Success-färg */
    ...
}
\`\`\`

---

**Skapad:** 2026-02-14  
**Author:** Vayron (AI Assistant)  
**Licens:** MIT
