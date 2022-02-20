// Packages and frameworks
const express = require('express')                          // Web pplication framework
const fileUpload = require('express-fileupload')            // Middleware used to upload files with express
const methodOverride = require('method-override')           // Middleware used to use HTTP verbs such as PUT or DELETE
const ejsMate = require('ejs-mate')                         // Use templating with EJS
const morgan = require('morgan')
const mongoose = require('mongoose')
const Movie = require('./models/movie')


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)   //The maximum is inclusive and the minimum is inclusive
}

// Database connection
mongoose.connect('mongodb://localhost:27017/movie-centre-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error: '))
db.once('open', async () => {
    console.log('Database connected.')
    // Delete everything in the existing Movie database
    await Movie.deleteMany({})
        .then(msg => {
            console.log('Existing database deleted')
        })
        .catch(err => {
            console.log('Failed to delete existing movie database.')
        })
})


const path = require('path')                                // Path module
const fs = require('fs')                                    // File System module

// Personal libraries
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

// MIDDLEWARE
app.use((req, res, next) => {
    // console.log('Middleware')
    req.requestTime = Date.now()
    next()
})


// -------------------------------/UPLOAD-----------------------------------------------------------------------------------------

const uploadRoutes = require('./routes/upload.js')
app.use('/upload', uploadRoutes)

// -------------------------------/MOVIES-----------------------------------------------------------------------------------------

const movieRoutes = require('./routes/movies.js')
app.use('/movies', movieRoutes)

// -------------------------------/CREATED_LISTS-----------------------------------------------------------------------------------------

const createdListsRoutes = require('./routes/createdLists.js')
app.use('/created_lists', createdListsRoutes)

// -------------------------------SERVER/START-UP-----------------------------------------------------------------------------------------

app.listen(3000, () => {
    console.log('Listening on Port 3000')
})

// // Redirect routes to /movies
// app.get('*', (req, res) => {
//     res.redirect('/movies')
// })

app.use((req, res) => {
    res.status(404).send('Not found!')
})