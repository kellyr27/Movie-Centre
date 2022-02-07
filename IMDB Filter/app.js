// Packages and frameworks
const express = require('express')                          // Web pplication framework
const fileUpload = require('express-fileupload')            // Middleware used to upload files with express
const methodOverride = require('method-override')           // Middleware used to use HTTP verbs such as PUT or DELETE
const { v4: uuid } = require('uuid')                        // Universally unique identifier for createdLists
const ejsMate = require('ejs-mate')                         // Use templating with EJS
const morgan = require('morgan')
// const mongoose = require('mongoose')
// const list = require('./models')

// mongoose.connect('mongodb://localhost:27017/imdb-filter', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Mongoose connection error: '))
// db.once('open', () => {
//     console.log('Database connected.')
// })

const path = require('path')                                // Path module
const fs = require('fs')                                    // File System module

// Personal libraries
const csv = require('../IMDB Filter/js/csvConverter.js')    // Function converts CSV data to a list of objects
const {Trie} = require('./js/trie.js')                    // Functions to create and search tries for searching
const {MovieList} = require('./js/movieList.js')


const app = express()
app.use(fileUpload())
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }))             // To parse form data in POST request body
app.use(express.json())                                     // To parse incoming JSON in POST request body
app.use(methodOverride('_method'))                          // To 'fake' put/patch/delete requests
app.set('view engine', 'ejs')                               // EJS set up
app.set('views', path.join(__dirname, 'views'))             // Views folder
app.engine('ejs', ejsMate)                                  // Use ejsMate with express

// Constants
const titles = ['Const_IMDB', 'Your Rating', 'Date Rated', 'Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Genres', 'Num Votes', 'Release Date', 'Directors']

// Variables
let masterMovieList = new MovieList()
let createdLists = []                                       // List of all lists created

// MIDDLEWARE
app.use((req, res, next) => {
    // console.log('Middleware')
    req.requestTime = Date.now()
    next()
})


// -------------------------------/UPLOAD-----------------------------------------------------------------------------------------

app.get('/upload', (req, res) => {
    res.render("upload", { pageTitle: "Upload" });
})

app.post('/upload', function(req, res) {
  
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.')
    }


    let uploadFiles = req.files.uploadFiles                               // The name of the input field ("uploadFiles") is used to retrieve the uploaded file
    let uploadPath = __dirname + '/uploads/'
    let newFiles = []
    
    // If only one file uploaded
    if (!Array.isArray(uploadFiles)) {
        newFiles.push(uploadFiles.name)
        
        uploadFiles.mv(uploadPath + uploadFiles.name, function(err) {                       // mv() method places the file somewhere in server
            if (err) {
                return res.status(500).send(err)
            }
        })
    }
    // If there are multiple files uploaded
    else {

        for (let file of uploadFiles) {
            newFiles.push(file.name)

            file.mv(uploadPath + file.name, function(err) {                       // mv() method places the file somewhere in server
                if (err) {
                    return res.status(500).send(err)
                }
            })
        }
    }

    res.redirect('/movies')

    setTimeout(() => {
        masterMovieList.create(csv(masterMovieList.activeList, false, newFiles))
    }, 2000)
})

app.post('/upload-test-data', function(req, res) {
    res.redirect('/movies')

    setTimeout(() => {

        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min)   //The maximum is inclusive and the minimum is inclusive
        }

        masterMovieList.create(csv([], true, []))

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

// -------------------------------/MOVIES-----------------------------------------------------------------------------------------

app.get('/movies', (req, res) => {

    masterMovieList.reset()
    res.render('movies', { displayList: masterMovieList, titles, isMasterList: true, pageTitle: 'Movies List'})
})


// Show movie details
app.get('/movies/:str', (req, res) => {

    console.log(req.route)
    const { str } = req.params
    if (str.startsWith('search')) {
        // Save search queries

        masterMovieList.search(req.query['q'])

        res.render('movies', { displayList: masterMovieList, titles, isMasterList: false, pageTitle: 'Search ' + req.query['q']})
    }
    else {

        const movie = masterMovieList.activeList.find(m => m["Const_IMDB"] === str)
        res.render('show', {movie, titles, displayList: createdLists, pageTitle: movie.Title})
    }
})

// -------------------------------/CREATED_LISTS-----------------------------------------------------------------------------------------


app.get('/created_lists', (req, res) => {
    res.render('./created_lists/index', {displayList: createdLists, pageTitle: 'Created Lists'})
})

app.get('/created_lists/new', (req, res) => {
    res.render('./created_lists/new', {displayList: masterMovieList, titles, pageTitle: 'Create new List'})
})

// Show selected list details
app.get('/created_lists/:id', (req, res) => {
    const { id } = req.params
    const selectedList = createdLists.find(m => m["id"] === id)
    res.render('./created_lists/show', {selectedList, pageTitle: selectedList.listName})
})

// Edit selected list page
app.get('/created_lists/:id/edit', (req, res) => {
    const { id } = req.params
    const selectedList = createdLists.find(m => m.id === id)
    res.render('./created_lists/edit', {selectedList, displayList: masterMovieList, titles, pageTitle: 'Edit List -' + selectedList.listName })
})

// Request to edit selected list
app.patch('/created_lists/:id', (req, res) => {
    const { id } = req.params

    // Updated parameters
    const newListName = req.body.listName
    const newMovies = JSON.parse(req.body.movies)

    const selectedList = createdLists.find(m => m.id === id)
    selectedList.listName = newListName
    selectedList.movies = newMovies
    
    res.redirect('/created_lists')
})

// Request to delete selected list
app.delete('/created_lists/:id', (req, res) => {
    const { id } = req.params
    createdLists = createdLists.filter(m => m.id !== id)
    res.redirect('/created_lists')
})

app.post('/created_lists', (req, res) => {
    let newList = {listName: req.body.listName, id: uuid(), movies: JSON.parse(req.body.movies)}
    createdLists.push(newList)
    res.redirect('/created_lists')
})

// -------------------------------SERVER/START-UP-----------------------------------------------------------------------------------------

app.listen(3000, () => {
    console.log('Listening on Port 3000')

    // Function deletes everything in /uploads folder
    const directory = path.join(__dirname, '/uploads')
    fs.readdir(directory, (err, files) => {
        if (err) {
            throw err
        }

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) {
                    throw err
                }
            })
        }
    })
})

// // Redirect routes to /movies
// app.get('*', (req, res) => {
//     res.redirect('/movies')
// })

app.use((req, res) => {
    res.status(404).send('Not found!')
})