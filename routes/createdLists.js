const express = require('express')
const router = express.Router()
const List = require('../models/lists')
const Movie = require('../models/movie')
const { v4: uuid } = require('uuid')                        // Universally unique identifier for createdLists
const {MovieList} = require('../js/movieList')

// Constants
const titles = ['Const_IMDB', 'Your Rating', 'Date Rated', 'Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Genres', 'Num Votes', 'Release Date', 'Directors']


router.get('/', async (req, res) => {
    const databaseLists = await List.find({})
    res.render('./created_lists/index', {displayList: databaseLists, pageTitle: 'Created Lists'})
})

router.get('/new', async (req, res) => {

    let masterMovieList = new MovieList()
    const databaseMovies = await Movie.find({})
    masterMovieList.create(databaseMovies)

    res.render('./created_lists/new', {displayList: masterMovieList, titles, pageTitle: 'Create new List'})
})

// Show selected list details
router.get('/:id', async (req, res) => {
    const selectedList = await List.findOne({id: req.params.id}).populate('movies')
    res.render('./created_lists/show', {selectedList, pageTitle: selectedList.listName})
})

// Edit selected list page
router.get('/:id/edit', async (req, res) => {
    const selectedList = List.findOne({id: req.params.id}).populate('movies')

    // let masterMovieList = new MovieList()
    // const databaseMovies = await Movie.find({})
    // masterMovieList.create(databaseMovies)

    res.render('./created_lists/edit', {selectedList, displayList: masterMovieList, titles, pageTitle: 'Edit List -' + selectedList.listName })
})

// Request to edit selected list
router.patch('/:id', (req, res) => {
    const { id } = req.params

    // Updated parameters
    const newListName = req.body.listName
    const newMovies = JSON.parse(req.body.movies)

    const selectedList = createdLists.find(m => m.id === id)
    selectedList.listName = newListName
    selectedList.movies = newMovies
    
    res.redirect('/created_lists')
})

// Request to delete selected list
router.delete('/:id', async (req, res) => {
    await List.deleteOne({id: req.params.id})
    res.redirect('/created_lists')
})

router.post('/', async (req, res) => {

    // Create list to save to database
    let newList = {
        listName: req.body.listName, 
        id: uuid(), 
        description: req.body.listDescription,
        movies: []
    }
    // Add movies to the new list
    const parsedMovies = JSON.parse(req.body.movies)
    for (let i = 0; i < parsedMovies.length; i++) {
        const foundMovie = await Movie.findById(parsedMovies[i]._id)
        console.log(foundMovie)
        newList.movies.push(foundMovie)
    }

    const createdList = new List(newList)
    await createdList.save()

    res.redirect('/created_lists')
})

module.exports = router