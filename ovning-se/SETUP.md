# Strava Integration Setup - ovning.se

## Steg 1: Skapa Strava App (5 minuter)

1. Gå till: **https://www.strava.com/settings/api**
2. Klicka "Create an App"
3. Fyll i:
   - **Application Name:** Övning.se
   - **Category:** Training
   - **Club:** (lämna tom)
   - **Website:** https://ovning.se
   - **Authorization Callback Domain:** ovning.se
   - **Application Description:** Personal training records and statistics
4. Godkänn villkor och klicka "Create"

**Du får då:**
- Client ID (ex: 123456)
- Client Secret (ex: abc123def456...)

**Kopiera dessa två** - behövs i nästa steg.

---

## Steg 2: Få din Refresh Token (2 minuter)

1. **Öppna denna URL i webbläsare** (byt ut `YOUR_CLIENT_ID`):

```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://ovning.se&approval_prompt=force&scope=activity:read_all,profile:read_all
```

2. Klicka "Authorize"
3. Du redirectas till ovning.se med en kod i URL:en:
   ```
   https://ovning.se/?state=&code=DENNA_KOD_BEHÖVER_DU&scope=read,activity:read_all,profile:read_all
   ```
4. **Kopiera koden** (den långa strängen efter `code=`)

5. **Skicka mig:**
   - Client ID
   - Client Secret  
   - Authorization Code (koden du just kopierade)

**Jag gör resten automatiskt!**

---

## Steg 3: Automatisk setup (Vayron gör detta)

När du skickat ovanstående tre värden:

1. ✅ Jag byter authorization code mot refresh token
2. ✅ Sparar credentials säkert (git-crypt krypterat)
3. ✅ Hämtar dina första aktiviteter från Strava
4. ✅ Analyserar för rekord
5. ✅ Skapar JSON-filer redo för ovning.se
6. ✅ Sätter upp daglig cron-job för uppdateringar

---

## Vad händer sen?

**Automatiskt varje morgon kl 06:00:**
- Hämtar nya aktiviteter från Strava
- Uppdaterar dina rekord
- Genererar fresh data till hemsidan

**Data som blir tillgänglig:**
- `/home/administrator/vayron/ovning-se/data/activities.json` - Alla aktiviteter
- `/home/administrator/vayron/ovning-se/data/records.json` - Dina rekord
- `/home/administrator/vayron/ovning-se/data/stats.json` - Statistik (totalt km, timmar, etc)

**Rekord som hittas:**
- Längsta löpning
- Snabbaste 10K
- Snabbaste halvmara
- Längsta cykeltur
- Mest höjdmeter (en aktivitet)
- Mest aktiva vecka
- ...och mer!

---

## Säkerhet

✅ Client Secret sparas krypterat (git-crypt)  
✅ Access tokens förnyas automatiskt  
✅ Endast dina egna data hämtas  
✅ Ingen data delas med tredje part  

---

_När du har gjort Steg 1-2, skicka bara de tre värdena till mig så kör jag resten!_
