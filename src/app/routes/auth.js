// Require Packages
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

// DotEnv
require('dotenv').config()

// Require Models
const User = require('../models/User')

// Require Other configs
const authConfig = require('../../config/auth')

// Functions
function generateTokens(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

// Routes
// Registration
router.post('/register', async (req, res) => {
    const { email } = req.body
    
    try {
        if (await User.findOne( { email } ))
            return res.status(409).send({ error: 'User already exists!' })

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({
            user,
            token: generateTokens({ id: user.id })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: 'Registration failed' })
    }
})

// Authentication
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return res.status(400).send({ error: 'User not found' })
    }
        
    if(!await bcrypt.compare(password, user.password)){
        return res.status(401).send({ error: 'Invalid password' })
    }

    user.password = undefined

    const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    // const token = generateTokens({ id: user.id })

    const roles = user.roles

    const currentUser = await User.findByIdAndUpdate(user._id, {
        refreshToken
    }, { new: true })

    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

    res.send({
        user,
        roles,
        accessToken
    })
})

// Forgotten Password
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).send({ error: 'User not found' })
        }

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        console.log(token, now)

        mailer.sendMail({
            to: email,
            from: 'andrew.ribeiro@outlook.com',
            template: 'auth/forgot_password',
            context: {token}
        }, (err) => {
            if (err){
                return res.status(400).send({ error: 'Cannot send token' })
            }else{
                return res.send()
            }
        })

    } catch (err) {
        res.status(400).send({ error: 'Error' })
    }
})

// Reset Password
router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body

    try{

        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')
        
        if(!user)
            return res.status(400).send({ error: 'User not found' })

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Invalid token' })

        const now = new Date()

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Expired token' })

        user.password = password
        
        await user.save()

        res.send()

    } catch (err) {
        res.status(400).send({ error: 'Cannot reset password' })
    }
})

// Exports
module.exports = app => app.use('/auth', router)