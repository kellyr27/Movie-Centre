
const express = require('express')
const router = express.Router({mergeParams: true})
const movieController = require('../controllers/movies')
const {isLoggedIn} = require('../middleware')

// Display all movies
router.route('/')
    .get(movieController.index)

// Middleware checks whether there is a query string
router.use(movieController.movieSearch)

// Show movie details
router.route('/:id')
    .get(isLoggedIn, movieController.showMovie)

module.exports = router