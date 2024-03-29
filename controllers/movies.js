const Movie = require('../models/movie')
const List = require('../models/lists')
const {titles} = require('../routes/variables/titles')
const {MovieList} = require('../js/movieList')
const mongoose = require('mongoose')

// Show all movies uploaded
module.exports.index = async (req, res) => {
    let databaseMovies = []

    // If currently logged in
    if (req.user) {
        databaseMovies = await Movie.find({owner: mongoose.Types.ObjectId(req.user._id)})
    }

    res.render('movies', { displayList: databaseMovies, titles, pageTitle: 'Movies List', query: null, tableColumns: [3, 6, 8]})
}

// Show movie details
module.exports.showMovie = async (req, res) => {
    // Searches for the movie using the IMDB ID
    const movie = await Movie.findOne({owner: mongoose.Types.ObjectId(req.user._id), 'Const_IMDB': req.params.id})

    if (movie === null) {
        req.flash('error', 'Movie does not exist in your database!')
        return res.redirect(`/movies`)
    }

    const appearsInLists = await List.find({movies: movie, owner: mongoose.Types.ObjectId(req.user._id)})
    
    res.render('show', {movie, titles, appearsInLists: appearsInLists, pageTitle: movie.Title})
}

// Show searched movies
module.exports.movieSearch = async (req, res, next) => {

    if (!req.query.q) {
        return next()
    }
    // If query string present, it displays the searched results
    const databaseMovies = await Movie.find({owner: mongoose.Types.ObjectId(req.user._id)})

    const masterMovieList = new MovieList(databaseMovies)
    const searchedMovies = masterMovieList.search(req.query.q)
    res.render('movies', { displayList: searchedMovies, titles, pageTitle: 'Search ' + req.query['q'], query: req.query['q'], tableColumns: JSON.parse(req.query.savedColumns)})
}