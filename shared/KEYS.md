# KEYS.md — API-nyckelöversikt

Inga faktiska nyckelvärden lagras här. Bash-kommandon för att uppdatera.

---

## Anthropic (Claude)
Används till: huvudmodell (Sonnet, Opus)
Status: ✅ Aktiv
Förnya: https://console.anthropic.com/settings/keys

```bash
openclaw config set auth.profiles.anthropic:default.apiKey sk-ant-XXX
openclaw gateway restart
```

---

## OpenRouter
Används till: fallback-modeller (Qwen, Llama)
Status: ✅ Aktiv
Förnya: https://openrouter.ai/keys

```bash
openclaw config set auth.profiles.openrouter:default.apiKey sk-or-XXX
openclaw gateway restart
```

---

## OpenAI
Används till: memory search (embeddings), Whisper, bildgenerering
Status: ⏳ Nyckel behöver bytas — struktur klar
Förnya: https://platform.openai.com/api-keys

```bash
# Byt ut platshållaren med din nya nyckel
sed -i 's/NEEDS_KEY/sk-proj-XXX/' ~/.openclaw/openclaw.json
openclaw gateway restart
```

---

## Brave Search
Används till: webbsökning
Status: ✅ Aktiv
Förnya: https://api.search.brave.com/

```bash
openclaw config set tools.web.search.apiKey BSA-XXX
openclaw gateway restart
```

---

## Telegram Bot
Används till: Telegram-kanal
Status: ✅ Aktiv
Förnya: Prata med @BotFather på Telegram

```bash
openclaw config set channels.telegram.botToken 123456:XXX
openclaw gateway restart
```

---

## ElevenLabs (TTS)
Används till: text-till-tal via sag-skill
Status: ✅ Konfigurerad
Förnya: https://elevenlabs.io/app/account

```bash
openclaw config set skills.entries.sag.apiKey XXX
openclaw gateway restart
```

---

_Senast uppdaterad: 2026-02-17_
