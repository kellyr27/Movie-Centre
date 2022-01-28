// Packages and frameworks
const express = require('express')                          // Web pplication framework
const fileUpload = require('express-fileupload')            // Middleware used to upload files with express
const methodOverride = require('method-override')           // Middleware used to use HTTP verbs such as PUT or DELETE
const { v4: uuid } = require('uuid')                        // Universally unique identifier for createdLists
const ejsMate = require('ejs-mate')                         // Use templating with EJS

const path = require('path')                                // Path module
const fs = require('fs')                                    // File System module

// Personal libraries
const csv = require('../IMDB Filter/js/csvConverter.js')    // Function converts CSV data to a list of objects
const {Trie} = require('./js/trie.js')                    // Functions to create and search tries for searching
const {MovieList} = require('./js/movieList.js')


const app = express()
app.use(fileUpload())
app.use(express.urlencoded({ extended: true }))             // To parse form data in POST request body
app.use(express.json())                                     // To parse incoming JSON in POST request body
app.use(methodOverride('_method'))                          // To 'fake' put/patch/delete requests
app.set('views', path.join(__dirname, 'views'))             // Views folder
app.set('view engine', 'ejs')                               // EJS set up
app.engine('ejs', ejsMate)                                  // Use ejsMate with express

// Constants
const titles = ['Const_IMDB', 'Your Rating', 'Date Rated', 'Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Genres', 'Num Votes', 'Release Date', 'Directors']

// Variables
let masterMovieList = new MovieList()

let searchTrie                                              // Trie of the masterList                   // DEFUNCT - TO REMOVE
let masterList = []                                         // List of all movies uploaded              // DEFUNCT - TO REMOVE --- = masterMoveList.activeList
let createdLists = []                                       // List of all lists created
let searchResults = []                                                                                  // DEFUNCT - TO REMOVE
let currentCreatedList = []
let currentTypedListName = []
let currentSearchSortFilters = {
    search: [],
    sort: [],
    filters: []
}
// Functions

// Removes duplicates
function addMovieToCurrentList(currentList, addMovie) {
    let found = false

    for (let i = 0; i < currentList.length; i++) {
        if (currentList[i]['Const_IMDB'] === addMovie['Const_IMDB']) {
            found = true
        }
    }

    if (!found) {
        currentList.push(addMovie)
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// -------------------------------/UPLOAD-----------------------------------------------------------------------------------------

app.get('/upload', (req, res) => {
    res.render('upload')
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
        masterMovieList.create(csv(masterList, false, newFiles))

        // DEFUNCT
        masterList = csv(masterList, false, newFiles)                             // 2 second delay to convert the uploaded file to the masterList
        searchResults = masterList
        searchTrie = new Trie(searchResults)


    }, 2000)
})

app.post('/upload-test-data', function(req, res) {
    res.redirect('/movies')

    setTimeout(() => {
        masterMovieList.create(csv([], true, []))

        // DEFUNCT - 3 LINES
        masterList = csv([], true, [])                             // 2 second delay to convert the uploaded file to the masterList
        searchResults = masterList
        searchTrie = new Trie(searchResults)
        
        // Create random lists
        // let testListNames = ['apple', 'KELLY27', '9873', 'Banana', 'X12Tron']

        // for (let name of testListNames) {
        //     let testMovies = []

        //     for (let i = 0; i < getRandomIntInclusive(10, 35); i++) {
        //         let j = getRandomIntInclusive(0, 51)
        //         addMovieToCurrentList(testMovies, masterList[j])
        //     }

        //     createdLists.push({listName: name, id: uuid(), movies: testMovies})
        // }
    }, 2000)

})

// -------------------------------/MOVIES-----------------------------------------------------------------------------------------

app.get('/movies', (req, res) => {

    currentSearchSortFilters = {
        search: [],
        sort: [],
        filters: []
    }

    masterMovieList.reset()
    res.render('movies', { displayList: masterMovieList, titles, isMasterList: true})
})

// Show movie details
app.get('/movies/:str', (req, res) => {
    const { str } = req.params
    if (str.startsWith('search')) {
        // Save search queries

        
        // currentSearchSortFilters.search.push(req.query['q'])
        // console.log(currentSearchSortFilters)
        // masterMovieList.queryChange(currentSearchSortFilters)
        masterMovieList.search(req.query['q'])

        res.render('movies', { displayList: masterMovieList, titles, isMasterList: false})
    }
    else {
        const movie = masterList.find(m => m["Const_IMDB"] === str)
        res.render('show', {movie, titles, displayList: createdLists})
    }
})

// -------------------------------/CREATED_LISTS-----------------------------------------------------------------------------------------

app.get('/created_lists', (req, res) => {
    res.render('./created_lists/index', {displayList: createdLists})
})

app.get('/created_lists/new', (req, res) => {
    currentCreatedList = []
    res.render('./created_lists/new', {displayList: masterMovieList, currentCreatedList, currentTypedListName, titles})
    console.log();
})

app.post('/created_lists/new', (req, res) => {
    const { addID, currentTypedListName } = req.body
    let foundMovie = searchResults.find(m => m['Const_IMDB'] === addID)

    // Checking for duplicates
    addMovieToCurrentList(currentCreatedList, foundMovie)
    res.render('./created_lists/new', {searchResults: masterMovieList.activeList, currentCreatedList, currentTypedListName})
})

// Show selected list details
app.get('/created_lists/:id', (req, res) => {
    const { id } = req.params
    const selectedList = createdLists.find(m => m["id"] === id)
    res.render('./created_lists/show', {selectedList})
})

// Edit selected list page
app.get('/created_lists/:id/edit', (req, res) => {
    const { id } = req.params
    const selectedList = createdLists.find(m => m.id === id)
    res.render('./created_lists/edit', {selectedList})
})

// Request to edit selected list
app.patch('/created_lists/:id', (req, res) => {
    const { id } = req.params
    const newListName = req.body.editName
    const selectedList = createdLists.find(m => m.id === id)
    selectedList.listName = newListName
    res.redirect('/created_lists')
})

// Request to delete selected list
app.delete('/created_lists/:id', (req, res) => {
    const { id } = req.params
    createdLists = createdLists.filter(m => m.id !== id)
    res.redirect('/created_lists')
})

// Request to create a new list
app.post('/created_lists', (req, res) => {
    const {listName} = req.body
    let newList = {listName: listName, id: uuid(), movies: currentCreatedList}
    createdLists.push(newList)
    currentCreatedList = []
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

// Redirect routes to /movies
app.get('*', (req, res) => {
    res.redirect('/movies')
})