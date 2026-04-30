# Systemd setup för Vayron och BabyVayron

För att agenterna ska kunna restartas av watchdog och köra på schema, sätt upp dem som systemd user-services.

## Vayron som service

`~/.config/systemd/user/hermes.service`:

```ini
[Unit]
Description=Vayron Agent
After=network-online.target

[Service]
Type=simple
WorkingDirectory=/home/administrator/hermes
EnvironmentFile=/home/administrator/hermes/.env
ExecStart=/home/administrator/hermes/run.sh
Restart=on-failure
RestartSec=30s

[Install]
WantedBy=default.target
```

Aktivera:

```bash
systemctl --user daemon-reload
systemctl --user enable hermes.service
systemctl --user start hermes.service
systemctl --user status hermes.service
```

## BabyVayron som timer (var 15:e min)

`~/.config/systemd/user/babyvayron.service`:

```ini
[Unit]
Description=BabyVayron tick

[Service]
Type=oneshot
WorkingDirectory=/home/administrator/babyvayron
EnvironmentFile=/home/administrator/babyvayron/.env
ExecStart=/home/administrator/babyvayron/tick.sh
```

`~/.config/systemd/user/babyvayron.timer`:

```ini
[Unit]
Description=BabyVayron tick var 15:e minut

[Timer]
OnBootSec=5min
OnUnitActiveSec=15min
Persistent=true

[Install]
WantedBy=timers.target
```

Aktivera:

```bash
systemctl --user daemon-reload
systemctl --user enable babyvayron.timer
systemctl --user start babyvayron.timer
systemctl --user list-timers | grep babyvayron
```

## Lingerförsäkring

Så att user-services kör även när du inte är inloggad:

```bash
sudo loginctl enable-linger administrator
```

## Logs

```bash
journalctl --user -u hermes.service -f
journalctl --user -u babyvayron.service -n 50
```

## Restart från watchdog

External-watchdog.sh kallar `systemctl --user restart hermes.service`. Det kräver att skriptet körs som administrator-user. Om watchdog körs som root: använd `sudo -u administrator systemctl --user restart hermes.service` istället.
