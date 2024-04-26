# APIs

## filesystem

Verwendet Umgebungsvariable `FILESYSTEM_ROOT_DIR`.

|Methode|Endpoint|Beschreibung|
|---|---|---|
|GET|`/api/filesystem/list/*`|Verzeichnisinhalt auflisten|
|GET|`/api/filesystem/*`|Datei herunterladen|
|DELETE|`/api/filesystem/*`|Datei oder Verzeichnis (rekursiv) löschen|
|POST|`/api/filesystem/folder/*`|Verzeichnis erstellen|
|POST|`/api/filesystem/*`|Datei hochladen|
