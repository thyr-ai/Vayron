# TODO - Vayron

**Skapad:** 2026-02-14

## Pågående

### Memory-automatisering från Telegram-grupper
**Mål:** Automatiskt spara konversationer från Telegram till memory/*.md

**Steg:**
1. ✅ Kartlagt gruppmappning (Professional/Semi/Personal/Private)
2. ⏳ Förstå `memory_writer.py` - vilket JSON-format den förväntar
3. ⏳ Besluta sparstrategi:
   - Manuellt (på begäran)
   - Automatiskt (heartbeat/cron)
   - On-demand (jag föreslår när viktigt)
4. ⏳ Implementera format:
   - Konversationstext från grupp
   - Sfär (auto från chat-ID)
   - Metadata (datum, deltagare, ämne)
5. ⏳ Sätt upp automatisering (valfritt)

**Kommandon att köra:**
```bash
cat /home/administrator/vayron/agent/memory_writer.py
```

---

### Weiron-röstprojekt (ElevenLabs)
**Status:** Ljud nedladdat, väntar på voice cloning

**Nästa steg:**
1. ✅ Laddat ner YouTube-klipp (13MB, 3 filer)
2. ⏳ Klippa rent tal från ljud
3. ⏳ Kombinera till 1-3 min sample
4. ⏳ Logga in ElevenLabs (GitHub)
5. ⏳ Ladda upp och klona röst

**Filer:**
- `/home/administrator/vayron/weiron_voice/weiron_avenyn.mp3`
- `/home/administrator/vayron/weiron_voice/weiron_folktoppen.mp3`
- `/home/administrator/vayron/weiron_voice/weiron_nilecity.mp3`

---

## Framtida idéer

- Multi-agent setup i kanaler?
- Routing-rules.yaml integration med kanaler
- Memory-search över alla sfärer samtidigt

---

## Klart ✅

- Telegram-kanaler uppsatta (4st)
- Chat-ID mappning sparad i TOOLS.md
- CV sparat till professional
- Biografi sparad till personal
- Kärnfilosofi dokumenterad
