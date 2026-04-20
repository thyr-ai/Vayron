#!/usr/bin/env python3
"""Debug: kolla vad scrapern faktiskt ser på en resultatsida."""

import requests
from bs4 import BeautifulSoup

BASE = "https://www.sportstiming.dk"

def fetch(url):
    r = requests.get(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    }, timeout=30)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")

url = f"{BASE}/event/16838/results"
soup = fetch(url)

# 1. Kolla alla select-element
print("=== SELECT-ELEMENT ===")
for sel in soup.find_all("select"):
    cls = sel.get("class", [])
    print(f"\n<select class='{cls}'>")
    for opt in sel.find_all("option"):
        print(f"  <option value='{opt.get('value', '')}'>{opt.get_text(strip=True)}</option>")

# 2. Kolla tabellens headers
print("\n=== TABELL-HEADERS ===")
table = soup.find("table")
if table:
    thead = table.find("thead")
    if thead:
        for th in thead.find_all("th"):
            print(f"  th: '{th.get_text(strip=True)}'  class={th.get('class','')}")

    # 3. Kolla första 3 rader
    print("\n=== FÖRSTA 3 RADER ===")
    for i, tr in enumerate(table.find_all("tr")[:5]):
        tds = tr.find_all("td")
        if not tds:
            continue
        print(f"\n  Rad {i}: {len(tds)} celler")
        for j, td in enumerate(tds):
            # Visa HTML-strukturen, inte bara text
            inner = str(td)[:200]
            text = td.get_text(strip=True)[:80]
            print(f"    [{j}] text='{text}'")
            # Kolla om det finns sub-element
            a = td.find("a")
            if a:
                print(f"         a.href='{a.get('href','')}'  a.text='{a.get_text(strip=True)[:50]}'")
            sub = td.find("table")
            if sub:
                print(f"         subtable: '{sub.get_text(strip=True)[:80]}'")
            spans = td.find_all("span")
            if spans:
                for s in spans:
                    print(f"         span: '{s.get_text(strip=True)[:50]}'  class={s.get('class','')}")

# 4. Kolla round-länkar
print("\n=== ROUND-LÄNKAR ===")
for a in soup.find_all("a", href=True):
    if "round=" in a["href"]:
        print(f"  {a['href']}  text='{a.get_text(strip=True)}'")

# 5. Kolla option med round
print("\n=== OPTION MED ROUND ===")
for o in soup.find_all("option"):
    v = o.get("value", "")
    if "round" in v.lower() or "rnd" in v.lower():
        print(f"  value='{v}'  text='{o.get_text(strip=True)}'")
