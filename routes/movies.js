
const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')
const titles = ['Const_IMDB', 'Your Rating', 'Date Rated', 'Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Genres', 'Num Votes', 'Release Date', 'Directors']
const {MovieList} = require('../js/movieList')

let masterMovieList = new MovieList()

router.get('/', async (req, res) => {

    const databaseMovies = await Movie.find({})
    masterMovieList.create(databaseMovies)
    res.render('movies', { displayList: masterMovieList, titles, isMasterList: true, pageTitle: 'Movies List'})
})


// Show movie details
router.get('/:str', async (req, res) => {

    const { str } = req.params

    // Search query
    if (str.startsWith('search')) {
        // Save search queries

        masterMovieList.search(req.query['q'])

        res.render('movies', { displayList: masterMovieList, titles, isMasterList: false, pageTitle: 'Search ' + req.query['q']})
    }

    // Show
    else {
        const movie = await Movie.findOne({'Const_IMDB': str})
        res.render('show', {movie, titles, displayList: [], pageTitle: movie.Title})
    }
})

module.exports = router