// Parser for TODO.md to structured data
class TodoParser {
    constructor(markdown) {
        this.markdown = markdown;
        this.data = {
            projects: [],
            completed: [],
            future: [],
            stats: {
                total: 0,
                completed: 0,
                ongoing: 0
            }
        };
    }

    parse() {
        const lines = this.markdown.split('\n');
        let currentProject = null;
        let currentSection = null;

        for (let line of lines) {
            // Section headers
            if (line.startsWith('## ')) {
                currentSection = line.replace('## ', '').trim();
                continue;
            }

            // Project headers (###)
            if (line.startsWith('### ')) {
                if (currentProject) {
                    this.addProject(currentProject, currentSection);
                }
                currentProject = {
                    title: line.replace('### ', '').trim(),
                    steps: [],
                    status: currentSection === 'Pågående' ? 'ongoing' : 
                            currentSection === 'Klart ✅' ? 'done' : 'future',
                    description: ''
                };
                continue;
            }

            // Steps with checkbox
            const stepMatch = line.match(/^(\d+)\.\s+(✅|⏳)\s+(.+)/);
            if (stepMatch && currentProject) {
                const [, number, status, text] = stepMatch;
                currentProject.steps.push({
                    number: parseInt(number),
                    done: status === '✅',
                    text: text.trim()
                });
                continue;
            }

            // Description text
            if (line.startsWith('**') && currentProject) {
                currentProject.description = line.replace(/\*\*/g, '').trim();
            }

            // Files section
            if (line.startsWith('**Filer:**') && currentProject) {
                currentProject.files = [];
                continue;
            }

            if (line.startsWith('- `/') && currentProject && currentProject.files) {
                currentProject.files.push(line.replace(/^- `/, '').replace(/`$/, '').trim());
            }
        }

        // Add last project
        if (currentProject) {
            this.addProject(currentProject, currentSection);
        }

        this.calculateStats();
        return this.data;
    }

    addProject(project, section) {
        if (section === 'Pågående') {
            this.data.projects.push(project);
        } else if (section === 'Klart ✅') {
            this.data.completed.push(project);
        } else if (section === 'Framtida idéer') {
            this.data.future.push(project);
        }
    }

    calculateStats() {
        let total = 0;
        let completed = 0;

        [...this.data.projects, ...this.data.completed, ...this.data.future].forEach(project => {
            total += project.steps.length;
            completed += project.steps.filter(s => s.done).length;
        });

        this.data.stats = {
            total,
            completed,
            ongoing: this.data.projects.length,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }
}

// Mock data load (replace with actual file read later)
async function loadTodoData() {
    // For now, return mock data - will be replaced with actual TODO.md read
    const mockMarkdown = `# TODO - Vayron

**Skapad:** 2026-02-14

## Pågående

### Memory-automatisering från Telegram-grupper
**Mål:** Automatiskt spara konversationer från Telegram till memory/*.md

**Steg:**
1. ✅ Kartlagt gruppmappning (Professional/Semi/Personal/Private)
2. ⏳ Förstå memory_writer.py - vilket JSON-format den förväntar
3. ⏳ Besluta sparstrategi
4. ⏳ Implementera format
5. ⏳ Sätt upp automatisering (valfritt)

### Weiron-röstprojekt (ElevenLabs)
**Status:** Ljud nedladdat, väntar på voice cloning

**Steg:**
1. ✅ Laddat ner YouTube-klipp (13MB, 3 filer)
2. ⏳ Klippa rent tal från ljud
3. ⏳ Kombinera till 1-3 min sample
4. ⏳ Logga in ElevenLabs (GitHub)
5. ⏳ Ladda upp och klona röst

## Framtida idéer

### Multi-agent setup i kanaler
**Idé:** Olika AI-agenter i olika Telegram-kanaler

## Klart ✅

### Telegram-kanaler uppsatta
**Status:** 4 kanaler konfigurerade och mappade
`;

    const parser = new TodoParser(mockMarkdown);
    return parser.parse();
}
