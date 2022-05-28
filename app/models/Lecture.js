const mongoose = require('../../database')

const userSchema = new mongoose.Schema({

    speaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    title: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    confirm: {
        type: Boolean,
        require: true,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('Lecture', userSchema)

module.exports = Lecture