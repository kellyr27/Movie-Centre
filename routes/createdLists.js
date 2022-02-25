const express = require('express')
const router = express.Router({mergeParams: true})
const {isLoggedIn, isAuthor, validateList} = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const createdListsRoutes = require('../controllers/createdLists')


router.route('/')
    .get(catchAsync(createdListsRoutes.index))
    .post(validateList, isLoggedIn, catchAsync(createdListsRoutes.renderNewForm))

// Display the page for creating a new list
router.get('/new', isLoggedIn, createdListsRoutes.newForm)

router.route('/:id')
    .get(isLoggedIn, isAuthor, catchAsync(createdListsRoutes.showList))                         // Show selected list details
    .patch(validateList, isLoggedIn, isAuthor, catchAsync(createdListsRoutes.editList))       // Request to edit selected list
    .delete(isLoggedIn, isAuthor, catchAsync(createdListsRoutes.deleteList))            // Request to delete selected list

// Edit selected list page
router.get('/:id/edit', isLoggedIn, createdListsRoutes.showEditList)

module.exports = router