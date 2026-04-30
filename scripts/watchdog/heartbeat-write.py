#!/usr/bin/env python3
"""
heartbeat-write.py — gemensam heartbeat-skrivare för Vayron och BabyVayron.

Användning:
    ./heartbeat-write.py hermes
    ./heartbeat-write.py babyvayron

Skriver agentens timestamp till shared/monitoring/heartbeats.json och kollar
peerns ålder. Returnerar exit-kod 0 om allt OK, 1 om peer är död.
"""

import json
import os
import pathlib
import subprocess
import sys
import time

VAULT = pathlib.Path(os.environ.get("VAULT_PATH", "/home/administrator/Anteckningar"))
HEARTBEAT = VAULT / "shared" / "monitoring" / "heartbeats.json"
WATCHDOG_LOG = VAULT / "shared" / "monitoring" / "watchdog.md"
PEER_THRESHOLD = 7200  # 2h

VALID_AGENTS = {"hermes", "babyvayron"}


def main() -> int:
    if len(sys.argv) != 2 or sys.argv[1] not in VALID_AGENTS:
        print(f"Usage: {sys.argv[0]} {{hermes|babyvayron}}", file=sys.stderr)
        return 2

    agent = sys.argv[1]
    peer = "babyvayron" if agent == "hermes" else "hermes"
    now = int(time.time())
    iso = time.strftime("%Y-%m-%dT%H:%M:%S")

    # Läs aktuellt state
    if HEARTBEAT.exists():
        data = json.loads(HEARTBEAT.read_text())
    else:
        data = {}

    # Skriv egen timestamp
    data[agent] = {
        "ts": now,
        "iso": iso,
        "host": os.uname().nodename,
        "version": "1.0",
    }

    HEARTBEAT.write_text(json.dumps(data, indent=2) + "\n")

    # Peer-check
    peer_data = data.get(peer, {})
    peer_ts = peer_data.get("ts", 0)
    if peer_ts == 0:
        # Peer aldrig startad. Inte ett alarm i sig.
        return 0

    age = now - peer_ts
    if age > PEER_THRESHOLD:
        log_peer_death(agent, peer, age)
        if agent == "babyvayron":
            try_restart_peer(peer)
        return 1

    return 0


def log_peer_death(agent: str, peer: str, age: int) -> None:
    line = (
        f"\n- [{time.strftime('%Y-%m-%dT%H:%M:%S')}] [peer] {agent} upptäckte "
        f"{peer} död, ålder={age}s\n"
    )
    with WATCHDOG_LOG.open("a") as f:
        f.write(line)


def try_restart_peer(peer: str) -> None:
    try:
        subprocess.run(
            ["systemctl", "--user", "restart", f"{peer}.service"],
            check=False,
            timeout=10,
        )
    except Exception as e:
        with WATCHDOG_LOG.open("a") as f:
            f.write(f"\n- [restart-fail] {peer}: {e}\n")


if __name__ == "__main__":
    sys.exit(main())
