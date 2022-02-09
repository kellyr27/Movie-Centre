const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('./created_lists/index', {displayList: createdLists, pageTitle: 'Created Lists'})
})

router.get('/new', (req, res) => {
    res.render('./created_lists/new', {displayList: masterMovieList, titles, pageTitle: 'Create new List'})
})

// Show selected list details
router.get('/:id', (req, res) => {
    const { id } = req.params
    const selectedList = createdLists.find(m => m["id"] === id)
    res.render('./created_lists/show', {selectedList, pageTitle: selectedList.listName})
})

// Edit selected list page
router.get('/:id/edit', (req, res) => {
    const { id } = req.params
    const selectedList = createdLists.find(m => m.id === id)
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
router.delete('/:id', (req, res) => {
    const { id } = req.params
    createdLists = createdLists.filter(m => m.id !== id)
    res.redirect('/created_lists')
})

router.post('/', (req, res) => {
    let newList = {listName: req.body.listName, id: uuid(), movies: JSON.parse(req.body.movies)}
    createdLists.push(newList)
    res.redirect('/created_lists')
})
