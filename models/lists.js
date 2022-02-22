const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listSchema = new Schema({
    listName: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    movies: [{
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: false  
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

})

module.exports = mongoose.model('movieList', listSchema)