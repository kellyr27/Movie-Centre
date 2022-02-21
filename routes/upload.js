const express = require('express')
const router = express.Router({mergeParams: true})
const path = require('path')

const csvConverter = require('../js/newCSVConverter')       // Function converts CSV data to a list of objects

// Display upload page
router.get('/', (req, res) => {
    res.render('upload', { pageTitle: 'Upload' });
})

// Upload file(s) and save Movies to database
router.post('/', async (req, res) => {

    // Saves files in the uploads directory
    function saveFiles (files) {
        return new Promise((res, rej) => {
            let uploadFiles = files.uploadFiles

            // Uploads and saves a file
            function uploadFile (fil) {
                fil.mv(path.join(__dirname, '../uploads/') + fil.name, (err) => {
                    if (err) {
                        return rej(err)
                    }
                })
            }

            // Check if any files were uploaded
            if (!files || Object.keys(files).length === 0) {
                return rej(err)
            }
            
            // If only one file was uploaded
            if (!Array.isArray(uploadFiles)) {
                uploadFile(uploadFiles)
                return res()
            }

            // If there are multiple files uploaded
            else {
                for (let file of uploadFiles) {
                    uploadFile(file)
                }
                return res()
            }
        })
    }

    await saveFiles(req.files)
    await csvConverter(false)

    res.redirect('/movies')
})

// Uploads seeds to database
router.post('/seed', async (req, res) => {

    await csvConverter(true)

    res.redirect('/movies')
})


module.exports = router