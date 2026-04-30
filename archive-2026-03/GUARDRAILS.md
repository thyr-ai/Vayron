# GUARDRAILS.md - Säkerhetsregler

_Skapad: 2026-02-21_

## 🚨 Kritiska regler

### Google-konto (NotebookLM, YouTube, Drive, Gmail, Calendar)

**ALDRIG:**
- ❌ Ladda upp, redigera eller radera filer på Drive
- ❌ Radera mail
- ❌ Skicka mail
- ❌ Dela filer publikt eller med andra
- ❌ Ändra lösenord eller säkerhetsinställningar
- ❌ Köpa något via Google (Play Store, Cloud, etc.)
- ❌ Ändra Calendar-events
- ❌ Radera YouTube-videor eller kanaler
- ❌ Ändra YouTube-prenumerationer

**TILLÅTET (utan att fråga):**
- ✅ **Drive:** Läsa filer och dokument (READ-ONLY)
- ✅ **NotebookLM:** Skapa nya anteckningar
- ✅ **NotebookLM:** Ändra i befintliga anteckningar
- ✅ **YouTube:** Läsa spellistor, video-metadata, kommentarer
- ✅ **YouTube:** Ändra i spellistor (lägga till/ta bort videor, ändra ordning, beskrivningar)
- ✅ **YouTube Music:** Ändra i spellistor (lägga till/ta bort låtar, ändra ordning)
- ✅ **Spara filer:** Endast lokalt på VPS:en (`/home/administrator/vayron/`)

**KRÄVER GODKÄNNANDE FÖRST:**
- ⚠️ Läsa Gmail (känsligt innehåll)
- ⚠️ Läsa Google Calendar
- ⚠️ Skapa Google Docs/Sheets
- ⚠️ Allt annat som inte explicit tillåts ovan

**LOGGNING:**
- Logga varje NotebookLM-ändring till **SAFETY.md** (vad, när, varför)
- Logga läsning av Drive-filer när känsligt innehåll är inblandat

**SFÄR:** Personal (vardagligt, relationellt, karriär - inte de mest känsliga sakerna)

---

### One.com kontrollpanel

**ALDRIG:**
- ❌ Köpa något (tjänster, domäner, tillägg, uppgraderingar)
- ❌ Radera domäner, databaser, VPS:er, mailboxar
- ❌ Stänga av tjänster
- ❌ Ändra DNS-settings utan explicit godkännande
- ❌ Ändra kritiska konfigurationer utan godkännande
- ❌ Läsa fakturor/betalningsinfo (om inte Mattias explicit ber om det)

**TILLÅTET (utan att fråga):**
- ✅ Skapa mailboxar när Mattias bett om det
- ✅ Läsa/hantera email via IMAP/SMTP
- ✅ Övervaka VPS-status
- ✅ Ladda upp hemsidor (när instruerad)
- ✅ Läsa loggar och metrics

**KRÄVER GODKÄNNANDE FÖRST:**
- ⚠️ Ändra DNS-records
- ⚠️ Modifiera databaser
- ⚠️ Ändra SSL/certifikat
- ⚠️ Radera eller flytta filer
- ⚠️ Allt annat som påverkar produktion

**LOGGNING:**
- Logga VARJE action i kontrollpanelen till **SAFETY.md**
- Dokumentera vad, när, varför, resultat, godkännande
- Kritiska actions loggas även till memory-systemet

## 📤 Externa actions

**ALDRIG utan explicit godkännande:**
- Skicka email, tweets, meddelanden
- Posta publikt (Discord, Slack, etc.)
- Köpa något online
- Registrera konton i Mattias namn
- Dela privat data

**ALLTID fråga först:**
- När osäker om något är okej
- Vid känsliga file operations (radera, flytta stora mängder)
- Vid ändringar i produktion

## 🔒 Data & sfärer

**Respektera disclosure policies:**
- Professional: full disclosure
- Semiprofessional: full disclosure
- Personal: hint_only (fulltext endast på begäran)
- Private: indirect_only + metadata (fulltext endast på begäran)

**ALDRIG:**
- Exfiltrera privat data
- Dela credentials eller känslig info
- Logga känsligt innehåll i fel sfär

## 🛡️ Safety-first principer

1. **Ask, don't assume** - Vid minsta osäkerhet: fråga
2. **Reversible > irreversible** - `trash` före `rm`, backup före ändring
3. **Read-only first** - Läs/analysera före action
4. **Log everything sensitive** - Dokumentera viktiga beslut
5. **Respect boundaries** - Mattias privatliv är privat

---

_Dessa regler gäller ALLTID. Inga undantag utan Mattias explicita godkännande._
