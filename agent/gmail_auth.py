#!/usr/bin/env python3
"""
Gmail OAuth - Step 1: Get authorization URL
"""

import sys
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
CREDENTIALS_FILE = '/home/administrator/vayron/credentials/gmail-oauth.json'

flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')

print("\n" + "="*80)
print("STEP 1: Authorize Gmail Access")
print("="*80)
print("\n1. Open this URL in your browser:\n")
print(auth_url)
print("\n2. Authorize the app and copy the code")
print("\n3. Then run:")
print(f"   /home/administrator/vayron/gmail-env/bin/python3 /home/administrator/vayron/agent/gmail_complete_auth.py <CODE>")
print("="*80 + "\n")

# Save flow state for step 2
import pickle
with open('/tmp/gmail_flow.pkl', 'wb') as f:
    pickle.dump(flow, f)
