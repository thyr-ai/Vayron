#!/usr/bin/env python3
"""
X/Twitter Bookmarks Scraper (Proof of Concept)
NOTE: Kräver cookies från inloggad session
"""
import sys
sys.path.insert(0, '/home/administrator/vayron/scrapling-env/lib/python3.12/site-packages')

import json
from datetime import datetime
from scrapling.fetchers import StealthyFetcher

def scrape_x_bookmarks(username, cookies_file=None):
    """
    Scrapa X bookmarks för en användare
    
    Args:
        username: X username (e.g., 'mattiasthyr')
        cookies_file: Path till cookies.json (från autentiserad session)
    """
    url = f"https://x.com/{username}/bookmarks"
    
    print(f"🐦 Scraping X bookmarks for @{username}...")
    print(f"   URL: {url}")
    
    # Load cookies if provided
    cookies = None
    if cookies_file:
        with open(cookies_file, 'r') as f:
            cookies = json.load(f)
    
    try:
        # Fetch with stealth mode
        page = StealthyFetcher.fetch(
            url, 
            headless=True,
            google_search=False,  # Don't simulate Google search
            network_idle=True,     # Wait for network to be idle
        )
        
        # Try to find tweet elements (adaptive selector)
        tweets = page.css('article[data-testid="tweet"]', adaptive=True)
        
        print(f"\n✅ Found {len(tweets)} tweets")
        
        # Extract tweet data
        bookmarks = []
        for i, tweet in enumerate(tweets[:5], 1):  # First 5 for testing
            text = tweet.css('[data-testid="tweetText"]::text').get() or "No text"
            author = tweet.css('[data-testid="User-Name"] span::text').get() or "Unknown"
            
            bookmarks.append({
                "text": text[:200],  # First 200 chars
                "author": author,
                "scraped_at": datetime.now().isoformat()
            })
            
            print(f"\n   {i}. @{author}")
            print(f"      {text[:100]}...")
        
        # Save results
        output_file = f'/home/administrator/vayron/scrapling-tools/x_bookmarks_{username}.json'
        with open(output_file, 'w') as f:
            json.dump(bookmarks, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Saved to: {output_file}")
        
        return bookmarks
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def scrape_public_timeline(username):
    """
    Scrapa offentlig timeline (utan inloggning)
    Enklare test för att verifiera att scraping fungerar
    """
    url = f"https://x.com/{username}"
    
    print(f"🐦 Scraping public timeline for @{username}...")
    print(f"   URL: {url}\n")
    
    try:
        page = StealthyFetcher.fetch(url, headless=True, network_idle=True)
        
        # Try different selectors (X ändrar ofta struktur)
        tweets = page.css('article', adaptive=True)
        
        print(f"✅ Found {len(tweets)} tweets/articles on page")
        
        # Extract some data
        if tweets:
            print("\n📝 Sample content:")
            for i, tweet in enumerate(tweets[:3], 1):
                text = tweet.css('div[lang]::text').get() or "No text found"
                print(f"   {i}. {text[:150]}...")
        
        return len(tweets)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 0

if __name__ == "__main__":
    # Test med offentlig timeline först
    print("=" * 60)
    print("TEST 1: Public Timeline (No auth required)")
    print("=" * 60)
    scrape_public_timeline("mattiasthyr")
    
    print("\n\n" + "=" * 60)
    print("TEST 2: Bookmarks (Requires auth)")
    print("=" * 60)
    print("⚠️  NOTE: This will likely fail without proper cookies")
    print("    To make it work, we need to:")
    print("    1. Export cookies from logged-in X session")
    print("    2. Pass cookies to StealthyFetcher")
    print("=" * 60)
    # Uncomment when you have cookies:
    # scrape_x_bookmarks("mattiasthyr", cookies_file="x_cookies.json")
