# Workspace och minne

Workspace:
- /home/administrator/vayron

Minnesmappar:
- /home/administrator/vayron/memory/professional
- /home/administrator/vayron/memory/semiprofessional
- /home/administrator/vayron/memory/personal
- /home/administrator/vayron/memory/private_encrypted

Spara till minne:
- Skrivning sker via exec: python3 /home/administrator/vayron/agent/memory_writer.py
- Input: JSON på stdin
- Output: filväg till skapad markdownfil

# Telegram-kanalstruktur

**Chat-ID → Sfär-mappning:**
- **5052479766** → Professional (offentlig upphandling, affärsstrategier, semiprofessional-projekt som blir företag)
- **5065314519** → Semiprofessional (cykel, hockey, bandy, kreativa projekt, tech-experiment)
- **5020563698** → Personal (CV, karriärplanering, familj, kontakter, nätverk, vardagligt)
- **5282965539** → Private (känsligt, krypterat, endast Mattias)

**Disclosure-policy:**
- Professional: full disclosure
- Semiprofessional: full disclosure
- Personal: hint_only (fulltext på begäran)
- Private: indirect_only + metadata (fulltext på begäran)
