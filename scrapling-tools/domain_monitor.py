#!/usr/bin/env python3
"""
Domän-monitoring med Scrapling
Kollar alla Mattias domäner: uptime, SSL-status, sidladdningstid
"""
import sys
sys.path.insert(0, '/home/administrator/vayron/scrapling-env/lib/python3.12/site-packages')

import time
import json
from datetime import datetime
from scrapling.fetchers import Fetcher

DOMAINS = [
    "blendljusdesign.se",
    "ckgc.cc",
    "cykelluffarn.se",
    "godabud.se",
    "konfident.se",
    "livepodden.se",
    "lokalfotograf.se",
    "nassjogp.bike",
    "ovning.se",
    "thyr.se",
    "voilavelo.fr"
]

def check_domain(domain):
    """Kolla en domän och returnera status"""
    url = f"https://{domain}"
    start_time = time.time()
    
    try:
        page = Fetcher.get(url, timeout=10)
        load_time = time.time() - start_time
        
        # Extrahera titel
        title = page.css('title::text').get() or "No title"
        
        # Kolla efter common error patterns
        is_error = any([
            '404' in title.lower(),
            'not found' in title.lower(),
            'error' in title.lower(),
            page.status != 200
        ])
        
        return {
            "domain": domain,
            "status": "error" if is_error else "ok",
            "http_code": page.status,
            "load_time": round(load_time, 2),
            "title": title[:100],  # First 100 chars
            "ssl": url.startswith('https://'),
            "checked_at": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "domain": domain,
            "status": "down",
            "error": str(e),
            "checked_at": datetime.now().isoformat()
        }

def monitor_all_domains():
    """Kolla alla domäner"""
    results = []
    
    print(f"🔍 Checking {len(DOMAINS)} domains...\n")
    
    for domain in DOMAINS:
        print(f"   Checking {domain}...", end=" ")
        result = check_domain(domain)
        results.append(result)
        
        if result['status'] == 'ok':
            print(f"✅ {result['load_time']}s")
        elif result['status'] == 'error':
            print(f"⚠️  Error (HTTP {result['http_code']})")
        else:
            print(f"❌ Down - {result.get('error', 'Unknown')}")
    
    # Save results
    output_file = '/home/administrator/vayron/scrapling-tools/domain_status.json'
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to: {output_file}")
    
    # Summary
    ok_count = sum(1 for r in results if r['status'] == 'ok')
    error_count = sum(1 for r in results if r['status'] == 'error')
    down_count = sum(1 for r in results if r['status'] == 'down')
    
    print(f"\n📊 Summary:")
    print(f"   ✅ OK: {ok_count}")
    print(f"   ⚠️  Errors: {error_count}")
    print(f"   ❌ Down: {down_count}")
    
    return results

if __name__ == "__main__":
    monitor_all_domains()
