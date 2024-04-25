# nodejs-webserver
Webserver mit HTTPS, Subdomains und statischen Dateien

## Vorbereitung

NodeJS auf Linux Server installieren

```
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

- SSL Zertifikatdateien `.cer` und  `.pem` erstellen
- Dieses Repository klonen

## Benutzer anlegen und Rechte vergeben

Es sollte für den Webserver ein eigener Benutzer und eine eigene Gruppe erstellt werden.
Die Gruppe erhält anschließend nur lesenden Zugriff auf den Repository-Ordner.

```
sudo adduser webserver webserver --disabled-password --disabled-login
sudo chown -R :webserver /var/github/hilderonny/nodejs-webserver
sudo chmod -R g-w /var/github/hilderonny/nodejs-webserver
```

## Installation

Abhängigkeiten installieren

```
cd nodejs-webserver
npm ci
```

Hintergrunddienst erstellen, indem eine Datei `/etc/systemd/system/webserver.service` mit folgendem Inhalt angelegt wird.

```
[Unit]
Description=NodeJS Webserver

[Service]
ExecStart=/usr/bin/node /var/github/hilderonny/nodejs-webserver/server.js
Restart=always
User=webserver
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
Environment=HTTP_PORT=80
Environment=HTTPS_PORT=443
Environment=CER_FILE=/etc/certificate.cer
Environment=KEY_FILE=/etc/certificate.key
Environment=STATIC_DIR=/var/www
WorkingDirectory=/var/github/hilderonny/nodejs-webserver/

[Install]
WantedBy=multi-user.target
```

Webserver Bindugnsrechte an Port 80 vergeben

```
sudo apt install libcap2-bin
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
```

Hintergrunddienst registrieren und starten

```
sudo systemctl daemon-reload
sudo systemctl start webserver
sudo systemctl enable webserver
```
