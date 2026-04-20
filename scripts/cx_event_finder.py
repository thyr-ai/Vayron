#!/usr/bin/env python3
"""
Hittar alla CX-events på Sportstiming.dk sedan 2018.
Skriver ut event_id, namn, sport-typ, datum.
"""

import requests
from bs4 import BeautifulSoup
import re
import time
import json

BASE = "https://www.sportstiming.dk"
DELAY = 1.5

# CX-relaterade nyckelord i eventnamn
CX_KEYWORDS = [
    "cyclocross", "cyklecross", "cykelcross", "cross-cup", "crosscup",
    "cross cup", "cyklokross", " cx ", "cx ", " cx", "cross4life",
    "börjessons cx", "hagströmska cx", "musettecross", "fristads cx",
    "varberg cx", "malmö cx", "stockholm cx", "täby park",
    "sm cykelcross", "dm cyklecross", "dm cykelcross",
    "cash & kaniner", "challenge cup", "challenge cross",
    "grote prijs", "party prijs", "crosstosseløbet",
    "sjællandsmesterskab", "cross på heden", "cross jfm",
    "erling hansen", "pas normal studios cyclocross",
    "fredericia cc cross", "fredericia kanalbyen cross",
    "abc jjensen", "holbæk cross", "cx næstved",
    "cx amager", "cx skrænten", "crosscup", "cross cup",
    "nisseringen",
]

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept-Language": "sv-SE,sv;q=0.9",
})


def is_cx_event(name):
    nl = name.lower()
    return any(kw in nl for kw in CX_KEYWORDS)


def scrape_page(url):
    """Scrapa en sida med events, returnera (events, nästa-sida-url)."""
    r = session.get(url, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    events = []
    for tr in soup.find_all("tr"):
        link = tr.find("a", href=re.compile(r"/event/\d+"))
        if not link:
            continue
        href = link["href"]
        m = re.search(r"/event/(\d+)", href)
        if not m:
            continue
        eid = int(m.group(1))
        name = link.get_text(strip=True)

        # Hitta sport-typ (ikon alt-text eller text i cellen)
        sport_img = tr.find("img", alt=True)
        sport = sport_img["alt"] if sport_img else ""

        # Datum
        tds = tr.find_all("td")
        date_text = tds[0].get_text(strip=True) if tds else ""

        events.append({
            "id": eid,
            "name": name,
            "sport": sport,
            "date_text": date_text,
        })

    # Hitta nästa sida
    next_url = None
    # Leta efter paginering
    for a in soup.find_all("a", href=True):
        if "page=" in a["href"] or "»" in a.get_text() or "next" in a.get_text().lower():
            txt = a.get_text(strip=True)
            if txt in ("»", "Nästa", "Next", "›"):
                next_url = BASE + a["href"] if a["href"].startswith("/") else a["href"]
                break

    return events, next_url


def main():
    # Scrapa "past events" sidor
    # Sportstiming visar alla events sorterat, vi vill ha historiska
    page = 1
    all_cx = []
    existing_ids = set()

    while True:
        url = f"{BASE}/events?past=true&page={page}"
        print(f"Sida {page}: {url}")

        try:
            events, _ = scrape_page(url)
        except Exception as e:
            print(f"  FEL: {e}")
            break

        if not events:
            print("  Inga events, klart!")
            break

        cx_on_page = []
        for ev in events:
            # Filtrera på sport-typ ELLER nyckelord i namn
            is_cx = (
                ev["sport"].lower() in ("cykelcross", "cyklecross", "cyclocross")
                or is_cx_event(ev["name"])
            )
            if is_cx and ev["id"] not in existing_ids:
                cx_on_page.append(ev)
                existing_ids.add(ev["id"])

        if cx_on_page:
            print(f"  Hittade {len(cx_on_page)} CX-events:")
            for ev in cx_on_page:
                print(f"    {ev['id']:6}  {ev['name'][:60]:60}  {ev['sport']:15}  {ev['date_text']}")
                all_cx.append(ev)

        # Kolla om vi har gått förbi 2018
        # Om sista eventet på sidan har år < 2018 i datumtexten, sluta
        last_date = events[-1]["date_text"] if events else ""
        if "2017" in last_date or "2016" in last_date:
            print("  Nådde 2017, stoppar.")
            break

        page += 1
        time.sleep(DELAY)

        if page > 50:  # Säkerhetsgräns
            print("  Max sidor nådda.")
            break

    print(f"\n{'='*70}")
    print(f"Totalt: {len(all_cx)} CX-events hittade")
    print(f"{'='*70}")

    # Spara som JSON
    with open("cx_discovered_events.json", "w", encoding="utf-8") as f:
        json.dump(all_cx, f, ensure_ascii=False, indent=2)
    print("Sparad i cx_discovered_events.json")

    # Skriv ut i EVENTS-format för copy-paste
    print("\n# Python EVENTS-format (kopiera till scriptet):")
    for ev in all_cx:
        # Försök extrahera datum som YYYY-MM-DD (behöver manuell kontroll)
        print(f'    ({ev["id"]}, "{ev["name"]}", "???", "????-??-??"),')


if __name__ == "__main__":
    main()
