#!/usr/bin/env python3
"""
Gmail Reader using Gmail API
Requires: pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
"""

import os
import sys
import json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import base64
from email.mime.text import MIMEText

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

CREDENTIALS_FILE = '/home/administrator/vayron/credentials/gmail-oauth.json'
TOKEN_FILE = '/home/administrator/vayron/credentials/gmail-token.json'


def get_service():
    """Authenticate and return Gmail API service."""
    creds = None
    
    # Token file stores the user's access and refresh tokens
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            # Manual OAuth for headless servers
            flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
            auth_url, _ = flow.authorization_url(prompt='consent')
            
            print("\n" + "="*80)
            print("MANUAL OAUTH REQUIRED")
            print("="*80)
            print("\n1. Open this URL in your browser:\n")
            print(auth_url)
            print("\n2. Authorize the app")
            print("3. Copy the authorization code\n")
            code = input("Enter the authorization code: ").strip()
            
            flow.fetch_token(code=code)
            creds = flow.credentials
        
        # Save the credentials for the next run
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    
    return build('gmail', 'v1', credentials=creds)


def list_unread(service, max_results=10):
    """List unread messages."""
    try:
        results = service.users().messages().list(
            userId='me',
            q='is:unread',
            maxResults=max_results
        ).execute()
        
        messages = results.get('messages', [])
        
        if not messages:
            print('No unread messages.')
            return []
        
        print(f'Found {len(messages)} unread message(s):\n')
        
        for msg in messages:
            message = service.users().messages().get(userId='me', id=msg['id']).execute()
            headers = message['payload']['headers']
            
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
            sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
            date = next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown')
            
            print(f"From: {sender}")
            print(f"Subject: {subject}")
            print(f"Date: {date}")
            print(f"ID: {msg['id']}")
            print("-" * 80)
        
        return messages
    
    except HttpError as error:
        print(f'An error occurred: {error}')
        return []


def get_message(service, msg_id):
    """Get full message by ID."""
    try:
        message = service.users().messages().get(userId='me', id=msg_id, format='full').execute()
        
        headers = message['payload']['headers']
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
        date = next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown')
        
        print(f"From: {sender}")
        print(f"Subject: {subject}")
        print(f"Date: {date}")
        print("\n" + "=" * 80 + "\n")
        
        # Get body
        if 'parts' in message['payload']:
            parts = message['payload']['parts']
            data = parts[0]['body'].get('data', '')
        else:
            data = message['payload']['body'].get('data', '')
        
        if data:
            body = base64.urlsafe_b64decode(data).decode('utf-8')
            print(body)
        else:
            print("(No body content)")
        
        return message
    
    except HttpError as error:
        print(f'An error occurred: {error}')
        return None


def search_messages(service, query, max_results=10):
    """Search messages with query."""
    try:
        results = service.users().messages().list(
            userId='me',
            q=query,
            maxResults=max_results
        ).execute()
        
        messages = results.get('messages', [])
        
        if not messages:
            print(f'No messages found for query: {query}')
            return []
        
        print(f'Found {len(messages)} message(s) for query: {query}\n')
        
        for msg in messages:
            message = service.users().messages().get(userId='me', id=msg['id']).execute()
            headers = message['payload']['headers']
            
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
            sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
            date = next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown')
            
            print(f"From: {sender}")
            print(f"Subject: {subject}")
            print(f"Date: {date}")
            print(f"ID: {msg['id']}")
            print("-" * 80)
        
        return messages
    
    except HttpError as error:
        print(f'An error occurred: {error}')
        return []


def main():
    """Main function."""
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"Error: Credentials file not found at {CREDENTIALS_FILE}")
        print("Please download OAuth credentials from Google Cloud Console.")
        sys.exit(1)
    
    service = get_service()
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 gmail_reader.py unread [max_results]")
        print("  python3 gmail_reader.py get <message_id>")
        print("  python3 gmail_reader.py search <query> [max_results]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'unread':
        max_results = int(sys.argv[2]) if len(sys.argv) > 2 else 10
        list_unread(service, max_results)
    
    elif command == 'get':
        if len(sys.argv) < 3:
            print("Error: Message ID required")
            sys.exit(1)
        msg_id = sys.argv[2]
        get_message(service, msg_id)
    
    elif command == 'search':
        if len(sys.argv) < 3:
            print("Error: Search query required")
            sys.exit(1)
        query = sys.argv[2]
        max_results = int(sys.argv[3]) if len(sys.argv) > 3 else 10
        search_messages(service, query, max_results)
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == '__main__':
    main()
