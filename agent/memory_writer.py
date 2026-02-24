#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import hashlib
import uuid
import sys
from datetime import datetime, timezone
from pathlib import Path

BASE = Path("/home/administrator/vayron")
MEMORY = BASE / "memory"

VALID_SPHERES = {"professional", "semiprofessional", "personal", "private_encrypted"}
VALID_INTENTS = {"code", "strategic_analysis", "general"}

def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()

def sha256_text(s: str) -> str:
    return "sha256:" + hashlib.sha256(s.encode("utf-8")).hexdigest()

def target_dir(sphere: str) -> Path:
    mapping = {
        "professional": MEMORY / "professional",
        "semiprofessional": MEMORY / "semiprofessional",
        "personal": MEMORY / "personal",
        "private_encrypted": MEMORY / "private_encrypted",
    }
    return mapping.get(sphere, MEMORY / "private_encrypted")

def disclosure_for(sphere: str) -> str:
    if sphere == "personal":
        return "hint_only"
    if sphere == "private_encrypted":
        return "indirect_only"
    return "full"

def normalize(payload: dict) -> dict:
    # Accept both "sphere" and "sphere_guess"
    if "sphere" in payload and "sphere_guess" not in payload:
        payload["sphere_guess"] = payload["sphere"]
    
    # Accept "content" as shorthand for "full_text"
    if "content" in payload and "full_text" not in payload:
        payload["full_text"] = payload["content"]
    
    payload.setdefault("summary", "")
    payload.setdefault("full_text", "")
    payload.setdefault("insights", [])
    payload.setdefault("followups", [])
    payload.setdefault("intent", "general")
    payload.setdefault("sphere_guess", "private_encrypted")
    payload.setdefault("sensitivity", "medium")
    payload.setdefault("source_provider", "unknown")
    payload.setdefault("source_model", "unknown")
    payload.setdefault("routing_rule_version", "1.0")

    if payload["intent"] not in VALID_INTENTS:
        payload["intent"] = "general"

    if payload["sphere_guess"] not in VALID_SPHERES:
        payload["sphere_guess"] = "private_encrypted"

    # Fail-safe: high sensitivity => private_encrypted
    if payload.get("sensitivity") == "high":
        payload["sphere_guess"] = "private_encrypted"

    if not isinstance(payload.get("insights"), list):
        payload["insights"] = []
    if not isinstance(payload.get("followups"), list):
        payload["followups"] = []

    return payload

def write_md(payload: dict) -> Path:
    payload = normalize(payload)

    u = str(uuid.uuid4())
    created_at = iso_now()
    sphere = payload["sphere_guess"]
    intent = payload["intent"]
    disclosure = disclosure_for(sphere)

    content_blob = json.dumps(payload, ensure_ascii=False, sort_keys=True)
    content_hash = sha256_text(content_blob)

    summary = (payload.get("summary") or "").strip()
    full_text = (payload.get("full_text") or "").strip()
    insights = payload.get("insights") or []
    followups = payload.get("followups") or []

    md = []
    md.append("---")
    md.append(f"uuid: {u}")
    md.append(f"created_at: {created_at}")
    md.append(f"sphere: {sphere}")
    md.append(f"intent: {intent}")
    md.append(f"source_provider: {payload.get('source_provider')}")
    md.append(f"source_model: {payload.get('source_model')}")
    md.append(f"routing_rule_version: {payload.get('routing_rule_version')}")
    md.append(f"content_hash: {content_hash}")
    md.append(f"disclosure: {disclosure}")
    md.append("---\n")
    md.append("## Sammanfattning\n" + summary + "\n")
    md.append("## Fulltext\n" + full_text + "\n")
    md.append("## Härledda insikter")
    for x in insights:
        md.append(f"- {str(x)}")
    md.append("\n## Föreslagna uppföljningar")
    for x in followups:
        md.append(f"- {str(x)}")
    md.append("")

    out_dir = target_dir(sphere)
    out_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{created_at.replace(':','-')}_{u}.md"
    out_path = out_dir / filename
    out_path.write_text("\n".join(md), encoding="utf-8")

    return out_path

def main() -> int:
    try:
        raw = sys.stdin.read()
        payload = json.loads(raw)
    except Exception as e:
        print(f"Invalid JSON on stdin: {e}", file=sys.stderr)
        return 2

    path = write_md(payload)
    print(str(path))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
