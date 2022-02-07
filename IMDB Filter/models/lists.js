const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listSchema = new Schema({
    // loginUser: String,
    lists: [
    ]

})

module.exports = mongoose.model('list', listSchema)