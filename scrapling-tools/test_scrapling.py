#!/usr/bin/env python3
"""Test Scrapling installation"""
import sys
sys.path.insert(0, '/home/administrator/vayron/scrapling-env/lib/python3.12/site-packages')

from scrapling.fetchers import Fetcher, StealthyFetcher

# Test 1: Simple HTTP fetch
print("🧪 Test 1: Simple HTTP fetch...")
page = Fetcher.get('https://quotes.toscrape.com/')
quotes = page.css('.quote .text::text').getall()
print(f"   ✅ Found {len(quotes)} quotes")

# Test 2: Stealth mode
print("\n🧪 Test 2: Stealth mode...")
page = StealthyFetcher.fetch('https://httpbin.org/headers', headless=True)
headers = page.text
print(f"   ✅ Stealth fetch successful ({len(headers)} chars)")

print("\n🎉 All tests passed! Scrapling is ready to use.")
