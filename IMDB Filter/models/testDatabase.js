const mongoose = require('mongoose')
const Movie = require('./movie')
const csv = require('../js/csvConverter.js')

// Connects to Mongo database
mongoose.connect('mongodb://localhost:27017/testMovieList', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Mongo database connected.')
    })
    .catch((err) => {
        console.error('Mongo database connection error: ', err)
    })

Movie.deleteMany({})
    .then(msg => {
        console.log(msg)
    })
    .catch(err => {
        console.error('Failed to delete existing movie database.')
    })

const movieList = csv([], true, [])
const titles = ['Const_IMDB', 'Your Rating', 'Date Rated', 'Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Genres', 'Num Votes', 'Release Date', 'Directors']

for (let mov of movieList) {
    const newMov = new Movie({
        constIMDB: mov[titles[0]],
        yourRating: mov[titles[1]],
        dateRated: mov[titles[2]],
        title: mov[titles[3]],
        url: mov[titles[4]],
        titleType: mov[titles[5]],
        imdbRating: mov[titles[6]],
        runtime: mov[titles[7]],
        year: mov[titles[8]],
        genres: mov[titles[9]],
        numVotes: mov[titles[10]],
        releaseDate: mov[titles[11]],
        directors: mov[titles[12]]
    })

    newMov.save()
        .then(data => {
            console.log('Movie saved: ')
            console.log(data)
        })
        .catch(err => {
            console.error('Failed to save movie: ', err)
        })

}

console.log(Movie.findOne({}).then(m => console.log(m)))