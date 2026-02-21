# Credentials

Denna mapp är för känsliga inloggningsuppgifter och API-nycklar.

## Säkerhet

⚠️ **Viktigt:** Filer i `credentials/` synkas INTE till GitHub (finns i `.gitignore`)

Du kan säkert skapa filer här lokalt på VPS:en eller via Obsidian - de stannar mellan dig och Vayron.

## Filformat

Skapa markdown-filer med relevanta credentials:

### Exempel: `one-com.md`

```markdown
# One.com Kontrollpanel

URL: https://www.one.com/admin/
Username: ditt-användarnamn
Password: ditt-lösenord

## Tillåtna actions
- Email-hantering
- VPS-översikt
- Hemsideuppladdning

## Förbjudna actions
- Köpa något (ALDRIG)
- Radera domäner/databaser
- DNS-ändringar utan godkännande
```

## Användning

När du skapar en credential-fil här, kan Vayron läsa den och använda informationen enligt GUARDRAILS.md-reglerna.

All användning loggas till SAFETY.md.
