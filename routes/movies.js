
const express = require('express')
const router = express.Router({mergeParams: true})
const movieController = require('../controllers/movies')

// Display all movies
router.get('/', movieController.index)

// Middleware checks whether there is a query string
router.use(movieController.movieSearch)

// Show movie details
router.get('/:id', movieController.showMovie)

module.exports = router