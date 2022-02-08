const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({
    constIMDB: {
        type: String,
        required: true,
        match: /^(tt)/
    },
    yourRating: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
    },
    dateRated: {
        type: String,
        required: true,
        match: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        match: /^(https:\/\/www.imdb.com\/title\/)/
    },
    titleType: {
        type: String,
        required: true,
        enum: ['tvSeries', 'video', 'tvSpecial', 'movie', 'tvMiniSeries', 'tvMovie', 'tvEpisode']
    },
    imdbRating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    runtime: {
        type: Number,
        required: true,
        min: 0
    },
    year: {
        type: Number,
        required: true,
        min: 1800
    },
    genres: [{
        type: String
    }],
    numVotes: {
        type: Number,
        required: true,
        min: 0
    },
    releaseDate: {
        type: String,
        required: true,
        match: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    },
    directors: [{
        type: String,
        }],
        required: false
})

module.exports = mongoose.model('Movie', movieSchema)