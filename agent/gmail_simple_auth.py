#!/usr/bin/env python3
"""
Gmail OAuth - Simple flow without PKCE
"""

import sys
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
CREDENTIALS_FILE = '/home/administrator/vayron/credentials/gmail-oauth.json'
TOKEN_FILE = '/home/administrator/vayron/credentials/gmail-token.json'

# Create flow without PKCE
flow = InstalledAppFlow.from_client_secrets_file(
    CREDENTIALS_FILE,
    SCOPES,
    redirect_uri='urn:ietf:wg:oauth:2.0:oob'
)

if len(sys.argv) < 2:
    # Step 1: Generate URL
    auth_url, _ = flow.authorization_url(
        prompt='consent',
        access_type='offline',
        include_granted_scopes='true'
    )
    
    print("\n" + "="*80)
    print("GMAIL AUTHORIZATION")
    print("="*80)
    print("\n1. Open this URL in your browser:\n")
    print(auth_url)
    print("\n2. Authorize and copy the code")
    print("\n3. Run: /home/administrator/vayron/gmail-env/bin/python3")
    print("   /home/administrator/vayron/agent/gmail_simple_auth.py <CODE>")
    print("="*80 + "\n")
else:
    # Step 2: Exchange code for token
    code = sys.argv[1].strip()
    
    try:
        flow.fetch_token(code=code)
        creds = flow.credentials
        
        # Save token
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
        
        print("\n✅ Success! Gmail access configured.")
        print("\nTest with:")
        print("   /home/administrator/vayron/agent/gmail unread 5")
        print()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
