const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')

const KEY_FILE = process.env.KEY_FILE
const CER_FILE = process.env.CER_FILE
const HTTP_PORT = process.env.HTTP_PORT
const HTTPS_PORT = process.env.HTTPS_PORT
const STATIC_DIR = process.env.STATIC_DIR

console.log(`Using SSL key file ${KEY_FILE}`)
console.log(`Using SSL certificate file ${CER_FILE}`)
console.log(`Using HTTP port ${HTTP_PORT}`)
console.log(`Using HTTPS port ${HTTPS_PORT}`)
console.log(`Using static directory ${STATIC_DIR}`)

// SSL-Zertifikat und Schlüsseldateien lesen
const options = {
	key: fs.readFileSync(KEY_FILE),
	cert: fs.readFileSync(CER_FILE)
}

// Eine Express-App erstellen
const app = express()

// Statische Dateien aus einem bestimmten Verzeichnis bedienen
app.use(express.static(STATIC_DIR));

// APIs einbinden
app.use('/api/filesystem', require('./api/filesystem'))


// Erstellen Sie einen HTTP-Server (für die Umleitung)
http.createServer((req, res) => {
	res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url })
	res.end()
}).listen(HTTP_PORT)

// Erstellen Sie einen HTTPS-Server
https.createServer(options, app).listen(HTTPS_PORT, () => {
	console.log('HTTPS-Server läuft auf Port ' + HTTPS_PORT)
})
