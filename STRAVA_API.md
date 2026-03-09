# Strava API - Dokumentation för ovning.se

## Översikt

Strava API v3 är gratis att använda och kräver OAuth 2.0-autentisering. Du kan hämta dina egna träningsdata för att visa på ovning.se.

**Rate limits:**
- 200 requests per 15 minuter
- 2,000 requests per dag

## Setup-steg

### 1. Skapa API Application

1. Gå till https://www.strava.com/settings/api
2. Skapa en ny app
3. Du får:
   - **Client ID** (public)
   - **Client Secret** (hemlig - spara säkert!)
   - **Authorization Token** (uppdateras var 6:e timme)
   - **Refresh Token** (för att få nya access tokens)

**Authorization Callback Domain:**
- Development: `localhost`
- Production: `ovning.se`

### 2. OAuth 2.0 Autentisering

#### Steg 1: Be användare godkänna

Skicka användare till:
```
http://www.strava.com/oauth/authorize?client_id=[YOUR_CLIENT_ID]&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read_all
```

**Scopes (behörigheter):**
- `activity:read` - Läs publika aktiviteter
- `activity:read_all` - Läs ALLA aktiviteter (inkl. privata)
- `activity:write` - Skapa/uppdatera aktiviteter
- `profile:read_all` - Läs profil
- `profile:write` - Uppdatera profil

För ovning.se: använd `activity:read_all` för att få alla dina träningspass.

#### Steg 2: Byt authorization code mot tokens

När användaren godkänt redirectas de tillbaka med en `code` i URL:en.

Gör POST-request:
```bash
curl -X POST https://www.strava.com/oauth/token \
  -F client_id=YOUR_CLIENT_ID \
  -F client_secret=YOUR_CLIENT_SECRET \
  -F code=AUTHORIZATION_CODE \
  -F grant_type=authorization_code
```

**Response:**
```json
{
  "token_type": "Bearer",
  "expires_at": 1562908002,
  "expires_in": 21600,
  "refresh_token": "REFRESH_TOKEN",
  "access_token": "ACCESS_TOKEN",
  "athlete": {
    "id": 123456,
    "username": "mattias",
    ...
  }
}
```

**Viktigt:** Access tokens är giltiga i 6 timmar. Använd refresh token för att få nya.

#### Steg 3: Förnya access token

```bash
curl -X POST https://www.strava.com/oauth/token \
  -F client_id=YOUR_CLIENT_ID \
  -F client_secret=YOUR_CLIENT_SECRET \
  -F refresh_token=YOUR_REFRESH_TOKEN \
  -F grant_type=refresh_token
```

## API Endpoints för ovning.se

### Hämta alla aktiviteter

**Endpoint:**
```
GET https://www.strava.com/api/v3/athlete/activities
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query parameters:**
- `before` (integer) - Unix timestamp, aktiviteter före detta
- `after` (integer) - Unix timestamp, aktiviteter efter detta
- `page` (integer) - Sidnummer (default: 1)
- `per_page` (integer) - Aktiviteter per sida (default: 30, max: 200)

**Exempel:**
```bash
# Hämta senaste 50 aktiviteterna
curl -X GET \
  "https://www.strava.com/api/v3/athlete/activities?per_page=50" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response data (viktig information):**
```json
[
  {
    "id": 12345678,
    "name": "Morningrun",
    "distance": 10000.0,          // meter
    "moving_time": 3600,          // sekunder
    "elapsed_time": 3900,         // sekunder
    "total_elevation_gain": 150,  // meter
    "type": "Run",
    "sport_type": "Run",
    "start_date": "2026-03-08T06:00:00Z",
    "start_date_local": "2026-03-08T07:00:00Z",
    "average_speed": 2.78,        // m/s
    "max_speed": 5.2,             // m/s
    "average_heartrate": 155.3,
    "max_heartrate": 182,
    "kudos_count": 5,
    "achievement_count": 2,
    "pr_count": 1
  }
]
```

### Hämta specifik aktivitet

**Endpoint:**
```
GET https://www.strava.com/api/v3/activities/{id}
```

**Ger mer detaljerad info:**
- Segment efforts (delsträckor)
- Laps (varv)
- GPS-data (polyline)
- Foton
- Splits (km/mil-splits)

### Hämta atlet-statistik

**Endpoint:**
```
GET https://www.strava.com/api/v3/athletes/{id}/stats
```

**Response:**
```json
{
  "recent_ride_totals": {
    "count": 12,
    "distance": 250000,
    "moving_time": 36000,
    "elapsed_time": 40000,
    "elevation_gain": 2500
  },
  "all_ride_totals": {...},
  "recent_run_totals": {...},
  "all_run_totals": {...},
  "ytd_ride_totals": {...},
  "ytd_run_totals": {...}
}
```

## Implementation för ovning.se

### Steg 1: Spara credentials säkert

```bash
# Skapa fil i credentials/ (git-crypt krypterad)
/home/administrator/vayron/credentials/strava-api.md
```

**Innehåll:**
```markdown
# Strava API Credentials

Client ID: [DIN_CLIENT_ID]
Client Secret: [DIN_CLIENT_SECRET]
Refresh Token: [DIN_REFRESH_TOKEN]
Access Token: [AUTO-GENERERAD]
Token Expiry: [TIMESTAMP]

## Notes
- Access token förnyas automatiskt var 6:e timme
- Refresh token är permanent (tills användaren återkallar access)
```

### Steg 2: Skapa Python script

```python
# /home/administrator/vayron/ovning-se/fetch-strava.py

import requests
import json
from datetime import datetime, timedelta

# Ladda credentials
with open('/home/administrator/vayron/credentials/strava-api.json') as f:
    creds = json.load(f)

def refresh_token():
    """Förnya access token om den har gått ut"""
    if creds['token_expiry'] < datetime.now().timestamp():
        response = requests.post('https://www.strava.com/oauth/token', data={
            'client_id': creds['client_id'],
            'client_secret': creds['client_secret'],
            'refresh_token': creds['refresh_token'],
            'grant_type': 'refresh_token'
        })
        data = response.json()
        creds['access_token'] = data['access_token']
        creds['token_expiry'] = data['expires_at']
        # Spara uppdaterade credentials
        with open('/home/administrator/vayron/credentials/strava-api.json', 'w') as f:
            json.dump(creds, f, indent=2)
    return creds['access_token']

def get_activities(limit=100):
    """Hämta senaste aktiviteterna"""
    token = refresh_token()
    headers = {'Authorization': f'Bearer {token}'}
    
    activities = []
    page = 1
    
    while len(activities) < limit:
        response = requests.get(
            'https://www.strava.com/api/v3/athlete/activities',
            headers=headers,
            params={'per_page': min(200, limit - len(activities)), 'page': page}
        )
        data = response.json()
        
        if not data:
            break
            
        activities.extend(data)
        page += 1
    
    return activities[:limit]

def get_records():
    """Analysera aktiviteter för att hitta rekord"""
    activities = get_activities(limit=1000)  # Hämta senaste 1000
    
    records = {
        'longest_run': None,
        'fastest_run_10k': None,
        'fastest_run_half_marathon': None,
        'longest_ride': None,
        'most_elevation': None,
        'most_active_week': None
    }
    
    for activity in activities:
        # Längsta löpning
        if activity['type'] == 'Run':
            if not records['longest_run'] or activity['distance'] > records['longest_run']['distance']:
                records['longest_run'] = activity
        
        # Snabbaste 10k (9.5-10.5 km range)
        if activity['type'] == 'Run' and 9500 <= activity['distance'] <= 10500:
            if not records['fastest_run_10k'] or activity['moving_time'] < records['fastest_run_10k']['moving_time']:
                records['fastest_run_10k'] = activity
        
        # ... etc för andra rekord
    
    return records

if __name__ == '__main__':
    records = get_records()
    # Exportera till JSON för hemsidan
    with open('/home/administrator/vayron/ovning-se/data/records.json', 'w') as f:
        json.dump(records, f, indent=2)
```

### Steg 3: Visa på ovning.se

**HTML/JS för hemsidan:**
```html
<!-- ovning.se/records.html -->
<div id="strava-records">
  <h2>Mina rekord från Strava</h2>
  <div id="records-list"></div>
</div>

<script>
fetch('/data/records.json')
  .then(r => r.json())
  .then(records => {
    const list = document.getElementById('records-list');
    
    // Längsta löpning
    if (records.longest_run) {
      const km = (records.longest_run.distance / 1000).toFixed(2);
      list.innerHTML += `
        <div class="record">
          <h3>Längsta löpning</h3>
          <p>${km} km - ${records.longest_run.name}</p>
          <p>${new Date(records.longest_run.start_date).toLocaleDateString('sv-SE')}</p>
        </div>
      `;
    }
    
    // ... visa andra rekord
  });
</script>
```

## Automatisering

### Cron job för att uppdatera data dagligen

```bash
# /etc/cron.d/ovning-se-strava
0 6 * * * administrator cd /home/administrator/vayron/ovning-se && python3 fetch-strava.py
```

## Rate Limit Hantering

```python
def make_request_with_retry(url, headers, params=None):
    """Gör request med automatic retry vid rate limit"""
    response = requests.get(url, headers=headers, params=params)
    
    # Kolla rate limit headers
    rate_limit = {
        'limit_15min': response.headers.get('X-RateLimit-Limit'),
        'usage_15min': response.headers.get('X-RateLimit-Usage'),
        'limit_daily': response.headers.get('X-ReadLimit-Limit'),
        'usage_daily': response.headers.get('X-ReadLimit-Usage')
    }
    
    if response.status_code == 429:  # Rate limit exceeded
        # Vänta 15 min
        time.sleep(900)
        return make_request_with_retry(url, headers, params)
    
    return response.json()
```

## Nästa steg

1. **Skapa Strava App** på https://www.strava.com/settings/api
2. **Gör OAuth-flow** för att få din refresh token
3. **Spara credentials** i `/home/administrator/vayron/credentials/strava-api.json`
4. **Testa fetch-script** för att hämta dina aktiviteter
5. **Bygg records-analys** för att hitta dina bästa prestationer
6. **Integrera på ovning.se** med design och layout

## Resurser

- Strava API docs: https://developers.strava.com/docs/
- OAuth guide: https://developers.strava.com/docs/authentication/
- API reference: https://developers.strava.com/docs/reference/
- Swagger playground: https://developers.strava.com/playground (för testing)

---

_Dokumentation skapad: 2026-03-08_
_Senast uppdaterad: 2026-03-08_
