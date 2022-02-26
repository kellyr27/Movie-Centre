const User = require('../models/user')
const Movie = require('../models/movie')
const List = require('../models/lists')
const mongoose = require('mongoose')

module.exports.showRegister = (req, res) => {
    res.render('users/register', {pageTitle: 'Register'})
}

module.exports.postRegistration = async (req, res) => {
    try {
        const { username, email, password} = req.body
        const user = new User({email, username})
        registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Register successful. Welcome to Movie Centre!')
            res.redirect('/movies')
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

module.exports.showLogin = (req, res) => {
    res.render('users/login', {pageTitle: 'Login'})
}

module.exports.postLogin = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectURL = req.session.returnTo || '/movies'
    delete req.session.returnTo
    res.redirect(redirectURL)
}

module.exports.showLogout = (req, res) => {
    req.logout()
    req.flash('success', 'You have successfully logged out.')
    res.redirect('/movies')
}

module.exports.userSettings = (req, res) => {
    res.render('users/settings', {pageTitle: req.params.user + ' Settings'})
}

module.exports.showAdmin = (req, res) => {
    res.render('admin', {pageTitle: 'Admin'})
}

module.exports.deleteUserDatabase = async (req, res) => {

    // Delete everything in the existing Movie database
    await Movie.deleteMany({owner: mongoose.Types.ObjectId(req.user._id)})
        .then(msg => {
            console.log('Existing Movie database deleted')
        })
        .catch(err => {
            console.log('Failed to delete existing Movie database.')
        })
    // Delete everything in the existing List database
    await List.deleteMany({owner: mongoose.Types.ObjectId(req.user._id)})
        .then(msg => {
            console.log('Existing List database deleted')
        })
        .catch(err => {
            console.log('Failed to delete existing List database.')
        })
    
    res.redirect('/movies')
}

module.exports.deleteUsers = async (req, res) => {
    req.logout()

    // Make admin (if not already created)
    await User.deleteMany({})
        .then(msg => {
            console.log('Existing User database deleted')
        })
        .catch(err => {
            console.log('Failed to delete existing List database.')
        })

    // Make admin (if not already created)
    let searchUser = await User.find({username: 'admin'})
    if (searchUser.length == 0) {
        const user = new User({email: 'admin@gmail.com', username: 'admin', isAdmin: true})
        await User.register(user, 'admin')
    }

    res.redirect('/movies')
}