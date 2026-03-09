# Övning.se - Strava Integration

Automatisk hämtning och analys av träningsdata från Strava.

## Setup

Se `SETUP.md` för komplett guide.

**TL;DR:**
1. Skapa Strava App → få Client ID + Secret
2. OAuth-flow → få Authorization Code
3. Kör `exchange_token.py` → sparar credentials
4. Kör `fetch_activities.py` → hämtar data

## Scripts

### `scripts/exchange_token.py`
Byter authorization code mot refresh token (körs EN gång vid setup).

```bash
python3 scripts/exchange_token.py <client_id> <client_secret> <auth_code>
```

### `scripts/fetch_activities.py`
Hämtar alla aktiviteter och genererar rekord (körs dagligen via cron).

```bash
python3 scripts/fetch_activities.py
```

## Output Files

### `data/activities.json`
Alla aktiviteter från Strava (senaste 1000).

### `data/records.json`
Personliga rekord:
- Längsta löpning
- Snabbaste 10K / Halvmara / Maraton
- Längsta cykeltur
- Mest höjdmeter (en aktivitet)
- Totalt i år (km + timmar)

## Cron Job

Automatisk uppdatering kl 06:00 varje dag:

```cron
0 6 * * * cd /home/administrator/vayron/ovning-se && python3 scripts/fetch_activities.py >> logs/cron.log 2>&1
```

## Dependencies

```bash
pip3 install requests
```

## Security

- Credentials sparas i `/home/administrator/vayron/credentials/strava-api.json`
- Git-crypt krypterad (endast synlig för auktoriserade)
- Access tokens förnyas automatiskt var 6:e timme

---

_Created: 2026-03-08_
