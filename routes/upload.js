const express = require('express')
const router = express.Router()
const path = require('path')
const csvConverter = require('../js/newCSVConverter')    // Function converts CSV data to a list of objects
const fs = require('fs')

// Display upload page
router.get('/', (req, res) => {
    res.render('upload', { pageTitle: 'Upload' });
})

// Upload file(s) and save Movies to database
router.post('/', (req, res) => {
    
    const uploadsDirectory = path.join(__dirname, '../uploads/')

    // Saves files in the uploads directory
    function saveFiles (files) {
        let uploadFiles = files.uploadFiles

        // Uploads and saves a file
        function uploadFile (fil) {
            fil.mv(uploadsDirectory + fil.name, (err) => {
                if (err) {
                    return res.status(500).send(err)
                }
            })
        }

        // Check if any files were uploaded
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).send('No files were uploaded.')
        }
        
        // If only one file was uploaded
        if (!Array.isArray(uploadFiles)) {
            uploadFile(uploadFiles)
        }

        // If there are multiple files uploaded
        else {
            for (let file of uploadFiles) {
                uploadFile(file)
            }
        }
    }

    saveFiles(req.files)
    csvConverter(false)

    res.redirect('/movies')
})

// Uploads seeds to database
router.post('/seed', function(req, res) {

    csvConverter(true)

    res.redirect('/movies')
})

module.exports = router