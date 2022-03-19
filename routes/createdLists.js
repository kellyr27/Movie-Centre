const express = require('express')
const router = express.Router({mergeParams: true})
const {isLoggedIn, isAuthorList, validateList} = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const createdListsRoutes = require('../controllers/createdLists')


router.route('/')
    .get(catchAsync(createdListsRoutes.index))
    .post(validateList, isLoggedIn, catchAsync(createdListsRoutes.renderNewForm))

// Display the page for creating a new list
router.route('/new')
    .get(isLoggedIn, createdListsRoutes.newForm)

router.route('/:id')
    .get(isLoggedIn, isAuthorList, catchAsync(createdListsRoutes.showList))                         // Show selected list details
    .patch(validateList, isLoggedIn, isAuthorList, catchAsync(createdListsRoutes.editList))       // Request to edit selected list
    .delete(isLoggedIn, isAuthorList, catchAsync(createdListsRoutes.deleteList))            // Request to delete selected list

// Edit selected list page
router.route('/:id/edit')
    .get(isLoggedIn, isAuthorList, createdListsRoutes.showEditList)

module.exports = router