const Movie = require('../models/movie')
const List = require('../models/lists')
const {titles} = require('../routes/variables/titles')
const {MovieList} = require('../js/movieList')

module.exports.findMovies

// Show all movies uploaded
module.exports.index = async (req, res) => {
    const databaseMovies = await Movie.find({})
    res.render('movies', { displayList: databaseMovies, titles, pageTitle: 'Movies List', query: null})
}

// Show movie details
module.exports.showMovie = async (req, res) => {
    // Searches for the movie using the IMDB ID
    const movie = await Movie.findOne({'Const_IMDB': req.params.id})
    const appearsInLists = await List.find({movies: movie})
    
    res.render('show', {movie, titles, appearsInLists: appearsInLists, pageTitle: movie.Title})
}

// Show searched movies
module.exports.movieSearch = async (req, res, next) => {

    if (!req.query.q) {
        return next()
    }

    // If query string present, it displays the searched results
    const databaseMovies = await Movie.find({})
    const masterMovieList = new MovieList(databaseMovies)
    const searchedMovies = masterMovieList.search(req.query.q)
    res.render('movies', { displayList: searchedMovies, titles, pageTitle: 'Search ' + req.query['q'], query: req.query['q']})
}