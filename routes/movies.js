
const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')
const List = require('../models/lists')
const {MovieList} = require('../js/movieList')
const {titles} = require('./variables/titles')
const { listenerCount } = require('../models/movie')

let masterMovieList = new MovieList()


router.use((req, res, next) => {
    next()
})

// Display all movies
router.get('/', async (req, res) => {
    const databaseMovies = await Movie.find({})
    masterMovieList.create(databaseMovies)
    res.render('movies', { displayList: masterMovieList, titles, isMasterList: true, pageTitle: 'Movies List'})
})

// Middleware checks if query string is available
router.use((req, res, next) => {
    if (!req.query.q) {
        return next()
    }
    
    masterMovieList.search(req.query.q)
    res.render('movies', { displayList: masterMovieList, titles, isMasterList: false, pageTitle: 'Search ' + req.query['q']})
    
})

// Show movie details
router.get('/:id', async (req, res) => {
    const movie = await Movie.findOne({'Const_IMDB': req.params.id})
    const appearsInLists = await List.find({movies: movie})
    res.render('show', {movie, titles, displayList: appearsInLists, pageTitle: movie.Title})
})

module.exports = router