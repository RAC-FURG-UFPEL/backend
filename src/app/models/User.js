const mongoose = require('../../database')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({

    // Required fields
    role: {
        type: Number,
        required: true,
        default: 001
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    preferredNames: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    birthDate: {
        type: Date,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },

    // Optional

    title: {
        type: String
    },
    spec: {
        type: String
    },
    affiliation: {
        type: String        
    },
    university: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },


    // Token management

    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User