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
Environment=HTTP_PORT=80
Environment=HTTPS_PORT=443
Environment=CER_FILE=/etc/certificate.cer
Environment=KEY_FILE=/etc/certificate.key
Environment=STATIC_DIR=/var/www
Environment=FILESYSTEM_ROOT_DIR=/var/files
WorkingDirectory=/var/github/hilderonny/nodejs-webserver/
StandardOutput=syslog
SyslogIdentifier=webserver

[Install]
WantedBy=multi-user.target
```

|Umgebungsvariable|Beschreibung|
|---|---|
|PATH|Pfad, in welchen nach `node` gesucht wird|
|HTTP_PORT|HTTP Port, an dem der Server lauschen soll (80)|
|HTTPS_PORT|HTTPS Port, an dem der Server lauschen soll (443)|
|CER_FILE|Vollständiger Pfad der SSL-Zertifikatsdatei (Identität)|
|KEY_FILE|Vollständiger Pfad zum public key des SSL Zertifikats|
|STATIC_DIR|Pfad zu den statischen HTML-Seiten|
|FILESYSTEM_ROOT_DIR|Stammverzeichnis, welches für die `filesystem` API verwendet wird|

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
