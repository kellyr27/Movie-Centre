const List = require('../models/lists')
const Movie = require('../models/movie')
const { v4: uuid } = require('uuid')                        // Universally unique identifier for createdLists
const {titles} = require('../routes/variables/titles')
const mongoose = require('mongoose')

module.exports.index = async (req, res) => {
    let databaseLists = []
    if (req.user) {
        databaseLists = await List.find({owner: mongoose.Types.ObjectId(req.user._id)})
    }
    res.render('./created_lists/index', {displayList: databaseLists, pageTitle: 'Created Lists'})
}

module.exports.newForm = async (req, res) => {
    const databaseMovies = await Movie.find({owner: mongoose.Types.ObjectId(req.user._id)})
    res.render('./created_lists/new', {displayList: databaseMovies, titles, pageTitle: 'Create new List'})
}

module.exports.renderNewForm = async (req, res) => {

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

    // Save created list
    const createdList = new List(newList)
    await createdList.save()

    req.flash('success', 'Successfully made a new list!')
    res.redirect('/created_lists')
}

module.exports.showList = async (req, res) => {
    const selectedList = await List.findOne({id: req.params.id}).populate('movies')
    res.render('./created_lists/show', {selectedList, pageTitle: selectedList.listName})
}

module.exports.editList = async (req, res) => {

    // Get new list
    let newMovieList = []
    if (req.body.movies) {
        const parsedMovies = JSON.parse(req.body.movies)
        for (let i = 0; i < parsedMovies.length; i++) {
            const foundMovie = await Movie.findById(parsedMovies[i]._id)
            newMovieList.push(foundMovie)
        }
    }

    // Update the list
    await List.findOneAndUpdate({id: req.params.id}, {
        listName: req.body.listName,
        description: req.body.listDescription,
        movies: newMovieList
    })
    
    req.flash('success', 'Successfully edited list!')
    res.redirect(`/created_lists/${req.params.id}`)
}

module.exports.deleteList = async (req, res) => {
    await List.deleteOne({id: req.params.id})

    req.flash('success', 'Successfully deleted list!')
    res.redirect('/created_lists')
}

module.exports.showEditList = async (req, res) => {
    const selectedList = await List.findOne({id: req.params.id}).populate('movies')
    const databaseMovies = await Movie.find({owner: mongoose.Types.ObjectId(req.user._id)})

    res.render('./created_lists/edit', {selectedList, displayList: databaseMovies, titles, pageTitle: 'Edit List -' + selectedList.listName })
}