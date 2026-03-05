#!/usr/bin/env python3
"""
Live X Bookmarks Scraper för Mission Control
Scraper tre konton parallellt och returnerar unified JSON
"""
import sys
sys.path.insert(0, '/home/administrator/vayron/scrapling-env/lib/python3.12/site-packages')

import json
import asyncio
import time
from datetime import datetime
from scrapling.fetchers import StealthyFetcher

# Enable adaptive mode globally
StealthyFetcher.adaptive = True

ACCOUNTS = {
    "mattiasthyr": {
        "name": "Mattias Thyr",
        "handle": "mattiasthyr",
        "color": "blue"
    },
    "ovningse": {
        "name": "Övning",
        "handle": "ovningse",
        "color": "green"
    },
    "Konfidentse": {
        "name": "Konfident",
        "handle": "Konfidentse",
        "color": "yellow"
    }
}

def scrape_x_profile(handle):
    """
    Scraper en X-profil (public timeline för nu, bookmarks kräver cookies)
    """
    url = f"https://x.com/{handle}"
    
    try:
        print(f"🐦 Scraping @{handle}...", flush=True)
        
        page = StealthyFetcher.fetch(
            url,
            headless=True,
            google_search=False,
            network_idle=True,
            timeout=30000  # 30 seconds in milliseconds
        )
        
        # Wait a bit for dynamic content to load
        time.sleep(3)
        
        # Try multiple selectors for tweets
        articles = page.css('article[data-testid="tweet"]')
        if not articles:
            articles = page.css('article[role="article"]')
        if not articles:
            articles = page.css('article')
        if not articles:
            articles = page.css('div[data-testid="cellInnerDiv"]')
        
        bookmarks = []
        for article in articles[:20]:  # Max 20 tweets
            # Försök extrahera text
            text_elem = article.css('[data-testid="tweetText"]')
            if not text_elem:
                text_elem = article.css('div[lang]')
            
            text = text_elem.css('::text').get() if text_elem else None
            if not text or len(text.strip()) < 5:
                continue
            
            # Försök hitta author
            author_elem = article.css('[data-testid="User-Name"]')
            author = author_elem.css('span::text').get() if author_elem else handle
            
            # Försök hitta link
            link_elem = article.css('a[href*="/status/"]')
            link = f"https://x.com{link_elem.attrib.get('href', '')}" if link_elem else f"https://x.com/{handle}"
            
            bookmarks.append({
                "text": text[:500],  # Max 500 chars
                "author": author or handle,
                "accountHandle": handle,
                "accountUsername": ACCOUNTS[handle]["name"],
                "url": link,
                "date": datetime.now().isoformat(),
                "id": f"{handle}_{len(bookmarks)}"
            })
        
        print(f"   ✅ Found {len(bookmarks)} tweets from @{handle}", flush=True)
        return bookmarks
        
    except Exception as e:
        print(f"   ❌ Error scraping @{handle}: {e}", flush=True)
        return []

def scrape_all_accounts():
    """Scraper alla tre konton"""
    all_bookmarks = []
    
    for handle in ACCOUNTS.keys():
        bookmarks = scrape_x_profile(handle)
        all_bookmarks.extend(bookmarks)
    
    return all_bookmarks

if __name__ == "__main__":
    print("🚀 Starting X Live Scraper...\n", flush=True)
    
    bookmarks = scrape_all_accounts()
    
    # Save results
    output_file = '/home/administrator/vayron/mission-control-web/public/x-live-bookmarks.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(bookmarks, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Scraped {len(bookmarks)} total tweets")
    print(f"💾 Saved to: {output_file}")
    
    # Also save account info
    accounts_output = '/home/administrator/vayron/mission-control-web/public/x-accounts.json'
    accounts_list = [
        {"username": h, "name": ACCOUNTS[h]["name"], "count": len([b for b in bookmarks if b['accountHandle'] == h])}
        for h in ACCOUNTS.keys()
    ]
    with open(accounts_output, 'w', encoding='utf-8') as f:
        json.dump(accounts_list, f, indent=2, ensure_ascii=False)
