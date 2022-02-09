
const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')
const convertOldMovie = require('../js/convertOldMovie')
const titles = ['Const_IMDB', 'Your Rating', 'Date Rated', 'Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Genres', 'Num Votes', 'Release Date', 'Directors']

router.get('/', async (req, res) => {

    const databaseMovies = await Movie.find({})
    console.log(convertOldMovie(databaseMovies))
    let masterMovieList = []
    // let masterMovieList = convertOldMovie(databaseMovies)
    res.render('movies', { displayList: masterMovieList, titles, isMasterList: true, pageTitle: 'Movies List'})
})


// Show movie details
// router.get('/:str', (req, res) => {

//     const { str } = req.params
//     if (str.startsWith('search')) {
//         // Save search queries

//         masterMovieList.search(req.query['q'])

//         res.render('movies', { displayList: masterMovieList, titles, isMasterList: false, pageTitle: 'Search ' + req.query['q']})
//     }
//     else {

//         const movie = masterMovieList.activeList.find(m => m["Const_IMDB"] === str)
//         res.render('show', {movie, titles, displayList: createdLists, pageTitle: movie.Title})
//     }
// })

module.exports = router