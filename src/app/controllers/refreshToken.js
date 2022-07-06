// Require Packages
const jwt = require('jsonwebtoken')

// DotEnv
require('dotenv').config()

// Require Models
const User = require('../models/User')

// Require Other configs
const authConfig = require('../../config/auth')

// Refresh Token
const handleRefreshToken = async (req, res) => {

    const cookies = req.cookies

    if (!cookies?.jwt) {
        return res.sendStatus(401)
    }

    console.log(cookies.jwt)
    const refreshToken = cookies.jwt

    const user = await User.findOne({ refreshToken })

    if (!user) {
        return res.sendStatus(403)
    }

    const role = user.role

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log(user.id + ' DECODED: ' + decoded.id)
            if (err || user.id !== decoded.id) {
                return res.sendStatus(403)
            }
            const accessToken = jwt.sign(
                { id: user.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )
            res.json({ role, accessToken })
        }
    )
}

module.exports = { handleRefreshToken }