const List = require('../models/lists')
const Movie = require('../models/movie')

module.exports.index = async (req, res) => {
    const databaseLists = await List.find({})
    res.render('./created_lists/index', {displayList: databaseLists, pageTitle: 'Created Lists'})
}

module.exports.newForm = async (req, res) => {

    let masterMovieList = new MovieList()
    const databaseMovies = await Movie.find({})
    masterMovieList.create(databaseMovies)

    res.render('./created_lists/new', {displayList: masterMovieList, titles, pageTitle: 'Create new List'})
}

module.exports.renderNewForm = async (req, res) => {

    // if (!req.body.listName) {
    //     throw new ExpressError('Invalid list data', 400)
    // }


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
}

module.exports.showList = async (req, res) => {
    const selectedList = await List.findOne({id: req.params.id}).populate('movies')
    res.render('./created_lists/show', {selectedList, pageTitle: selectedList.listName})
}