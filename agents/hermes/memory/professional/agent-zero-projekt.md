# Projekt: Emilies Assistent (OpenClaw)

_Startat: 2026-02-18_

## Bakgrund
Emilie är restaurangchef på Sapa restaurangen (Compass Group, Hydros faciliteter, Vetlanda).
Kör ensam till jobbet — vill använda pendlingstiden för att frigöra tankar.
**Arkitektur: OpenClaw (samma som Vayron) — inte Agent Zero.**

## Hennes vardag
- Restaurangchef med en kock och en kallskänka
- Serverar luncher dagligen, frukost på fredagar
- Pendlar bil till Vetlanda
- Behöver: schema, inköp, tankar/idéer, kommunikation

## Hur hon använder assistenten
- Skickar röstmeddelanden i bilen → Whisper transkriberar → assistent svarar
- TTS (ElevenLabs/SAG) läser svaret tillbaka — helt handsfree
- Frigör tankar: idéer, påminnelser, planeringar på väg till jobbet

---

## Teknisk plan

### Steg 1 — Ny Telegram-bot för Emilie
- Skapa ny bot via @BotFather
- Separat kanal från Vayron

### Steg 2 — Agent i OpenClaw
Alternativ A: Ny agent i befintlig OpenClaw-instans (lättare)
Alternativ B: Separat OpenClaw-instans (mer isolerat)
**Rekommendation: Alternativ A till att börja med**

### Steg 3 — SOUL.md för Emilie
- Fokus på restaurang, schema, snabba svar
- Röstvänlig: korta meningar, inga listor i svar
- Svenska hela vägen

### Steg 4 — TTS aktiverat
- SAG (ElevenLabs) redan konfigurerat på servern
- Behöver aktiveras för Emilies kanal

---

## Att göra
- [ ] Emilie skapar en Telegram-bot (@BotFather) — eller Mattias gör det åt henne
- [ ] Lägg till boten i openclaw-konfigen som ny agent
- [ ] Skriv SOUL.md och USER.md för Emilie
- [ ] Testa röstflöde: röstmedd → Whisper → svar → TTS

---

## Resurser
- BotFather: https://t.me/botfather
- SAG/ElevenLabs: redan konfigurerat i skills.entries.sag
