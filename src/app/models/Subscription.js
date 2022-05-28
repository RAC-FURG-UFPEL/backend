const mongoose = require('../../database')

const userSchema = new mongoose.Schema({

    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    presence: {
        type: Boolean,
        require: true,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('Subscription', userSchema)

module.exports = Subscription