const mongoose = require('../../database')

const userSchema = new mongoose.Schema({

})

const City = mongoose.model('City', userSchema)

module.exports = City