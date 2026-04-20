# CLAUDE-PROJEKT-SYNK.md

## SYFTE
Automatisk hämtning och loggning av projektstatus från Claude via CLI-agent-kommunikation. Integrerar med befintligt minnessystem:
- MISTAKES.md (vid kommunikationsfel)
- PROJEKTSTATUS.md (vid framstegsuppdateringar)
- DAGBOK-YYYY-MM-DD.md (dagliga loggar)

## STRUKTUR

### 1. API-ACCESS
- **Hämta API-nyckel från 1Password** med:   
  `fetch-1password-item` → item="Claude-API-Key" → field="password"

### 2. FRÅGEFORMAT TILL CLAUDE
- **Prompt:** "Returnera status på alla pågående arbetsuppgifter: Projekt, % klar, blockerare, nästa steg. Formatera som JSON."

### 3. AUTOMATISK UPPDATERING
- Används i cron-jobs för tidsstyrd synkning
- Skriv nyckeldata till: `~/Vayron/Assistent-Delat/CURRENT_CLAUDE_STATUS.json`
- Skriv fullständig svar till: `~/Vayron/Assistent-Delat/CURRENT_CLAUDE_RAW.md`

### 4. MISSTANDSHANTERING
- Vid misslyckat API-kall:
  - Logga i MISTAKES.md med: `datum`, `felmeddelande`, `lösning`-format
  - Försök igen efter 30 minuter

## IMPLEMENTERING

### 1. SKRIV SKRIPT FÖR KOMMUNIKATION
```python
from hermes_tools import fetch_1password_item, terminal
import json
import requests

def get_claude_status():
    # Hämta API-nyckel från 1Password
    api_key = fetch_1password_item(item="Claude-API-Key", field="password")

    # Skicka förfrågan till Claude
    headers = {"content-type": "application/json", "x-api-key": api_key}
    payload = {
        "model": "claude-3-opus-20240229",
        "messages": [{
            "role": "user",
            "content": "Returnera status på alla pågående arbetsuppgifter: Projekt, % klar, blockerare, nästa steg. Formatera som JSON."
        }]
    }

    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            data=json.dumps(payload)
        ).json()

        # Processa svar
        if "content" in response:
            # Skriv till JSON
            json_path = "~/Vayron/Assistent-Delat/CURRENT_CLAUDE_STATUS.json"
            terminal(f"echo '{response['content']}' > {json_path}")

            # Skriv till MD
            md_path = "~/Vayron/Assistent-Delat/CURRENT_CLAUDE_RAW.md"
            terminal(f"echo '# Fullständigt Svar från Claude\n{str(response)}' > {md_path}")

            return {"status": "success", "data": response['content']}
        
        return {"status": "error", "message": "Inget innehåll i Claude-svar"}

    except Exception as e:
        # Logga fel i MISTAKES.md
        terminal(f"echo '* {time} - API-kommunikation med Claude misslyckades: {str(e)}' >> ~/Vayron/MISTAKES.md")
        return {"status": "error", "message": str(e)}
```