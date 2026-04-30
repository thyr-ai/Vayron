# VPS Fuskblad — Thyr's Server

## 🚀 En-knapp-start (rekommenderat)

**På din Mac:**

```bash
vps-connect
```

Detta startar automatiskt:
- SSH-tunnlar i bakgrunden
- Öppnar Dashboard (http://localhost:18789)
- Öppnar Mission Control (http://localhost:8080)

**Stänga ner:**
```bash
vps-disconnect
```

---

## 📦 Installation (en gång)

Kör detta **på din Mac** för att sätta upp alias:

```bash
chmod +x ~/vps-connect.sh ~/vps-disconnect.sh

echo 'alias vps-connect="~/vps-connect.sh"' >> ~/.zshrc
echo 'alias vps-disconnect="~/vps-disconnect.sh"' >> ~/.zshrc

source ~/.zshrc
```

---

## 🔌 Manuell inloggning (med tunnlar)

```bash
ssh -L 8080:localhost:8080 -L 18789:localhost:18789 administrator@85.190.102.252
```

Eller om du satt upp alias:

```bash
vps
```

### Kör tunneln i bakgrunden (stäng terminalen fritt):

```bash
ssh -L 8080:localhost:8080 -L 18789:localhost:18789 -N -f administrator@85.190.102.252
```

`-N` = gör inget annat än håll tunneln öppen  
`-f` = kör i bakgrunden, terminalen är fri

### Stänga bakgrundstunneln:

```bash
pkill -f "ssh -L 8080"
```

---

## 🌐 Webbgränssnitt (öppna i webbläsaren)

| Tjänst | Adress | Credentials |
|---|---|---|
| Dashboard | http://localhost:18789 | Gateway token (auto) |
| Mission Control | http://localhost:8080 | `vayron` / `mission-control-2026` |

---

## 🦞 OpenClaw — Vanliga kommandon

```bash
openclaw gateway start     # Starta
openclaw gateway stop      # Stoppa
openclaw gateway status    # Kolla status
openclaw status            # Full översikt
```

### ⚠️ Undvika dubbla instanser

Kör detta EN GÅNG för att permanent stänga av systemd-versionen:

```bash
sudo systemctl disable openclaw
sudo systemctl stop openclaw
```

Nu startar bara användar-versionen (rätt version) automatiskt.

---

## 🎯 Mission Control Web

**Starta server manuellt (på VPS):**

```bash
cd /home/administrator/vayron/mission-control-web
./start.sh
```

**Stoppa server:**

```bash
./stop.sh
```

**Kolla om servern kör:**

```bash
ps aux | grep "node server.js" | grep -v grep
```

---

## 🔍 Felsökning

```bash
# Kolla om tjänsten kraschar
journalctl --user -u openclaw-gateway.service -n 50 --no-pager

# Kolla vad som körs på en port
sudo lsof -i :18789
sudo lsof -i :8080

# Kolla alla openclaw-processer
ps aux | grep openclaw

# Kolla SSH-tunnlar
ps aux | grep "ssh -L"

# Kolla serverlyssning
ss -tlnp | grep -E "8080|18789"
```

---

## 📋 Sessionschecklista

### På din Mac:

1. ✅ Kör `vps-connect`
2. ✅ Dashboard & Mission Control öppnas automatiskt
3. ✅ Logga in i Mission Control: `vayron` / `mission-control-2026`

### Om något inte funkar:

1. SSH in på VPS: `ssh administrator@85.190.102.252`
2. Kolla status: `openclaw gateway status`
3. Starta om vid behov: `openclaw gateway restart`
4. Kolla Mission Control: `cd ~/vayron/mission-control-web && ./start.sh`

---

## 📝 Scripts

### vps-connect.sh (~/vps-connect.sh)

```bash
#!/bin/bash
# VPS Quick Connect — Startar tunnlar + öppnar Dashboard & Mission Control

VPS_HOST="administrator@85.190.102.252"

echo "🔌 Startar SSH-tunnlar..."

ssh -L 8080:localhost:8080 -L 18789:localhost:18789 -N -f "$VPS_HOST" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Tunnlar aktiva!"
    sleep 2
    
    echo "🌐 Öppnar Dashboard..."
    open http://localhost:18789
    
    echo "🎯 Öppnar Mission Control..."
    open http://localhost:8080
    
    echo ""
    echo "✨ Klart! Båda tjänsterna öppnas i webbläsaren."
    echo ""
    echo "För att stänga: kör vps-disconnect"
else
    echo "❌ Kunde inte ansluta till VPS. Kolla internetanslutning/credentials."
fi
```

### vps-disconnect.sh (~/vps-disconnect.sh)

```bash
#!/bin/bash
# VPS Disconnect — Stänger SSH-tunnlar

echo "🔌 Stänger SSH-tunnlar..."

pkill -f "ssh -L 8080:localhost:8080 -L 18789:localhost:18789"

if [ $? -eq 0 ]; then
    echo "✅ Tunnlar stängda!"
else
    echo "⚠️  Inga aktiva tunnlar hittades."
fi
```

---

*Uppdaterad: 2026-02-20*
