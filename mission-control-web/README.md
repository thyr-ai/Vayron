# Mission Control Web Interface 🎯

**En responsiv webbaserad kontrollpanel för workspace-hantering**

## 🚀 Snabbstart

### Starta servern
```bash
cd /home/administrator/vayron/mission-control-web
npm start
```

Servern startar på: **http://localhost:8080**

### Inloggning
- **Användarnamn:** `vayron`
- **Lösenord:** `mission-control-2026`

## 📋 Funktioner

### 📄 Dokumentflöde
- **Senaste först** - Alla dokument sorterade efter senaste ändring
- **Sökfunktion** - Sök i filnamn och innehåll
- **Live preview** - Klicka för att visa innehåll direkt
- **Metadata** - Sökväg, datum, storlek

### 🖼️ Bildflöde
- **Grid-layout** - Responsivt rutnät för alla bilder
- **Thumbnails** - Snabba förhandsvisningar
- **Fullsize view** - Klicka för att se i full storlek
- **Metadata** - Namn och datum

### 📱 Responsiv Design
- **Desktop** - 3-4 kolumner för bilder
- **Tablet** - 2-3 kolumner
- **Mobile** - 1-2 kolumner, optimerad navigation

## 🗂️ Automatisk Arkivering

Ett månatligt cron-jobb kör arkivering:
- **Schema:** 1:a varje månad kl 00:00
- **Arkiverar:**
  - Memory-filer äldre än 90 dagar
  - Bilder äldre än 180 dagar
- **Lagring:** `/home/administrator/vayron/archive/YYYY-MM.tar.gz`
- **Rensning:** Raderar arkiv äldre än 2 år

### Kontrollera cron-status
```bash
openclaw cron list
```

### Kör arkivering manuellt
```bash
/home/administrator/vayron/mission-control-web/archive-monthly.sh
```

## 🔧 Teknisk Stack

- **Backend:** Node.js + Express
- **Auth:** Basic Authentication
- **File watching:** Chokidar (för framtida live-uppdateringar)
- **Frontend:** Vanilla JS, no dependencies
- **Design:** Dark mode, cyan accents

## 📁 Projektstruktur

```
mission-control-web/
├── server.js              # Express server + API
├── package.json           # Dependencies
├── archive-monthly.sh     # Arkiveringsskript
├── mission-control.service # Systemd service fil
├── public/
│   ├── index.html        # Main UI
│   ├── style.css         # Responsiv styling
│   └── app.js            # Frontend logic
└── README.md             # Denna fil
```

## 🛠️ API Endpoints

### Dokument
- `GET /api/documents` - Lista alla dokument
- `GET /api/file/:path` - Hämta filinnehåll
- `GET /api/search?q=query` - Sök i dokument

### Bilder
- `GET /api/images` - Lista alla bilder
- `GET /image/:path` - Visa bild

### System
- `GET /api/health` - Health check

## 🔐 Säkerhet

- **Basic Auth** - Kräver användarnamn/lösenord
- **Path validation** - Förhindrar directory traversal
- **Localhost only** - Lyssnar bara på localhost:8080
- **No external access** - Ej exponerad till internet

## 🎨 Färgschema

```css
--bg-dark: #1a1a1a      /* Huvudbakgrund */
--bg-light: #2a2a2a     /* Cards, modaler */
--accent: #00d4ff       /* Cyan accent */
--text: #e0e0e0         /* Primär text */
--text-dim: #888        /* Sekundär text */
```

## 🚦 Drift

### Med systemd (rekommenderat)
```bash
sudo cp mission-control.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mission-control
sudo systemctl start mission-control
sudo systemctl status mission-control
```

### Manuellt (dev)
```bash
npm run dev  # Med nodemon för auto-reload
```

### Stoppa servern
```bash
# Om systemd
sudo systemctl stop mission-control

# Om manuell
pkill -f "node server.js"
```

## 📊 Status & Logs

### Systemd logs
```bash
sudo journalctl -u mission-control -f
```

### Cron runs
```bash
openclaw cron runs mission-control-archive
```

## 🔮 Framtida förbättringar

- [ ] Live file updates via WebSocket
- [ ] File editing directly in UI
- [ ] Drag & drop file upload
- [ ] Better search (fuzzy, regex)
- [ ] Syntax highlighting för code
- [ ] Markdown rendering
- [ ] Image metadata (EXIF)
- [ ] Bulk operations
- [ ] Custom themes

## 📝 Ändringslogg

**2026-02-20** - Initial release
- Document feed med sök
- Image grid med preview
- Responsive design
- Basic auth
- Monthly archiving cron

---

**Byggd av Vayron 🦞 för Mattias workspace-hantering**
