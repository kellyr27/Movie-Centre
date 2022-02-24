const express = require('express')
const router = express.Router({mergeParams: true})
const List = require('../models/lists')
const Movie = require('../models/movie')
const { v4: uuid } = require('uuid')                        // Universally unique identifier for createdLists
const {MovieList} = require('../js/movieList')
const {titles} = require('./variables/titles')
const {isLoggedIn, isAuthor, validateList} = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const { application } = require('express')
const Joi = require('joi')
const createdLists = require('../controllers/createdLists')


router.route('/')
    .get(catchAsync(createdLists.index))
    .post(validateList, isLoggedIn, catchAsync(createdLists.renderNewForm))

// Display the page for creating a new list
router.get('/new', isLoggedIn, createdLists.index)

// Show selected list details
router.get('/:id', isLoggedIn, isAuthor, catchAsync(createdLists.showList))

// Edit selected list page
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const selectedList = await List.findOne({id: req.params.id}).populate('movies')
    let masterMovieList = new MovieList()
    const databaseMovies = await Movie.find({})
    masterMovieList.create(databaseMovies)

    res.render('./created_lists/edit', {selectedList, displayList: masterMovieList, titles, pageTitle: 'Edit List -' + selectedList.listName })
})

// Request to edit selected list
router.patch('/:id', validateList, isLoggedIn, isAuthor, catchAsync(async (req, res) => {

    const foundList = await List.findById({id: req.params.id})

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
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await List.deleteOne({id: req.params.id})

    req.flash('success', 'Successfully deleted list!')
    res.redirect('/created_lists')
}))




module.exports = router