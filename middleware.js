const ExpressError = require('./utils/ExpressError')
const {listSchema} = require('./schemas')
const {MovieList} = require('./js/movieList')
const Movie = require('./models/movie')
const List = require('./models/lists')

module.exports.isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) {

        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in to create a new list')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateList = (req, res, next) => {
    
    const {error} = listSchema.validate(req.body)
    if (res.error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

module.exports.isAuthorList = async (req, res, next) => {

    const foundList = await List.findOne({id: req.params.id})

    if (!foundList.owner.equals(req.user._id)) {
        req.flash('error', 'You are not the owner of this list!')
        return res.redirect(`/created_lists/${req.params.id}`)
    }
    next()
}

module.exports.isAdmin = async (req, res, next) => {

    if (!req.user || !req.user.isAdmin) {
        const redirectURL = req.session.returnTo || '/movies'
        delete req.session.returnTo

        req.flash('error', 'You do not have admin priviledges!')
        return res.redirect(redirectURL)
    }
    next()
}