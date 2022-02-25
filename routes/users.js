const express = require('express')
const router = express.Router();
const passport = require('passport')
const usersController = require('../controllers/users')
const mongoose = require('mongoose')
const Movie = require('../models/movie')
const List = require('../models/lists')

router.route('/register')
    .get(usersController.showRegister)
    .post(usersController.postRegistration)

router.route('/login')
    .get(usersController.showLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), usersController.postLogin)

router.get('/logout', usersController.showLogout)

router.route('/admin')
    .get(usersController.showAdmin)
    .post(usersController.postAdmin)

router.route('/:user/settings')
    .get(usersController.userSettings)
    .delete(usersController.deleteUserDatabase)

module.exports = router