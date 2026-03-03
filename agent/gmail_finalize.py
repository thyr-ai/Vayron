#!/usr/bin/env python3
"""
Gmail OAuth - Finalize with authorization code
"""

import sys
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
CREDENTIALS_FILE = '/home/administrator/vayron/credentials/gmail-oauth.json'
TOKEN_FILE = '/home/administrator/vayron/credentials/gmail-token.json'

if len(sys.argv) < 2:
    print("Usage: gmail_finalize.py <authorization_code>")
    sys.exit(1)

code = sys.argv[1].strip()

# Recreate flow
flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'

# Exchange code for token
try:
    flow.fetch_token(code=code)
    creds = flow.credentials
    
    # Save token
    with open(TOKEN_FILE, 'w') as token:
        token.write(creds.to_json())
    
    print("\n✅ Authorization complete! Token saved.")
    print("\nYou can now use:")
    print("   /home/administrator/vayron/agent/gmail unread 10")
    print()
except Exception as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)
