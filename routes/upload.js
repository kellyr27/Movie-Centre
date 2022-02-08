const express = require('express')
const router = express.Router()
const csvConverter = require('../js/newCSVConverter')    // Function converts CSV data to a list of objects

// Display upload page
router.get('/', (req, res) => {
    res.render("upload", { pageTitle: "Upload" });
})

// Upload file(s) and save Movies to database
router.post('/', (req, res) => {
    
    function saveFiles () {
        let uploadFiles = req.files.uploadFiles
        let uploadPath = __dirname + '/uploads/'

        // Check if any files were uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.')
        }
        
        // If only one file was uploaded
        if (!Array.isArray(uploadFiles)) {
            
            uploadFiles.mv(uploadPath + uploadFiles.name, function(err) {
                if (err) {
                    return res.status(500).send(err)
                }
            })
        }

        // If there are multiple files uploaded
        else {

            for (let file of uploadFiles) {

                file.mv(uploadPath + file.name, function(err) {
                    if (err) {
                        return res.status(500).send(err)
                    }
                })
            }
        }
    }

    saveFiles()
    csvConverter(false)

    res.redirect('/movies')
})

// Uploads seeds to database
router.post('/seed', function(req, res) {
    res.redirect('/movies')

    setTimeout(() => {

        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min)   //The maximum is inclusive and the minimum is inclusive
        }

        // masterMovieList.create(csv([], true, []))

        // Create random lists
        // let testListNames = ['apple', 'KELLY27', '9873', 'Banana', 'X12Tron']

        // for (let name of testListNames) {
        //     let testMovies = []

        //     for (let i = 0; i < getRandomIntInclusive(10, 35); i++) {
        //         let j = getRandomIntInclusive(0, 51)
        //         addMovieToCurrentList(testMovies, masterMovieList.activeList[j])
        //     }

        //     createdLists.push({listName: name, id: uuid(), movies: testMovies})
        // }

    }, 2000)

})

module.exports = router