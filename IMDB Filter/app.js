// Packages and frameworks
const express = require('express')                          // Web pplication framework
const fileUpload = require('express-fileupload')            // Middleware used to upload files with express
const methodOverride = require('method-override')           // Middleware used to use HTTP verbs such as PUT or DELETE
const { v4: uuid } = require('uuid')                        // Universally unique identifier for created_lists
const ejsMate = require('ejs-mate')                         // Use templating with EJS

const path = require('path')                                // Path module
const fs = require('fs')                                    // File System module

// Personal libraries
const csv = require('../IMDB Filter/js/csvMaster.js')                       // Function converts CSV data to a list of objects
const {searchTrie, createTrie} = require('../IMDB Filter/js/trie.js')       // Functions to create and search tries for searching

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
let master_trie
let master_list = []                                        // List of all movies uploaded
let created_lists = []                                      // List of all lists created
let search_results = []

// -------------------------------/UPLOAD-----------------------------------------------------------------------------------------

app.get('/upload', (req, res) => {
    res.render('upload')
})

app.post('/upload', function(req, res) {
    let sampleFile
    let uploadPath
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.')
    }
  
    sampleFile = req.files.sampleFile                               // The name of the input field ("sampleFile") is used to retrieve the uploaded file
    uploadPath = __dirname + '/uploads/' + sampleFile.name
  
    sampleFile.mv(uploadPath, function(err) {                       // mv() method places the file somewhere in server
      if (err) {
        return res.status(500).send(err)
      }
      // res.send('File uploaded!')                                    // Successfully uploaded file
      res.redirect('/movies')
    })
    setTimeout(() => {
        master_list = csv()                                         // 2 second delay to convert the uploaded file to the master_list
        master_trie = createTrie(master_list)
    }, 2000)
})

// -------------------------------/MOVIES-----------------------------------------------------------------------------------------

app.get('/movies', (req, res) => {
    res.render('master', { display_list: master_list, titles, isMasterList: true})
})

app.get('/movies/search?q=:searchQuery', (req, res) => {
    console.log(searchQuery)
    search_results = searchTrie(master_trie, req.body['searchtext'])
    // Printing out search results
    res.render('master', { display_list: search_results, titles, isMasterList: false})
})

// Show movie details
app.get('/movies/:str', (req, res) => {
    const { str } = req.params
    console.log(str)
    if (str.startsWith('search')) {
        search_results = searchTrie(master_trie, req.query['q'])
        res.render('master', { display_list: search_results, titles, isMasterList: false})

    }
    else {
        const movie = master_list.find(m => m["Const_IMDB"] === str)
        res.render('show', {movie, titles})
    }
})

// -------------------------------/CREATED_LISTS-----------------------------------------------------------------------------------------

app.get('/created_lists', (req, res) => {
    res.render('./created_lists/index', {created_lists})
})

app.get('/created_lists/new', (req, res) => {
    res.render('./created_lists/new')
})

// Show selected list details
app.get('/created_lists/:id', (req, res) => {
    const { id } = req.params
    const selected_list = created_lists.find(m => m["id"] === id)
    res.render('./created_lists/show', {selected_list})
})

// Edit selected list page
app.get('/created_lists/:id/edit', (req, res) => {
    const { id } = req.params
    const selected_list = created_lists.find(m => m.id === id)
    res.render('./created_lists/edit', {selected_list})
})

// Request to edit selected list
app.patch('/created_lists/:id', (req, res) => {
    const { id } = req.params
    const newListName = req.body.editName
    const selected_list = created_lists.find(m => m.id === id)
    selected_list.list_name = newListName
    res.redirect('/created_lists')
})

// Request to delete selected list
app.delete('/created_lists/:id', (req, res) => {
    const { id } = req.params
    created_lists = created_lists.filter(m => m.id !== id)
    res.redirect('/created_lists')
})

// Request to create a new list
app.post('/created_lists', (req, res) => {
    const {listName} = req.body
    created_lists.push({list_name: listName, id: uuid()})
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