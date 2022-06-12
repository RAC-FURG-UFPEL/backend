const mongoose = require('../../database')

const userSchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    content: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model('Post', userSchema)

module.exports = Post