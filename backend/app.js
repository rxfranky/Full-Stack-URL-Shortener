const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './.env.local' })

const authRoutes = require('./routes/auth')
const consumerRoutes = require('./routes/consumer')

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded())

app.use(cors())

app.use(authRoutes)
app.use(consumerRoutes)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('connected to db')
    })
    .catch(() => {
        console.log('err in conn to db')
    })


app.listen(4000, (err) => {
    if (err) {
        return console.log('err in creating server')
    }
    console.log('app running on 4000')
})