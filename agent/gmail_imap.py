#!/usr/bin/env python3
"""
Gmail Reader using IMAP
Simpler than OAuth, works with app-specific password
"""

import imaplib
import email
from email.header import decode_header
import sys

# Credentials
EMAIL = "mattiasthyr@gmail.com"
# App-specific password from credentials/google.md
PASSWORD = "rnwcgddczxjhvfpe"

IMAP_SERVER = "imap.gmail.com"
IMAP_PORT = 993


def connect():
    """Connect to Gmail IMAP"""
    mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
    mail.login(EMAIL, PASSWORD)
    return mail


def list_unread(max_results=10):
    """List unread messages"""
    mail = connect()
    mail.select('INBOX')
    
    # Search for unread messages
    status, messages = mail.search(None, 'UNSEEN')
    
    if status != 'OK':
        print("Error searching for messages")
        return
    
    msg_ids = messages[0].split()
    
    if not msg_ids:
        print("No unread messages.")
        return
    
    # Limit results
    msg_ids = msg_ids[-max_results:]
    
    print(f"Found {len(msg_ids)} unread message(s):\n")
    
    for msg_id in reversed(msg_ids):  # Newest first
        status, msg_data = mail.fetch(msg_id, '(RFC822)')
        
        if status != 'OK':
            continue
        
        # Parse email
        msg = email.message_from_bytes(msg_data[0][1])
        
        # Decode subject
        subject = decode_header(msg['Subject'])[0][0]
        if isinstance(subject, bytes):
            subject = subject.decode()
        
        sender = msg['From']
        date = msg['Date']
        
        print(f"From: {sender}")
        print(f"Subject: {subject}")
        print(f"Date: {date}")
        print(f"ID: {msg_id.decode()}")
        print("-" * 80)
    
    mail.close()
    mail.logout()


def get_message(msg_id):
    """Get full message by ID"""
    mail = connect()
    mail.select('INBOX')
    
    status, msg_data = mail.fetch(msg_id.encode(), '(RFC822)')
    
    if status != 'OK':
        print(f"Error fetching message {msg_id}")
        return
    
    # Parse email
    msg = email.message_from_bytes(msg_data[0][1])
    
    # Decode subject
    subject = decode_header(msg['Subject'])[0][0]
    if isinstance(subject, bytes):
        subject = subject.decode()
    
    sender = msg['From']
    date = msg['Date']
    
    print(f"From: {sender}")
    print(f"Subject: {subject}")
    print(f"Date: {date}")
    print("\n" + "=" * 80 + "\n")
    
    # Get body
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type == 'text/plain':
                body = part.get_payload(decode=True).decode()
                print(body)
                break
    else:
        body = msg.get_payload(decode=True).decode()
        print(body)
    
    mail.close()
    mail.logout()


def search_messages(query, max_results=10):
    """Search messages"""
    mail = connect()
    mail.select('INBOX')
    
    # Convert query to IMAP search format
    # Simple support for common queries
    if query.startswith('from:'):
        sender = query.replace('from:', '').strip()
        imap_query = f'FROM "{sender}"'
    elif query.startswith('subject:'):
        subj = query.replace('subject:', '').strip()
        imap_query = f'SUBJECT "{subj}"'
    else:
        # Full text search
        imap_query = f'TEXT "{query}"'
    
    status, messages = mail.search(None, imap_query)
    
    if status != 'OK':
        print(f"Error searching for: {query}")
        return
    
    msg_ids = messages[0].split()
    
    if not msg_ids:
        print(f"No messages found for query: {query}")
        return
    
    # Limit results
    msg_ids = msg_ids[-max_results:]
    
    print(f"Found {len(msg_ids)} message(s) for query: {query}\n")
    
    for msg_id in reversed(msg_ids):
        status, msg_data = mail.fetch(msg_id, '(RFC822)')
        
        if status != 'OK':
            continue
        
        msg = email.message_from_bytes(msg_data[0][1])
        
        subject = decode_header(msg['Subject'])[0][0]
        if isinstance(subject, bytes):
            subject = subject.decode()
        
        sender = msg['From']
        date = msg['Date']
        
        print(f"From: {sender}")
        print(f"Subject: {subject}")
        print(f"Date: {date}")
        print(f"ID: {msg_id.decode()}")
        print("-" * 80)
    
    mail.close()
    mail.logout()


def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 gmail_imap.py unread [max_results]")
        print("  python3 gmail_imap.py get <message_id>")
        print("  python3 gmail_imap.py search <query> [max_results]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    try:
        if command == 'unread':
            max_results = int(sys.argv[2]) if len(sys.argv) > 2 else 10
            list_unread(max_results)
        
        elif command == 'get':
            if len(sys.argv) < 3:
                print("Error: Message ID required")
                sys.exit(1)
            msg_id = sys.argv[2]
            get_message(msg_id)
        
        elif command == 'search':
            if len(sys.argv) < 3:
                print("Error: Search query required")
                sys.exit(1)
            query = sys.argv[2]
            max_results = int(sys.argv[3]) if len(sys.argv) > 3 else 10
            search_messages(query, max_results)
        
        else:
            print(f"Unknown command: {command}")
            sys.exit(1)
    
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
