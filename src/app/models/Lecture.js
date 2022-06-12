const mongoose = require('../../database')

const userSchema = new mongoose.Schema({

    speaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    confirm: {
        type: Boolean,
        required: true,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('Lecture', userSchema)

module.exports = Lecture