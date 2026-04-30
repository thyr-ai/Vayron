#!/usr/bin/env python3
"""
check-agents.py — Lager 3 watchdog för Cowork.

Läser shared/monitoring/heartbeats.json och visar status.
Körs antingen direkt från terminalen eller via Cowork som en /agents-check.

Användning:
    python3 check-agents.py
    python3 check-agents.py --json  # för parsning av Cowork
"""

import argparse
import json
import pathlib
import sys
import time

# Försök hitta vaulten oavsett vilken maskin du sitter på
CANDIDATES = [
    pathlib.Path.home() / "Obsidian" / "Anteckningar",
    pathlib.Path.home() / "Anteckningar",
    pathlib.Path("/home/administrator/Anteckningar"),
    pathlib.Path("C:/Users/Ägaren/Obsidian/Anteckningar"),
]


def find_vault() -> pathlib.Path:
    for c in CANDIDATES:
        if (c / "shared" / "monitoring" / "heartbeats.json").exists():
            return c
    print("Hittar inte vaulten. Lägg till sökvägen i CANDIDATES.", file=sys.stderr)
    sys.exit(1)


def humanize(seconds: int) -> str:
    if seconds < 60:
        return f"{seconds}s"
    if seconds < 3600:
        return f"{seconds // 60}min"
    if seconds < 86400:
        return f"{seconds // 3600}h {(seconds % 3600) // 60}min"
    return f"{seconds // 86400}d {(seconds % 86400) // 3600}h"


def status_for(age: int) -> str:
    if age > 21600:
        return "🚨 DEAD"
    if age > 7200:
        return "⚠️  STALE"
    if age > 1800:
        return "🟡 LATE"
    return "✅ OK"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="Output i JSON")
    args = parser.parse_args()

    vault = find_vault()
    heartbeat_path = vault / "shared" / "monitoring" / "heartbeats.json"
    watchdog_path = vault / "shared" / "monitoring" / "watchdog.md"

    data = json.loads(heartbeat_path.read_text())
    now = int(time.time())

    out = {}
    for agent in ("hermes", "babyvayron"):
        info = data.get(agent, {})
        ts = info.get("ts", 0)
        if ts == 0:
            out[agent] = {"status": "NEVER", "age_s": None, "iso": "aldrig"}
        else:
            age = now - ts
            out[agent] = {
                "status": status_for(age),
                "age_s": age,
                "age_human": humanize(age),
                "iso": info.get("iso"),
                "host": info.get("host"),
            }

    # Sista 5 incidenter
    incidents = []
    if watchdog_path.exists():
        lines = watchdog_path.read_text().splitlines()
        for line in lines:
            if line.startswith("- [") and "incident" in line.lower() or "DEAD" in line.upper():
                incidents.append(line)
    out["incidents_recent"] = incidents[-5:]

    if args.json:
        print(json.dumps(out, indent=2, ensure_ascii=False))
        return 0

    # Mänskligt format
    print("=" * 50)
    print(f"Agent-status, {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    for agent in ("hermes", "babyvayron"):
        info = out[agent]
        if info.get("age_s") is None:
            print(f"{agent:14s} {info['status']}  (aldrig startad)")
        else:
            print(
                f"{agent:14s} {info['status']}  senaste: {info['age_human']} "
                f"sedan ({info['iso']})"
            )
    if out["incidents_recent"]:
        print("\nSenaste incidenter:")
        for i in out["incidents_recent"]:
            print(f"  {i}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
