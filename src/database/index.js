// Main Settings
const mongoose = require('mongoose')
require('dotenv').config()

// Mongo Atlas Credentials
const dbhost = process.env.DB_HOST
const dbuser = process.env.DB_USER
const dbpwd = encodeURIComponent(process.env.DB_PASS)
const dburl = `mongodb://${dbuser}:${dbpwd}@${dbhost}`

mongoose.connect(dburl, { useNewUrlParser: true }, function (err) { 
    if (err) throw err; console.log('Successfully connected to Database!'); });

mongoose.Promise = global.Promise

module.exports = mongoose