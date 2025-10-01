const mongoose = require('mongoose')

const Schema = mongoose.Schema

const signupSchema = new Schema({
    name: {
        type: String,
        reduired: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    provider: {
        type: String
    },
    picture: {
        type: String,
    },
    token: {
        type: String
    },
    resetTokenExp: {
        type: Number
    }
})

module.exports = mongoose.model('users', signupSchema)