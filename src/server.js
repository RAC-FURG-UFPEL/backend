// Dotenv
require('dotenv').config()
const PORT = process.env.PORT

// Express
const express = require('express')
const app = express()

// CORS
const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:3000'
}))

// Mongoose
const mongoose = require('mongoose')

// URL Encoded
app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json())

// Default Response
app.get('/', (req,res) => {
    res.send('Successfully connected')
})

// Controllers
require('./app/controllers/index')(app)

// Serve
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})