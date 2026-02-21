# 1Password SSH-setup för Git

**Status:** Planerat för söndag kväll 2026-02-22
**Mål:** Använda 1Password SSH-agent för säker Git-autentisering mot GitHub

---

## Översikt – fem steg

1. Skapa SSH-nyckel i 1Password
2. Lägg in public key på GitHub
3. Slå på 1Password SSH-agent
4. Konfigurera Git/SSH-klient
5. Testa och godkänn i 1Password

---

## Steg 1 – Skapa SSH-nyckel i 1Password

1. Öppna och lås upp 1Password-appen
2. Gå till din **Personal/Private/Employee**-vault
3. Välj **New Item → SSH Key**
4. Klicka **Add Private Key → Generate New Key**
5. Välj **Ed25519** (rekommenderat)
6. Klicka **Generate**, sedan **Save**

✅ Nu finns privat + publik nyckel lagrad i 1Password

---

## Steg 2 – Lägg in public key på GitHub

1. Gå till: `https://github.com/settings/ssh/new`
2. Klicka i fältet **Title** eller **Key** → 1Password-ikonen dyker upp
3. Välj SSH-nyckeln du skapade → public key fylls i automatiskt
4. Klicka **Add SSH Key**

✅ GitHub accepterar nu din nyckel för SSH-auth

---

## Steg 3 – Slå på 1Password SSH-agent

1. I 1Password-appen: välj ditt konto → **Settings → Developer**
2. Klicka **Set Up SSH Agent** och gå igenom dialogen
3. För att agenten ska leva i bakgrunden: **Settings → General → Keep 1Password in the notification area**

### Windows-specifikt:
- Inbyggda "OpenSSH Authentication Agent" måste stoppas
- Sätt tjänsten till **Disabled** och stoppa den
- Så 1Password får lyssna på `\\.\pipe\openssh-ssh-agent`

✅ 1Password SSH-agent är aktiv

---

## Steg 4 – Konfigurera Git/SSH-klient

### Windows:
```bash
git config --global core.sshCommand "C:/Windows/System32/OpenSSH/ssh.exe"
```

Eller i `.gitconfig`:
```ini
[core]
sshCommand = C:/Windows/System32/OpenSSH/ssh.exe
```

### Mac/Linux:
Ingen extra konfiguration behövs normalt (om 1Password-agenten är påslagen)

✅ Git använder nu rätt SSH-klient

---

## Steg 5 – Testa och godkänn

1. Testa anslutning:
```bash
ssh -T git@github.com
```

2. 1Password visar prompt → godkänn med Touch ID/Windows Hello/lösenord
3. Om det fungerar, se meddelande från GitHub om lyckad autentisering

### Klona Vayron-repot:
```bash
cd ~/Documents
git clone git@github.com:thyr-ai/Vayron.git
```

✅ Git pull/push fungerar via 1Password SSH-agent!

---

## Felsökning

**Om du INTE får prompt från 1Password:**
- Agenten är inte påslagen (kontrollera Settings → Developer)
- Git/SSH använder inte OpenSSH (Windows: kontrollera `core.sshCommand`)
- Fel remote-URL (ska vara `git@github.com:`, inte `https://`)

**Testa vilken SSH som används:**
```bash
which ssh        # Mac/Linux
where.exe ssh    # Windows
```

**Kontrollera att 1Password-agenten lyssnar:**
```bash
ssh-add -L       # ska lista nycklar från 1Password
```

---

## Inställningar i 1Password

**Settings → Developer:**
- **Godkännande per:** Applikation eller Applikation + Session
- **Giltighetstid:** Tills 1Password låser, tills avslutas, eller 4/12/24 timmar

---

## Efter setup

**Obsidian Git:**
- Kommer automatiskt använda samma 1Password SSH-agent
- Ingen extra konfiguration behövs
- Du godkänner första gången, sedan minns det

**VPS-sidan:**
- Använder Personal Access Token (HTTPS)
- Ingen ändring behövs

---

## Checklista för imorgon

- [ ] Skapa SSH-nyckel i 1Password
- [ ] Lägg till public key på GitHub
- [ ] Aktivera 1Password SSH-agent
- [ ] Konfigurera Git (om Windows)
- [ ] Testa `ssh -T git@github.com`
- [ ] Klona Vayron-repot
- [ ] Öppna som Obsidian vault
- [ ] Installera Obsidian Git plugin
- [ ] Testa sync

---

**Källor:** [1Password SSH Documentation](https://developer.1password.com/docs/ssh/get-started)
