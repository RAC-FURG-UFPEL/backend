// Essentials
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
// FS ; Path ; Session ; FileUpload
const fs = require('fs')
const session = require('express-session')
var path = require('path')
const fileupload = require('express-fileupload')
// Custom Middlewares
const { logger } = require('./app/middlewares/logEvents')
const errorHandler = require('./app/middlewares/errorHandler')
const cookieParser = require('cookie-parser')

// Dotenv
const PORT = process.env.PORT

// Custom Middleware Logger
app.use(logger)

// Allow Credentials
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// CORS - Cross Origin Resource Sharing
const cors = require('cors')
const allowedList = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5000'
]
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

/* app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: true
})) */

// File Upload
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}))

// Built-In Middlewares URL Encoded ; JSON ; Static Files
app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))

// Cookies
app.use(cookieParser())

// Favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Default Response
app.get('/', (req, res) => {
    res.json({ message: 'Successfully connected' })
})

// Routes
require('./app/routes/index')(app)

// 404
app.all('*', (req, res) => {
    res.status(404).json({ error: '404 Not found', message: 'Request not found. Please, check the documentation!' })
})

// Error Return
app.use(errorHandler)

// Serve
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})