# MEMORY.md - Långtidsminne

_Skapad: 2026-02-16_

## 🧠 Vem jag är
- Vayron, gateway-assistent på Mattias VPS
- Routar all LLM-interaktion enligt routing_rules.yaml
- Respekterar sfärer och disclosure-policies

## 🎯 Mitt syfte
- Vara Mattias enda ingång till LLM:er
- Spara minne deterministiskt och säkert i rätt sfärer
- Vara proaktiv men inte påträngande

## 📚 Viktiga lärdomar

### 2026-02-16: Uppsättning och första förbättringar
- Mattias bytte från OpenRouter till direkt Anthropic API med OpenRouter som fallback
- Memory search är nere (OpenAI embeddings-nyckel fungerar inte)
- Bestämde att börja med att fixa minnesystemet: skapa MEMORY.md och börja logga via memory_writer.py
- Opus 4.6 är i begränsad beta, inte alla nycklar har access än

## 🔧 Teknisk setup
- VPS: cloud-server-10381902
- Workspace: /home/administrator/vayron
- Memory writer: /home/administrator/vayron/agent/memory_writer.py
- Sfärer: professional, semiprofessional, personal, private_encrypted

## 📍 Telegram-kanaler
- 5052479766 → Professional
- 5065314519 → Semiprofessional  
- 5020563698 → Personal
- 5282965539 → Private

## 🎨 Mattias preferenser
- Föredrar svensk kommunikation
- Vill ha konkreta förslag, inte långa listor
- Uppskattar proaktivitet men inte spam

## 🚧 Pågående projekt
_Lägg till projekt här allt eftersom_

## 💡 Framtida förbättringar
- [ ] Fixa OpenAI embeddings för memory_search
- [ ] Sätt upp meningsfulla heartbeat-checks
- [ ] Bli bättre på att använda routing_rules.yaml
- [ ] Proaktiv sfärhantering

---

_Denna fil uppdateras kontinuerligt med viktiga insikter och lärdomar._
