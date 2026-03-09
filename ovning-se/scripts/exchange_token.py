#!/usr/bin/env python3
"""
Exchange Strava authorization code for refresh token
Usage: python3 exchange_token.py <client_id> <client_secret> <auth_code>
"""

import sys
import json
import requests

if len(sys.argv) != 4:
    print("Usage: python3 exchange_token.py <client_id> <client_secret> <auth_code>")
    sys.exit(1)

client_id = sys.argv[1]
client_secret = sys.argv[2]
auth_code = sys.argv[3]

print("🔄 Exchanging authorization code for tokens...")

response = requests.post('https://www.strava.com/oauth/token', data={
    'client_id': client_id,
    'client_secret': client_secret,
    'code': auth_code,
    'grant_type': 'authorization_code'
})

if response.status_code != 200:
    print(f"❌ Error: {response.status_code}")
    print(response.text)
    sys.exit(1)

data = response.json()

credentials = {
    'client_id': client_id,
    'client_secret': client_secret,
    'refresh_token': data['refresh_token'],
    'access_token': data['access_token'],
    'token_expiry': data['expires_at'],
    'athlete_id': data['athlete']['id'],
    'athlete_username': data['athlete']['username']
}

# Spara credentials
creds_file = '/home/administrator/vayron/credentials/strava-api.json'
with open(creds_file, 'w') as f:
    json.dump(credentials, f, indent=2)

print(f"✅ Tokens saved to {creds_file}")
print(f"👤 Athlete: {data['athlete']['username']} (ID: {data['athlete']['id']})")
print(f"🔑 Refresh token: {data['refresh_token'][:20]}...")
print(f"⏰ Access token expires: {data['expires_at']}")
print("\n🎉 Setup complete! Ready to fetch activities.")
