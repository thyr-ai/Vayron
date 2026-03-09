# 🚀 QUICK START - Strava Integration

Allt är förberett! Du behöver bara göra 3 steg:

---

## ✅ Steg 1: Skapa Strava App (2 minuter)

Gå till: **https://www.strava.com/settings/api**

Fyll i:
- Application Name: **Övning.se**
- Category: **Training**
- Website: **https://ovning.se**
- Authorization Callback Domain: **ovning.se**
- Description: **Personal training records**

**Kopiera:**
- Client ID (siffror)
- Client Secret (lång sträng)

---

## ✅ Steg 2: Få Authorization Code (1 minut)

**Öppna denna URL** (byt `YOUR_CLIENT_ID` mot ditt riktiga Client ID):

```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://ovning.se&approval_prompt=force&scope=activity:read_all,profile:read_all
```

**Klicka "Authorize"**

Du redirectas till ovning.se med en kod i URL:en:
```
https://ovning.se/?code=DENNA_LÅNGA_KOD
```

**Kopiera koden** (allt efter `code=`)

---

## ✅ Steg 3: Skicka till Vayron

**Skicka mig dessa 3 värden:**

```
Client ID: [DIN_CLIENT_ID]
Client Secret: [DIN_CLIENT_SECRET]
Authorization Code: [DIN_AUTH_CODE]
```

**Då gör jag:**
1. ✅ Byter code → refresh token
2. ✅ Sparar credentials säkert
3. ✅ Hämtar dina aktiviteter
4. ✅ Skapar records.json
5. ✅ Sätter upp daglig auto-uppdatering

---

## 📁 Vad finns redan

### Scripts (redo att köra)
- `scripts/exchange_token.py` - Token exchange
- `scripts/fetch_activities.py` - Hämta aktiviteter + records

### Output (skapas automatiskt)
- `data/activities.json` - Alla aktiviteter
- `data/records.json` - Dina rekord
- `logs/cron.log` - Daglig uppdateringslog

### Web
- `example.html` - Färdig hemsida för att visa rekord
  - Längsta löpning
  - Snabbaste 10K / Halvmara
  - Längsta cykeltur  
  - Mest höjdmeter
  - Totalt i år (km + timmar)

### Automation
- `crontab-entry.txt` - Kör dagligen kl 06:00

---

## 🎨 Exempel på output

När allt är klart får du JSON-filer som:

```json
{
  "longest_run": {
    "distance_km": 21.1,
    "moving_time_formatted": "01:45:23",
    "name": "Morningrun",
    "date": "2026-02-15T07:00:00Z",
    "url": "https://www.strava.com/activities/123456"
  },
  "fastest_10k": {
    "moving_time_formatted": "00:42:15",
    "pace_formatted": "4:13",
    "name": "Speed work",
    "url": "..."
  },
  "total_distance_year_km": 1847.5,
  "total_moving_time_year_hours": 156.3
}
```

Dessa laddas direkt av `example.html` och visas snyggt!

---

## ⏭️ Efter setup

1. Kolla `data/records.json` - dina rekord finns där!
2. Öppna `example.html` i browser - se dina rekord live
3. Kopiera design/kod till ovning.se
4. Data uppdateras automatiskt varje morgon kl 06:00

---

**Redo när du är! Skicka bara de 3 värdena när du gjort Steg 1-2.**
