const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shortSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    preferedText: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('shorts', shortSchema)