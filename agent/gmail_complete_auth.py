#!/usr/bin/env python3
"""
Gmail OAuth - Step 2: Complete authorization with code
"""

import sys
import pickle

TOKEN_FILE = '/home/administrator/vayron/credentials/gmail-token.json'

if len(sys.argv) < 2:
    print("Usage: gmail_complete_auth.py <authorization_code>")
    sys.exit(1)

code = sys.argv[1].strip()

# Load flow from step 1
with open('/tmp/gmail_flow.pkl', 'rb') as f:
    flow = pickle.load(f)

# Exchange code for token
flow.fetch_token(code=code)
creds = flow.credentials

# Save token
with open(TOKEN_FILE, 'w') as token:
    token.write(creds.to_json())

print("\n✅ Authorization complete! Token saved to:", TOKEN_FILE)
print("\nYou can now use:")
print("   /home/administrator/vayron/agent/gmail unread 10")
print("   /home/administrator/vayron/agent/gmail search 'from:someone@example.com'")
print()
