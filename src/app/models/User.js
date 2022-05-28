const mongoose = require('../../database')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({

    // Required fields
    role: {
        type: Number,
        require: true,
        default: 001
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    birthDate: {
        type: Date,
        require: true
    },
    cpf: {
        type: String,
        require: true,
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

    // Optional fields

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