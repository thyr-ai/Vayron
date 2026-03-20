#!/usr/bin/env python3
"""
Gmail Sender using SMTP
Works with app-specific password
"""

import smtplib
from email.message import EmailMessage
import sys

# Credentials
EMAIL = "mattiasthyr@gmail.com"
PASSWORD = "rnwcgddczxjhvfpe"  # App-specific password

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465


# Standard signature (signatur 1)
SIGNATURE = """
Med glada hälsningar,
Mattias

------- __O
----- _\<, 
--- (_)/ (_)
"""


def send_email(to_email, subject, body, greeting=None, add_signature=True):
    """Send an email with optional greeting and signature"""
    msg = EmailMessage()
    msg["From"] = EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    
    # Build the message
    if greeting:
        full_body = f"{greeting}\n\n{body}"
    else:
        full_body = body
    
    # Add signature if requested
    if add_signature:
        full_body = f"{full_body}\n\n{SIGNATURE}"
    
    msg.set_content(full_body)
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.login(EMAIL, PASSWORD)
        smtp.send_message(msg)
    
    return True


def main():
    if len(sys.argv) < 4:
        print("Usage: gmail_send.py <to> <subject> <body> [greeting]")
        sys.exit(1)
    
    to_email = sys.argv[1]
    subject = sys.argv[2]
    body = sys.argv[3]
    greeting = sys.argv[4] if len(sys.argv) > 4 else None
    
    send_email(to_email, subject, body, greeting)
    print(f"Email sent to {to_email}")


if __name__ == "__main__":
    main()
