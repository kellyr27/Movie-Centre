const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({
    'Const_IMDB': {
        type: String,
        required: true,
        match: /^(tt)/
    },
    'Your Rating': {
        type: Number,
        required: false,
        min: 0,
        max: 10,
    },
    'Date Rated': {
        type: Date,
        required: false
    },
    'Title': {
        type: String,
        required: true
    },
    'URL': {
        type: String,
        required: true,
        match: /^(https:\/\/www.imdb.com\/title\/)/
    },
    'Title Type': {
        type: String,
        required: true,
        enum: ['tvSeries', 'video', 'tvSpecial', 'movie', 'tvMiniSeries', 'tvMovie', 'tvEpisode']
    },
    'IMDb Rating': {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    'Runtime (mins)': {
        type: Number,
        required: true,
        min: 0
    },
    'Year': {
        type: Number,
        required: true,
        min: 1800
    },
    'Genres': [{
        type: String
    }],
    'Num Votes': {
        type: Number,
        required: true,
        min: 0
    },
    'Release Date': {
        type: Date,
        required: true
    },
    'Directors': [{
        type: String,
        required: false
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Movie', movieSchema)