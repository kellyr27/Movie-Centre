const express = require('express')
const User = require('../models/user')
const router = require('./upload')
const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('users/register', {pageTitle: 'Register'})
})

router.post('/register', async (req, res) => {
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
})

router.get('/login', (req, res) => {
    res.render('users/login', {pageTitle: 'Login'})
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectURL = req.session.returnTo || '/movies'
    delete req.session.returnTo
    res.redirect(redirectURL)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'You have successfully logged out.')
    res.redirect('/movies')
})

module.exports = router