const express = require("express")
const fs = require("fs")
const path = require("path")
const multer = require('multer')
const upload = multer()

const FILESYSTEM_ROOT_DIR = process.env.FILESYSTEM_ROOT_DIR

const apiRouter = express.Router()

// Verzeichnisinhalt auflisten
// Response: [ { type: 'file' | 'folder', name }]
apiRouter.get('/list/*', (req, res) => {
    const fullPath = path.resolve(FILESYSTEM_ROOT_DIR, req.params[0])
    if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath)
        const response = files.map((filename) => {
            return {
                type: fs.lstatSync(path.resolve(fullPath, filename)).isDirectory() ? 'folder' : 'file',
                name: filename
            }
        })
        res.status(200).json(response)
    } else {
        res.sendStatus(404)
    }
})

// Datei herunterladen
apiRouter.get('/*', (req, res) => {
    const fullPath = path.resolve(FILESYSTEM_ROOT_DIR, req.params[0])
    if (fs.existsSync(fullPath)) {
        res.sendFile(fullPath, {})
    } else {
        res.sendStatus(404)
    }
})

// Datei oder Verzeichnis löschen
apiRouter.delete('/*', (req, res) => {
    const fullPath = path.resolve(FILESYSTEM_ROOT_DIR, req.params[0])
    fs.rm(fullPath, {force: true, recursive: true}, (err) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send('ok')
        }
    })
})

// Verzeichnis anlegen
apiRouter.post('/folder/*', (req, res) => {
    const fullPath = path.resolve(FILESYSTEM_ROOT_DIR, req.params[0])
    createPath(fullPath)
    res.status(200).send('ok')
})

// Datei speichern
apiRouter.post('/*', upload.any(), (req, res) => {
    const fullPath = path.resolve(FILESYSTEM_ROOT_DIR, req.params[0])
    createPath(path.dirname(fullPath))
    fs.writeFile(fullPath, req.files[0].buffer, (err) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send('ok')
        }
    })
})

module.exports = apiRouter