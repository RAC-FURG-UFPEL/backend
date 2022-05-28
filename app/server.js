// Dotenv
require('dotenv').config()
const PORT = process.env.PORT

// Express
const express = require('express')
const app = express()

// Mongoose
const mongoose = require('mongoose')

app.get('/', (req,res) => {
    res.send('Bora RAC')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})