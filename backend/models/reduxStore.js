const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reduxStoreSchema = new Schema({
    isLoggedIn: {
        type: Boolean,
        required: true
    },
    userData: {
        type: Object,
        required: true
    },
    email: {
        type: String
    }
})

module.exports = mongoose.model('reduxData', reduxStoreSchema)