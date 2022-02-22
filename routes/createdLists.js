const express = require('express')
const router = express.Router({mergeParams: true})
const List = require('../models/lists')
const Movie = require('../models/movie')
const { v4: uuid } = require('uuid')                        // Universally unique identifier for createdLists
const {MovieList} = require('../js/movieList')
const {titles} = require('./variables/titles')
const {isLoggedIn} = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const { application } = require('express')
const ExpressError = require('../utils/ExpressError')

// Display all created lists
router.get('/', async (req, res) => {
    const databaseLists = await List.find({})
    res.render('./created_lists/index', {displayList: databaseLists, pageTitle: 'Created Lists'})
})

// Display the page for creating a new list
router.get('/new', isLoggedIn, async (req, res) => {

    let masterMovieList = new MovieList()
    const databaseMovies = await Movie.find({})
    masterMovieList.create(databaseMovies)

    res.render('./created_lists/new', {displayList: masterMovieList, titles, pageTitle: 'Create new List'})
})

// Show selected list details
router.get('/:id', catchAsync(async (req, res) => {
    const selectedList = await List.findOne({id: req.params.id}).populate('movies')
    res.render('./created_lists/show', {selectedList, pageTitle: selectedList.listName})
}))

// Edit selected list page
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const selectedList = await List.findOne({id: req.params.id}).populate('movies')
    let masterMovieList = new MovieList()
    const databaseMovies = await Movie.find({})
    masterMovieList.create(databaseMovies)

    res.render('./created_lists/edit', {selectedList, displayList: masterMovieList, titles, pageTitle: 'Edit List -' + selectedList.listName })
})

// Request to edit selected list
router.patch('/:id', isLoggedIn, catchAsync(async (req, res) => {

    const foundList = await List.findById({id: req.params.id})
    if (!foundList.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!')
        return res.redirect(`/created_lists/${req.params.id}`)
    }

    // Get new list
    let newMovieList = []
    if (req.body.movies) {
        const parsedMovies = JSON.parse(req.body.movies)
        for (let i = 0; i < parsedMovies.length; i++) {
            const foundMovie = await Movie.findById(parsedMovies[i]._id)
            newMovieList.push(foundMovie)
        }
    }


    await List.findOneAndUpdate({id: req.params.id}, {
        listName: req.body.listName,
        description: req.body.listDescription,
        movies: newMovieList
    })
    
    req.flash('success', 'Successfully edited list!')
    res.redirect(`/created_lists/${req.params.id}`)
}))

// Request to delete selected list
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    await List.deleteOne({id: req.params.id})

    req.flash('success', 'Successfully deleted list!')
    res.redirect('/created_lists')
}))

router.post('/', isLoggedIn, catchAsync(async (req, res) => {

    if (!req.body.listName) {
        throw new ExpressError('Invalid list data', 400)
    }

    // Create list to save to database
    let newList = {
        listName: req.body.listName, 
        id: uuid(), 
        description: req.body.listDescription,
        movies: [],
        owner: req.user._id
    }

    // Add movies to the new list
    if (req.body.movies) {
        const parsedMovies = JSON.parse(req.body.movies)
        for (let i = 0; i < parsedMovies.length; i++) {
            const foundMovie = await Movie.findById(parsedMovies[i]._id)
            newList.movies.push(foundMovie)
        }
    }

    const createdList = new List(newList)
    await createdList.save()

    req.flash('success', 'Successfully made a new list!')
    res.redirect('/created_lists')
}))



module.exports = router